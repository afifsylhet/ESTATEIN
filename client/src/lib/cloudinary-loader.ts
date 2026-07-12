'use client';

interface LoaderParams {
  src: string;
  width: number;
  quality?: number;
}

/** next/image loader that appends Cloudinary transformation params for responsive, optimized delivery. */
export default function cloudinaryLoader({ src, width, quality }: LoaderParams): string {
  if (!src.includes('res.cloudinary.com')) return src;
  const params = [`f_auto`, `q_${quality ?? 'auto'}`, `w_${width}`].join(',');
  return src.replace('/upload/', `/upload/${params}/`);
}
