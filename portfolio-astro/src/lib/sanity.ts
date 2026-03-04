import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';
import type { Project } from '../types/project';

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET;

const apiVersion = import.meta.env.PUBLIC_SANITY_API_VERSION ?? '2025-01-01';
const useCdn = import.meta.env.PUBLIC_SANITY_USE_CDN !== 'false';

export const sanityConfigured = Boolean(projectId && dataset);

const client = sanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn,
      perspective: 'published'
    })
  : null;

// Image URL builder for Sanity-hosted images
const builder = client ? createImageUrlBuilder(client) : null;

export function urlFor(source: any) {
  if (!builder) return null;
  return builder.image(source);
}

const projectFields = `
  _id,
  title,
  "slug": slug.current,
  summary,
  body,
  stack,
  repoUrl,
  liveUrl,
  figmaUrl,
  devpostUrl,
  "imageUrl": image.asset->url,
  "imageAlt": image.alt,
  "imageWidth": image.asset->metadata.dimensions.width,
  "imageHeight": image.asset->metadata.dimensions.height,
  "gallery": gallery[]{
    "url": asset->url,
    alt,
    caption,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height
  },
  featured,
  publishedAt,
  challenges,
  learnings,
  role
`;

const projectListQuery = `*[_type == "project" && defined(slug.current)] | order(coalesce(publishedAt, _createdAt) desc) {
  ${projectFields}
}`;

const featuredProjectsQuery = `*[_type == "project" && defined(slug.current) && featured == true] | order(coalesce(publishedAt, _createdAt) desc) {
  ${projectFields}
}`;

const projectSlugsQuery = `*[_type == "project" && defined(slug.current)].slug.current`;

const projectBySlugQuery = `*[_type == "project" && slug.current == $slug][0] {
  ${projectFields}
}`;

function optimizeImageUrl(url: string | undefined, width = 1400): string | undefined {
  if (!url) return undefined;

  try {
    const parsed = new URL(url);
    parsed.searchParams.set('auto', 'format');
    parsed.searchParams.set('fit', 'max');
    parsed.searchParams.set('w', String(width));
    parsed.searchParams.set('q', '75');
    return parsed.toString();
  } catch {
    return url;
  }
}

function optimizeProjectImages(project: Project): Project {
  return {
    ...project,
    imageUrl: optimizeImageUrl(project.imageUrl),
    gallery: project.gallery?.map((img) => ({
      ...img,
      url: optimizeImageUrl(img.url) ?? img.url
    }))
  };
}

export async function getProjects(): Promise<Project[]> {
  if (!client) return [];
  const projects = await client.fetch<Project[]>(projectListQuery);
  return projects.map(optimizeProjectImages);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  if (!client) return [];
  const projects = await client.fetch<Project[]>(featuredProjectsQuery);
  return projects.map(optimizeProjectImages);
}

export async function getProjectSlugs(): Promise<string[]> {
  if (!client) return [];
  return client.fetch<string[]>(projectSlugsQuery);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (!client) return null;
  const project = await client.fetch<Project | null>(projectBySlugQuery, { slug });
  return project ? optimizeProjectImages(project) : null;
}
