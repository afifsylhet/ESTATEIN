import { Blog } from './blog.model';
import { ApiError } from '../../utils/ApiError';
import { parsePagination, buildMeta } from '../../utils/pagination';
import { cloudinary } from '../../config/cloudinary';

export async function listPublishedBlogs(query: Record<string, unknown>) {
  const { page, limit, skip } = parsePagination(query);
  const filter = { isPublished: true };
  const [blogs, total] = await Promise.all([
    Blog.find(filter).populate('author', 'name avatar').sort({ createdAt: -1 }).skip(skip).limit(limit),
    Blog.countDocuments(filter),
  ]);
  return { blogs, meta: buildMeta(page, limit, total) };
}

export async function listAllBlogsAdmin(query: Record<string, unknown>) {
  const { page, limit, skip } = parsePagination(query);
  const [blogs, total] = await Promise.all([
    Blog.find().populate('author', 'name avatar').sort({ createdAt: -1 }).skip(skip).limit(limit),
    Blog.countDocuments(),
  ]);
  return { blogs, meta: buildMeta(page, limit, total) };
}

export async function getLatestBlogs(limit = 3) {
  return Blog.find({ isPublished: true }).populate('author', 'name avatar').sort({ createdAt: -1 }).limit(limit);
}

export async function getBlogBySlug(slug: string) {
  const blog = await Blog.findOne({ slug }).populate('author', 'name avatar');
  if (!blog) throw ApiError.notFound('Blog post not found');
  blog.views += 1;
  await blog.save();
  return blog;
}

export async function createBlog(data: Record<string, unknown>, authorId: string, file?: Express.Multer.File) {
  if (!file) throw ApiError.badRequest('A cover image is required', { coverImage: 'Upload a cover image' });
  const coverImage = {
    url: (file as unknown as { path: string }).path,
    publicId: (file as unknown as { filename: string }).filename,
  };
  return Blog.create({ ...data, coverImage, author: authorId });
}

export async function updateBlog(id: string, data: Record<string, unknown>, file?: Express.Multer.File) {
  const blog = await Blog.findById(id);
  if (!blog) throw ApiError.notFound('Blog post not found');

  if (file) {
    await cloudinary.uploader.destroy(blog.coverImage.publicId).catch(() => undefined);
    blog.coverImage = {
      url: (file as unknown as { path: string }).path,
      publicId: (file as unknown as { filename: string }).filename,
    };
  }
  Object.assign(blog, data);
  await blog.save();
  return blog;
}

export async function deleteBlog(id: string) {
  const blog = await Blog.findById(id);
  if (!blog) throw ApiError.notFound('Blog post not found');
  await cloudinary.uploader.destroy(blog.coverImage.publicId).catch(() => undefined);
  await blog.deleteOne();
}
