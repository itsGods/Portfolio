import { z } from 'zod';

export const BlogPostSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  published: z.boolean().default(false),
  createdAt: z.any(), // Firestore Timestamp
  updatedAt: z.any(), // Firestore Timestamp
  tags: z.array(z.string()).default([]),
  coverImage: z.string().url().optional().or(z.literal('')),
  author: z.object({
    name: z.string(),
    avatar: z.string().url().optional().or(z.literal(''))
  }).optional(),
  views: z.number().default(0),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.array(z.string()).optional()
  }).optional()
});

export type BlogPost = z.infer<typeof BlogPostSchema>;

export const SubscriberSchema = z.object({
  email: z.string().email("Invalid email address"),
  subscribedAt: z.any(), // Firestore Timestamp
  status: z.enum(['active', 'unsubscribed']).default('active')
});

export type Subscriber = z.infer<typeof SubscriberSchema>;
