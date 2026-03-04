import type { PortableTextBlock } from '@portabletext/types';

export interface ProjectImage {
  _type: 'image';
  asset: {
    _ref: string;
    url: string;
  };
  alt?: string;
  caption?: string;
}

export interface Project {
  _id: string;
  title: string;
  slug: string;
  summary?: string;
  /** @deprecated Use `body` (Portable Text) instead for rich content. */
  description?: string;
  body?: PortableTextBlock[];
  stack?: string[];
  repoUrl?: string;
  liveUrl?: string;
  figmaUrl?: string;
  devpostUrl?: string;
  imageUrl?: string;
  imageAlt?: string;
  gallery?: {
    url: string;
    alt?: string;
    caption?: string;
  }[];
  featured?: boolean;
  publishedAt?: string;
  challenges?: string[];
  learnings?: string[];
  role?: string;
}
