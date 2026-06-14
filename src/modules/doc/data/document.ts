import { cache } from 'react';
import matter from 'gray-matter';

import type { Doc, DocMetadata } from '@/modules/doc/types/document';

// Webpack require.context — resolved at build time, no fs needed.
// This statically bundles all .mdx files in the content directory.
// @ts-ignore
const docContext = require.context(
  '@/modules/doc/content',
  true, // include subdirectories
  /\.mdx$/, // match .mdx files only
  'sync'
);

function parseFrontmatter(fileContent: string) {
  const file = matter(fileContent);
  return {
    metadata: file.data as DocMetadata,
    content: file.content,
  };
}

function getSlug(filePath: string) {
  // "./getting-started.mdx" → "getting-started"
  return filePath.replace(/^\.\//, '').replace(/\.mdx$/, '');
}

function getAllDocsRaw(): Doc[] {
  return docContext.keys().map((filePath: string) => {
    const raw = docContext(filePath) as { default: string } | string;

    // raw-loader returns the file as a string, webpack may wrap it
    const fileContent = typeof raw === 'string' ? raw : (raw as any).default;

    const { metadata, content } = parseFrontmatter(fileContent);
    const slug = getSlug(filePath);

    return { metadata, slug, content };
  });
}

export const getAllDocs = cache(() => {
  return getAllDocsRaw().sort((a, b) => {
    if (a.metadata.pinned && !b.metadata.pinned) return -1;
    if (!a.metadata.pinned && b.metadata.pinned) return 1;

    return new Date(b.metadata.createdAt).getTime() - new Date(a.metadata.createdAt).getTime();
  });
});

export function getDocBySlug(slug: string) {
  return getAllDocs().find((doc) => doc.slug === slug);
}

export function getDocsByCategory(category: string) {
  return getAllDocs().filter((doc) => doc.metadata?.category === category);
}

export function findNeighbour(docs: Doc[], slug: string) {
  const len = docs.length;

  for (let i = 0; i < len; ++i) {
    if (docs[i].slug === slug) {
      return {
        previous: i > 0 ? docs[i - 1] : null,
        next: i < len - 1 ? docs[i + 1] : null,
      };
    }
  }

  return { previous: null, next: null };
}
