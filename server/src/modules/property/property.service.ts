import { FilterQuery } from 'mongoose';
import { Property, IProperty } from './property.model';
import { Category } from '../category/category.model';
import { ApiError } from '../../utils/ApiError';
import { parsePagination, buildMeta } from '../../utils/pagination';
import { cloudinary } from '../../config/cloudinary';

interface PropertyQuery {
  search?: string;
  purpose?: string;
  type?: string;
  category?: string;
  city?: string;
  minPrice?: string;
  maxPrice?: string;
  bedrooms?: string;
  status?: string;
  sort?: string;
  page?: string;
  limit?: string;
}

const SORT_MAP: Record<string, Record<string, 1 | -1>> = {
  price_asc: { price: 1 },
  price_desc: { price: -1 },
  newest: { createdAt: -1 },
  rating: { averageRating: -1 },
};

export async function listProperties(query: PropertyQuery) {
  const { page, limit, skip } = parsePagination(query as Record<string, unknown>);
  const filter: FilterQuery<IProperty> = {};

  if (query.search) filter.$text = { $search: query.search };
  if (query.purpose) filter.purpose = query.purpose;
  if (query.type) filter.type = query.type;
  if (query.category) filter.category = query.category as unknown as FilterQuery<IProperty>['category'];
  if (query.city) filter['location.city'] = { $regex: query.city, $options: 'i' };
  if (query.status) filter.status = query.status;
  if (query.bedrooms) filter['specifications.bedrooms'] = { $gte: Number(query.bedrooms) };
  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }

  const sort = SORT_MAP[query.sort ?? 'newest'] ?? SORT_MAP.newest;

  const [properties, total] = await Promise.all([
    Property.find(filter).populate('category', 'name slug').sort(sort).skip(skip).limit(limit),
    Property.countDocuments(filter),
  ]);

  return { properties, meta: buildMeta(page, limit, total) };
}

export async function getFeaturedProperties() {
  return Property.find({ isFeatured: true, status: 'available' })
    .populate('category', 'name slug')
    .sort({ createdAt: -1 })
    .limit(8);
}

export async function getPropertyBySlug(slug: string, incrementViews = false) {
  const property = await Property.findOne({ slug }).populate('category', 'name slug').populate('listedBy', 'name avatar email');
  if (!property) throw ApiError.notFound('Property not found');
  if (incrementViews) {
    property.views += 1;
    await property.save();
  }
  return property;
}

export async function getPropertyById(id: string) {
  const property = await Property.findById(id);
  if (!property) throw ApiError.notFound('Property not found');
  return property;
}

export async function getRelatedProperties(id: string) {
  const property = await Property.findById(id);
  if (!property) throw ApiError.notFound('Property not found');

  return Property.find({
    _id: { $ne: property._id },
    $or: [{ category: property.category }, { 'location.city': property.location.city }],
    status: 'available',
  })
    .populate('category', 'name slug')
    .limit(4);
}

export async function createProperty(
  data: Record<string, unknown>,
  listedBy: string,
  files: Express.Multer.File[]
) {
  if (!files || files.length < 1) {
    throw ApiError.badRequest('At least one property image is required', { images: 'Upload at least one image' });
  }

  const categoryExists = await Category.findById(data.category);
  if (!categoryExists) throw ApiError.badRequest('Selected category does not exist', { category: 'Invalid category' });

  const images = files.map((file) => ({
    url: (file as unknown as { path: string }).path,
    publicId: (file as unknown as { filename: string }).filename,
  }));

  const property = await Property.create({ ...data, images, listedBy });
  await Category.findByIdAndUpdate(categoryExists._id, { $inc: { propertyCount: 1 } });
  return property;
}

export async function updateProperty(
  id: string,
  data: Record<string, unknown>,
  files?: Express.Multer.File[]
) {
  const property = await Property.findById(id);
  if (!property) throw ApiError.notFound('Property not found');

  const previousCategory = property.category.toString();

  if (files && files.length > 0) {
    // Replace image set: remove old assets from Cloudinary, store new ones.
    await Promise.all(
      property.images.map((img) => cloudinary.uploader.destroy(img.publicId).catch(() => undefined))
    );
    property.images = files.map((file) => ({
      url: (file as unknown as { path: string }).path,
      publicId: (file as unknown as { filename: string }).filename,
    }));
  }

  Object.assign(property, data);
  await property.save();

  if (data.category && String(data.category) !== previousCategory) {
    await Category.findByIdAndUpdate(previousCategory, { $inc: { propertyCount: -1 } });
    await Category.findByIdAndUpdate(data.category, { $inc: { propertyCount: 1 } });
  }

  return property;
}

export async function deleteProperty(id: string) {
  const property = await Property.findById(id);
  if (!property) throw ApiError.notFound('Property not found');

  await Promise.all(
    property.images.map((img) => cloudinary.uploader.destroy(img.publicId).catch(() => undefined))
  );
  await Category.findByIdAndUpdate(property.category, { $inc: { propertyCount: -1 } });
  await property.deleteOne();
}

export async function recalculateRating(propertyId: string, averageRating: number, reviewCount: number) {
  await Property.findByIdAndUpdate(propertyId, { averageRating, reviewCount });
}
