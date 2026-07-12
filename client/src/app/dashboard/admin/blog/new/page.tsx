'use client';

import { BlogForm } from '@/modules/blog/components/BlogForm';

export default function NewBlogPostPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">New Blog Post</h1>
      <div className="mt-8 max-w-3xl">
        <BlogForm />
      </div>
    </div>
  );
}
