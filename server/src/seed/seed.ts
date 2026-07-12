/**
 * Full database seed. Wipes and repopulates every collection with rich,
 * realistic, production-quality data so the entire application is driven by the
 * backend — no hardcoded frontend content anywhere.
 *
 * Documents are inserted through the native driver with explicit createdAt /
 * updatedAt values spread across the past year, so dashboard charts (properties
 * per month, inquiries over time) show meaningful trends instead of a single spike.
 *
 * Run with: `npm run seed`
 */
import mongoose, { Types } from 'mongoose';
import bcrypt from 'bcrypt';
import slugify from 'slugify';
import { connectDB, disconnectDB } from '../config/db';
import { env } from '../config/env';
import { User } from '../modules/user/user.model';
import { Category } from '../modules/category/category.model';
import { Property } from '../modules/property/property.model';
import { Review } from '../modules/review/review.model';
import { Testimonial } from '../modules/testimonial/testimonial.model';
import { Blog } from '../modules/blog/blog.model';
import { Inquiry } from '../modules/inquiry/inquiry.model';
import { Contact } from '../modules/contact/contact.model';
import { Favorite } from '../modules/favorite/favorite.model';
import { Newsletter } from '../modules/newsletter/newsletter.model';
import {
  CITIES, STREETS, TYPE_CONFIGS, CATEGORIES, ADJECTIVES, AMENITIES,
  FIRST_NAMES, LAST_NAMES, AGENT_TITLES, REVIEW_COMMENTS, TESTIMONIALS,
  BLOGS, CONTACTS, INQUIRY_MESSAGES, AVATARS, BLOG_COVERS, img,
} from './data';

/* ----------------------------- helpers ----------------------------- */
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = <T>(arr: T[]): T => arr[rand(0, arr.length - 1)];
const pickN = <T>(arr: T[], n: number): T[] => {
  const copy = [...arr];
  const out: T[] = [];
  for (let i = 0; i < n && copy.length; i += 1) out.push(copy.splice(rand(0, copy.length - 1), 1)[0]);
  return out;
};
const chance = (p: number) => Math.random() < p;
const round = (n: number, step: number) => Math.round(n / step) * step;

const NOW = Date.now();
const DAY = 24 * 60 * 60 * 1000;
/** A random Date between `daysAgoMax` and `daysAgoMin` days ago. */
const dateBetween = (daysAgoMax: number, daysAgoMin = 0) =>
  new Date(NOW - rand(daysAgoMin, daysAgoMax) * DAY - rand(0, DAY));

const SALT = bcrypt.genSaltSync(10);
const hash = (pw: string) => bcrypt.hashSync(pw, SALT);

/* ----------------------------- seed ----------------------------- */
async function seed() {
  await connectDB();
  // eslint-disable-next-line no-console
  console.log('🌱 Seeding database — clearing existing collections...');

  await Promise.all([
    User.deleteMany({}), Category.deleteMany({}), Property.deleteMany({}),
    Review.deleteMany({}), Testimonial.deleteMany({}), Blog.deleteMany({}),
    Inquiry.deleteMany({}), Contact.deleteMany({}), Favorite.deleteMany({}),
    Newsletter.deleteMany({}),
  ]);

  /* -------- Categories -------- */
  const categoryDocs = CATEGORIES.map((c) => ({
    _id: new Types.ObjectId(),
    name: c.name,
    slug: c.slug,
    icon: c.icon,
    description: c.description,
    propertyCount: 0,
    createdAt: dateBetween(360, 340),
    updatedAt: new Date(),
  }));
  const categoryBySlug = new Map(categoryDocs.map((c) => [c.slug, c]));

  /* -------- Users: admin, demo user, agents, regular users -------- */
  const adminId = new Types.ObjectId();
  const demoUserId = new Types.ObjectId();

  const admin = {
    _id: adminId,
    name: env.SEED_ADMIN_NAME,
    email: env.SEED_ADMIN_EMAIL.toLowerCase(),
    password: hash(env.SEED_ADMIN_PASSWORD),
    avatar: { url: img(AVATARS[6], 400), publicId: 'seed/users/admin' },
    phone: '+1 (212) 555-0100',
    role: 'admin' as const,
    provider: 'credentials' as const,
    isVerified: true,
    createdAt: dateBetween(360, 355),
    updatedAt: new Date(),
  };

  const demoUser = {
    _id: demoUserId,
    name: 'Demo User',
    email: 'demo.user@estatein.com',
    password: hash('DemoUser123!'),
    avatar: { url: img(AVATARS[2], 400), publicId: 'seed/users/demo' },
    phone: '+1 (212) 555-0142',
    role: 'user' as const,
    provider: 'credentials' as const,
    isVerified: true,
    createdAt: dateBetween(300, 280),
    updatedAt: new Date(),
  };

  // Agents (still `user` role — they are the accounts properties are listed by).
  const agents = Array.from({ length: 8 }).map((_, i) => {
    const name = `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
    return {
      _id: new Types.ObjectId(),
      name,
      email: `agent${i + 1}@estatein.com`,
      password: hash('Agent123!'),
      avatar: { url: img(AVATARS[i % AVATARS.length], 400), publicId: `seed/agents/${i + 1}` },
      phone: `+1 (${rand(200, 989)}) 555-0${rand(100, 999)}`,
      role: 'user' as const,
      provider: 'credentials' as const,
      isVerified: true,
      title: pick(AGENT_TITLES), // extra field kept for reference; ignored by schema reads
      createdAt: dateBetween(340, 300),
      updatedAt: new Date(),
    };
  });

  const regularUsers = Array.from({ length: 24 }).map((_, i) => {
    const first = pick(FIRST_NAMES);
    const last = pick(LAST_NAMES);
    return {
      _id: new Types.ObjectId(),
      name: `${first} ${last}`,
      email: `${first}.${last}${i}@example.com`.toLowerCase(),
      password: hash('User1234!'),
      avatar: chance(0.7) ? { url: img(pick(AVATARS), 400), publicId: `seed/users/${i}` } : undefined,
      phone: chance(0.6) ? `+1 (${rand(200, 989)}) 555-0${rand(100, 999)}` : undefined,
      role: 'user' as const,
      provider: 'credentials' as const,
      isVerified: chance(0.8),
      createdAt: dateBetween(320, 5),
      updatedAt: new Date(),
    };
  });

  const listers = [admin, ...agents];
  const reviewers = [demoUser, ...regularUsers];

  /* -------- Properties -------- */
  const properties: Record<string, unknown>[] = [];
  const PROPERTY_TARGET = 64;

  for (let i = 0; i < PROPERTY_TARGET; i += 1) {
    const tc = TYPE_CONFIGS[i % TYPE_CONFIGS.length];
    const cityInfo = pick(CITIES);
    const hood = pick(cityInfo.neighborhoods);
    const adjective = pick(ADJECTIVES);
    const purpose: 'sale' | 'rent' = tc.rentable && chance(0.4) ? 'rent' : 'sale';

    const price =
      purpose === 'rent'
        ? round(rand(tc.rentMin, tc.rentMax), 50)
        : round(rand(tc.saleMin, tc.saleMax), 5000);

    const beds = tc.bedMax > 0 ? rand(tc.bedMin, tc.bedMax) : 0;
    const baths = tc.bathMax > 0 ? rand(tc.bathMin, tc.bathMax) : 0;
    const area = rand(tc.areaMin, tc.areaMax);

    const title = `${adjective} ${tc.label} in ${hood}`;
    const bedText = beds > 0 ? `${beds}-bedroom` : 'open-plan';
    const description =
      `This ${adjective.toLowerCase()} ${tc.label.toLowerCase()} sits in the heart of ${hood}, ${cityInfo.city}, offering ${area.toLocaleString()} sq ft of thoughtfully designed space. ` +
      `The ${bedText} layout is flooded with natural light and finished to a high standard throughout. ` +
      `Residents enjoy easy access to local dining, transit and green space, making it an ideal ${purpose === 'rent' ? 'rental' : 'home or investment'}. ` +
      `Standout features include ${pickN(AMENITIES, 3).join(', ').toLowerCase()}, all within a secure, well-managed setting.`;

    const status: 'available' | 'pending' | 'sold' | 'rented' = (() => {
      const r = Math.random();
      if (r < 0.72) return 'available';
      if (r < 0.82) return 'pending';
      return purpose === 'rent' ? 'rented' : 'sold';
    })();

    const createdAt = dateBetween(360, 2);
    // Sold/rented "recently" for the current-month KPI on some listings.
    const updatedAt =
      status === 'sold' || status === 'rented' ? dateBetween(40, 0) : createdAt;

    const category = categoryBySlug.get(tc.categorySlug)!;
    const images = pickN(tc.images, Math.min(5, tc.images.length)).map((id, idx) => ({
      url: img(id, 1600),
      publicId: `seed/properties/${i}-${idx}`,
    }));

    properties.push({
      _id: new Types.ObjectId(),
      title,
      slug: `${slugify(title, { lower: true, strict: true })}-${i}${Math.random().toString(36).slice(2, 6)}`,
      description,
      purpose,
      type: tc.type,
      price,
      priceUnit: purpose === 'rent' ? 'per-month' : 'total',
      category: category._id,
      images,
      location: {
        address: `${rand(10, 9999)} ${pick(STREETS)}`,
        city: cityInfo.city,
        state: cityInfo.state,
        country: cityInfo.country,
        zip: cityInfo.zip,
        coordinates: {
          lat: cityInfo.lat + (Math.random() - 0.5) * 0.1,
          lng: cityInfo.lng + (Math.random() - 0.5) * 0.1,
        },
      },
      specifications: {
        bedrooms: beds,
        bathrooms: baths,
        areaSqft: area,
        yearBuilt: rand(1985, 2025),
        parkingSpots: rand(0, 3),
        furnishing: pick(['unfurnished', 'semi-furnished', 'furnished']),
      },
      amenities: pickN(AMENITIES, rand(4, 8)),
      status,
      isFeatured: status === 'available' && chance(0.28),
      views: rand(20, 4200),
      averageRating: 0,
      reviewCount: 0,
      listedBy: pick(listers)._id,
      createdAt,
      updatedAt,
    });

    category.propertyCount += 1;
  }

  /* -------- Reviews (drive averageRating / reviewCount) -------- */
  const reviews: Record<string, unknown>[] = [];
  for (const property of properties) {
    const n = rand(0, 6);
    const chosen = pickN(reviewers, n);
    let sum = 0;
    for (const reviewer of chosen) {
      const rating = chance(0.75) ? rand(4, 5) : rand(2, 3);
      sum += rating;
      reviews.push({
        _id: new Types.ObjectId(),
        property: property._id,
        user: reviewer._id,
        rating,
        comment: pick(REVIEW_COMMENTS),
        createdAt: new Date(
          Math.min(NOW, (property.createdAt as Date).getTime() + rand(1, 90) * DAY)
        ),
      });
    }
    property.reviewCount = chosen.length;
    property.averageRating = chosen.length ? Math.round((sum / chosen.length) * 10) / 10 : 0;
  }

  /* -------- Testimonials -------- */
  const testimonials = TESTIMONIALS.map((t, i) => ({
    _id: new Types.ObjectId(),
    name: t.name,
    role: t.role,
    avatar: { url: img(AVATARS[i % AVATARS.length], 400), publicId: `seed/testimonials/${i}` },
    message: t.message,
    rating: t.rating,
    isApproved: true,
    createdAt: dateBetween(200, 3),
  }));

  /* -------- Blogs -------- */
  const blogAuthors = [admin, ...agents];
  const blogs = BLOGS.map((b, i) => ({
    _id: new Types.ObjectId(),
    title: b.title,
    slug: `${slugify(b.title, { lower: true, strict: true })}-${i}`,
    coverImage: { url: img(BLOG_COVERS[i % BLOG_COVERS.length], 1600), publicId: `seed/blogs/${i}` },
    excerpt: b.excerpt,
    content: b.paragraphs.join('\n\n'),
    author: pick(blogAuthors)._id,
    tags: b.tags,
    isPublished: true,
    views: rand(80, 5200),
    createdAt: dateBetween(300, 2),
    updatedAt: new Date(),
  }));

  /* -------- Inquiries (spread over the past ~45 days for the trend chart) -------- */
  const availableProps = properties;
  const inquiries: Record<string, unknown>[] = [];
  for (let i = 0; i < 90; i += 1) {
    const property = pick(availableProps);
    const linkedUser = chance(0.55) ? pick(reviewers) : null;
    const name = linkedUser ? (linkedUser.name as string) : `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
    const email = linkedUser ? (linkedUser.email as string) : `${name.split(' ')[0].toLowerCase()}${rand(1, 999)}@example.com`;
    inquiries.push({
      _id: new Types.ObjectId(),
      property: property._id,
      user: linkedUser ? linkedUser._id : undefined,
      name,
      email,
      phone: chance(0.6) ? `+1 (${rand(200, 989)}) 555-0${rand(100, 999)}` : undefined,
      message: pick(INQUIRY_MESSAGES),
      status: pick(['new', 'new', 'contacted', 'closed']),
      createdAt: dateBetween(45, 0),
    });
  }

  /* -------- Contacts -------- */
  const contacts = CONTACTS.map((c, i) => ({
    _id: new Types.ObjectId(),
    name: c.name,
    email: `${c.name.split(' ')[0].toLowerCase()}.${c.name.split(' ')[1].toLowerCase()}@example.com`,
    subject: c.subject,
    message: c.message,
    status: pick(['new', 'new', 'read', 'resolved']),
    createdAt: dateBetween(60, 0),
  }));

  /* -------- Favorites (demo user + random users) -------- */
  const favoritePairs = new Set<string>();
  const favorites: Record<string, unknown>[] = [];
  const addFavorite = (userId: Types.ObjectId, propertyId: Types.ObjectId) => {
    const key = `${userId}-${propertyId}`;
    if (favoritePairs.has(key)) return;
    favoritePairs.add(key);
    favorites.push({
      _id: new Types.ObjectId(),
      user: userId,
      property: propertyId,
      createdAt: dateBetween(60, 0),
    });
  };
  pickN(properties, 7).forEach((p) => addFavorite(demoUserId, p._id as Types.ObjectId));
  for (const user of regularUsers) {
    pickN(properties, rand(0, 4)).forEach((p) => addFavorite(user._id, p._id as Types.ObjectId));
  }

  /* -------- Newsletter -------- */
  const newsletterEmails = new Set<string>();
  reviewers.slice(0, 18).forEach((u) => newsletterEmails.add(u.email as string));
  ['sarah.jones@gmail.com', 'invest@fund.co', 'hello@buyer.io', 'k.walsh@outlook.com'].forEach((e) => newsletterEmails.add(e));
  const newsletters = Array.from(newsletterEmails).map((email) => ({
    _id: new Types.ObjectId(),
    email,
    subscribedAt: dateBetween(120, 0),
  }));

  /* ----------------------------- insert ----------------------------- */
  // Strip the non-schema `title` helper field from agents before inserting.
  const usersToInsert = [admin, demoUser, ...agents.map(({ title: _t, ...rest }) => rest), ...regularUsers];

  await Category.collection.insertMany(categoryDocs as never);
  await User.collection.insertMany(usersToInsert as never);
  await Property.collection.insertMany(properties as never);
  if (reviews.length) await Review.collection.insertMany(reviews as never);
  await Testimonial.collection.insertMany(testimonials as never);
  await Blog.collection.insertMany(blogs as never);
  await Inquiry.collection.insertMany(inquiries as never);
  await Contact.collection.insertMany(contacts as never);
  if (favorites.length) await Favorite.collection.insertMany(favorites as never);
  await Newsletter.collection.insertMany(newsletters as never);

  /* ----------------------------- summary ----------------------------- */
  // eslint-disable-next-line no-console
  console.log(`
✅ Seed complete:
   Categories:    ${categoryDocs.length}
   Users:         ${usersToInsert.length} (1 admin, ${agents.length} agents, ${regularUsers.length + 1} users)
   Properties:    ${properties.length}
   Reviews:       ${reviews.length}
   Testimonials:  ${testimonials.length}
   Blogs:         ${blogs.length}
   Inquiries:     ${inquiries.length}
   Contacts:      ${contacts.length}
   Favorites:     ${favorites.length}
   Newsletter:    ${newsletters.length}

🔑 Demo credentials:
   Admin  →  ${env.SEED_ADMIN_EMAIL} / ${env.SEED_ADMIN_PASSWORD}
   User   →  demo.user@estatein.com / DemoUser123!
`);

  await disconnectDB();
}

seed().catch(async (err) => {
  // eslint-disable-next-line no-console
  console.error('❌ Seed failed:', err);
  await mongoose.disconnect().catch(() => undefined);
  process.exit(1);
});
