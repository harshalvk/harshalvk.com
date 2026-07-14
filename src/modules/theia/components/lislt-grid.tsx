import Link from 'next/link';
import type { Route } from 'next';
import { ArrowRightIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type ListGridItem = {
  slug: string;
  title: string;
  description?: string;
  summary?: string;
};

export function ListGrid<T extends ListGridItem>({
  list,
  basePath,
  className,
}: {
  list: T[];
  basePath: string;
  className?: string;
}) {
  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2', className)}>
      {list.map((item) => (
        <Link
          key={item.slug}
          href={`${basePath}/${item.slug}` as Route}
          className="group hover:bg-muted-foreground/5 flex h-full items-start justify-between gap-4 border-b border-dashed p-5 sm:odd:border-r"
        >
          <div className="flex-1">
            <h3 className="font-medium">{item.title}</h3>
            <p className="text-muted-foreground text-sm">{item.description ?? item.summary}</p>
          </div>
          <ArrowRightIcon className="mt-1 size-4 shrink-0 transition-transform group-hover:-rotate-45" />
        </Link>
      ))}
    </div>
  );
}
