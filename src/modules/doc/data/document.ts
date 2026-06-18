'use server';

import fs from 'fs/promises';
import path from 'path';
import { cache } from 'react';
import matter from 'gray-matter';

import type { Doc, DocMetadata } from '@/modules/doc/types/document';

function parseFrontmatter(fileContent: string) {
  const file = matter(fileContent);

  return {
    metadata: file.data as DocMetadata,
    content: file.content,
  };
}

async function getMDXFiles(dir: string) {
  const files = await fs.readdir(dir);
  return files.filter((file) => path.extname(file) === '.mdx');
}

async function readMDXFile(filePath: string) {
  const rawContent = await fs.readFile(filePath, 'utf-8');
  return parseFrontmatter(rawContent);
}

async function getMDXData(dir: string): Promise<Doc[]> {
  const mdxFiles = await getMDXFiles(dir);

  return Promise.all(
    mdxFiles.map(async (file) => {
      const { metadata, content } = await readMDXFile(path.join(dir, file));

      return {
        metadata,
        content,
        slug: path.basename(file, path.extname(file)),
      };
    })
  );
}

export const getAllDocs = cache(async (): Promise<Doc[]> => {
  const docs = await getMDXData(path.join(process.cwd(), 'src/modules/doc/content'));

  return docs.sort((a, b) => {
    if (a.metadata.pinned && !b.metadata.pinned) return -1;
    if (!a.metadata.pinned && b.metadata.pinned) return 1;

    return new Date(b.metadata.createdAt).getTime() - new Date(a.metadata.createdAt).getTime();
  });
});

export async function getDocBySlug(slug: string) {
  const docs = await getAllDocs();
  return docs.find((doc) => doc.slug === slug);
}

export async function getDocsByCategory(category: string) {
  const docs = await getAllDocs();
  return docs.filter((doc) => doc.metadata.category === category);
}

export async function findNeighbour(docs: Doc[], slug: string) {
  const index = docs.findIndex((doc) => doc.slug === slug);

  if (index === -1) {
    return {
      previous: null,
      next: null,
    };
  }

  return {
    previous: index > 0 ? docs[index - 1] : null,
    next: index < docs.length - 1 ? docs[index + 1] : null,
  };
}
