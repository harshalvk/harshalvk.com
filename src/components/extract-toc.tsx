import { TocItem } from './shared/toc';

export function extractToc(content: string): TocItem[] {
  const lines = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  const items: TocItem[] = [];
  const idCount = new Map<string, number>();

  for (const line of lines) {
    const match = line.match(/^(#{1,3})\s+(.+)$/);
    if (!match) continue;

    const depth = match[1].length;
    const title = match[2].trim();

    const baseId = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Track duplicates and make unique
    const count = idCount.get(baseId) ?? 0;
    idCount.set(baseId, count + 1);
    const id = count === 0 ? baseId : `${baseId}-${count}`;

    items.push({ id, title, depth });
  }

  return items;
}
