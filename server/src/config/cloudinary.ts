import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import { env } from './env';

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

if (env.CLOUDINARY_API_KEY === env.CLOUDINARY_API_SECRET) {
  // eslint-disable-next-line no-console
  console.warn(
    '⚠️  Cloudinary is likely misconfigured: CLOUDINARY_API_SECRET matches CLOUDINARY_API_KEY. Uploads may fail with "Invalid Signature".',
  );
}

type UploadFolder = 'estatein/properties' | 'estatein/avatars' | 'estatein/blog';

function makeStorage(folder: UploadFolder) {
  return new CloudinaryStorage({
    cloudinary,
    params: async () => ({
      folder,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    }),
  });
}

const imageFileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    cb(new Error('Only image files are allowed'));
    return;
  }
  cb(null, true);
};

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB per image

export const uploadPropertyImages = multer({
  storage: makeStorage('estatein/properties'),
  fileFilter: imageFileFilter,
  limits: { fileSize: MAX_FILE_SIZE_BYTES, files: 10 },
});

export const uploadAvatar = multer({
  storage: makeStorage('estatein/avatars'),
  fileFilter: imageFileFilter,
  limits: { fileSize: MAX_FILE_SIZE_BYTES, files: 1 },
});

export const uploadBlogCover = multer({
  storage: makeStorage('estatein/blog'),
  fileFilter: imageFileFilter,
  limits: { fileSize: MAX_FILE_SIZE_BYTES, files: 1 },
});

export { cloudinary };
