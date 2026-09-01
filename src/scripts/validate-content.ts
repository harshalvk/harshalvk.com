import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'src/modules/doc/content');

const REQUIRED_FIELDS = ['title', 'description', 'image', 'category', 'createdAt', 'updatedAt'];

const errors: string[] = [];

function getMdxFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return getMdxFiles(fullPath);
    }

    return entry.name.endsWith('.mdx') ? [fullPath] : [];
  });
}

const files = getMdxFiles(CONTENT_DIR);

for (const filePath of files) {
  const relativePath = path.relative(process.cwd(), filePath);
  const content = fs.readFileSync(filePath, 'utf8');

  try {
    const { data } = matter(content);

    for (const field of REQUIRED_FIELDS) {
      if (!data[field]) {
        errors.push(`${relativePath}: missing "${field}"`);
      }
    }

    if (data.createdAt && Number.isNaN(new Date(data.createdAt).getTime())) {
      errors.push(`${relativePath}: invalid "createdAt"`);
    }

    if (data.updatedAt && Number.isNaN(new Date(data.updatedAt).getTime())) {
      errors.push(`${relativePath}: invalid "updatedAt"`);
    }
  } catch (error) {
    errors.push(
      `${relativePath}: failed to parse frontmatter${
        error instanceof Error ? ` (${error.message})` : ''
      }`
    );
  }
}

if (errors.length > 0) {
  console.error('\nContent validateion failed:\n');

  for (const error of errors) {
    console.error(` ✗ ${error}`);
  }

  process.exit(1);
}

console.log(`✓ Validated ${files.length} MDX document(s).`);
