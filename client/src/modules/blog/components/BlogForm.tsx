'use client';

import * as React from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/toast';
import { ApiClientError } from '@/lib/api-client';
import cloudinaryLoader from '@/lib/cloudinary-loader';
import { createBlogRequest, updateBlogRequest } from '../api';
import type { Blog } from '@/types';

const blogFormSchema = z.object({
  title: z.string().trim().min(5, 'Title must be at least 5 characters').max(150),
  excerpt: z.string().trim().min(10, 'Excerpt is required').max(300),
  content: z.string().trim().min(50, 'Content must be at least 50 characters'),
  tags: z.string().optional(),
  isPublished: z.boolean().optional(),
});
type BlogFormInput = z.infer<typeof blogFormSchema>;

export function BlogForm({ blog }: { blog?: Blog }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [coverFile, setCoverFile] = React.useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const isEditing = Boolean(blog);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BlogFormInput>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: blog
      ? { title: blog.title, excerpt: blog.excerpt, content: blog.content, tags: blog.tags.join(', '), isPublished: blog.isPublished }
      : { isPublished: false },
  });

  const mutation = useMutation({
    mutationFn: (values: BlogFormInput) => {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('excerpt', values.excerpt);
      formData.append('content', values.content);
      formData.append(
        'tags',
        JSON.stringify(
          (values.tags ?? '')
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        )
      );
      formData.append('isPublished', String(values.isPublished ?? false));
      if (coverFile) formData.append('coverImage', coverFile);
      return isEditing ? updateBlogRequest(blog!._id, formData) : createBlogRequest(formData);
    },
    onSuccess: (res) => {
      toast({ title: isEditing ? 'Post updated' : 'Post created', description: res.message, variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      router.push('/dashboard/admin/blog');
    },
    onError: (err) => {
      const message = err instanceof ApiClientError ? err.message : 'Could not save the post.';
      toast({ title: 'Save failed', description: message, variant: 'error' });
    },
  });

  function onSubmit(values: BlogFormInput) {
    if (!isEditing && !coverFile) {
      toast({ title: 'Cover image is required', variant: 'error' });
      return;
    }
    mutation.mutate(values);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="title">Title</Label>
        <Input id="title" invalid={!!errors.title} {...register('title')} />
        {errors.title && <p className="text-sm text-[var(--color-destructive)]">{errors.title.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea id="excerpt" rows={2} invalid={!!errors.excerpt} {...register('excerpt')} />
        {errors.excerpt && <p className="text-sm text-[var(--color-destructive)]">{errors.excerpt.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="content">Content</Label>
        <Textarea id="content" rows={12} invalid={!!errors.content} {...register('content')} />
        {errors.content && <p className="text-sm text-[var(--color-destructive)]">{errors.content.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="tags">Tags (comma separated)</Label>
        <Input id="tags" placeholder="market-trends, buying-guide" {...register('tags')} />
      </div>

      <div className="space-y-2">
        <Label>Cover image {isEditing && '(leave empty to keep current)'}</Label>
        {blog?.coverImage && !coverFile && (
          <div className="relative h-32 w-52 overflow-hidden rounded-lg">
            <Image loader={cloudinaryLoader} src={blog.coverImage.url} alt="" fill className="object-cover" />
          </div>
        )}
        {coverFile && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={URL.createObjectURL(coverFile)} alt="" className="h-32 w-52 rounded-lg object-cover" />
        )}
        <div>
          <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Upload /> {coverFile || blog?.coverImage ? 'Change image' : 'Upload image'}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" {...register('isPublished')} className="h-4 w-4 rounded border-[var(--border)]" />
        Publish immediately
      </label>

      <Button type="submit" loading={mutation.isPending}>
        {isEditing ? 'Save Changes' : 'Create Post'}
      </Button>
    </form>
  );
}
