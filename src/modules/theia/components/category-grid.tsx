import Link from 'next/link';
import type { Route } from 'next';
import { CATEGORIES } from '@/modules/theia/data/algorithms';
import { ArrowRightIcon } from 'lucide-react';

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2">
      {CATEGORIES.map((cat) => (
        <Link
          key={cat.slug}
          href={`/theia/${cat.slug}` as Route}
          className="group hover:bg-muted-foreground/5 flex h-full items-start justify-between gap-4 border-b border-dashed p-5 sm:odd:border-r"
        >
          <div className="flex-1">
            <h3 className="font-medium">{cat.title}</h3>
            <p className="text-muted-foreground text-sm">{cat.description}</p>
          </div>
          <ArrowRightIcon className="mt-1 size-4 shrink-0 transition-transform group-hover:-rotate-45" />
        </Link>
      ))}
    </div>
  );
}
