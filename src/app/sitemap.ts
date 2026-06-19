import type { MetadataRoute } from 'next';

import { SITE_INFO } from '@/config/site';
import { getAllDocs, getDocsByCategory } from '@/modules/doc/data/document';

export const revalidate = false;
export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = (await getAllDocs()).map((post) => ({
    url: `${SITE_INFO}/blog/${post.slug}`,
    lastModified: new Date(post.metadata.updatedAt).toISOString(),
  }));

  const components = (await getDocsByCategory('components')).map((post) => ({
    url: `${SITE_INFO.url}/components/${post.slug}`,
    lastModified: new Date().toISOString(),
  }));

  const routes = ['', '/blog', '/components', '/components/showcase'].map((route) => ({
    url: `${SITE_INFO.url}${route}`,
    lastModified: new Date().toISOString(),
  }));

  return [...routes, ...posts, ...components];
}
