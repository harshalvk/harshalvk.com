import Link from 'next/link';
import type { Route } from 'next';
import { ArrowRightIcon } from 'lucide-react';
import type { MLAlgorithmMeta } from '@/modules/theia/data/ml-algorithms';

export function MLAlgorithmList({
  algorithms,
  category,
}: {
  algorithms: MLAlgorithmMeta[];
  category: string;
}) {
  if (algorithms.length === 0) {
    return (
      <p className="text-muted-foreground p-5 text-sm">Algorithms for this category coming soon.</p>
    );
  }

  return (
    <div className="grid auto-rows-fr grid-cols-1 sm:grid-cols-2">
      {algorithms.map((algo) => (
        <Link
          key={algo.slug}
          href={`/theia/${category}/${algo.slug}` as Route}
          className="group hover:bg-muted-foreground/5 flex h-full items-start justify-between gap-4 border-b border-dashed p-5 sm:odd:border-r"
        >
          <div className="min-w-0 flex-1 space-y-1">
            <h3 className="font-medium">{algo.title}</h3>
            <p className="text-muted-foreground text-sm">{algo.description}</p>
            <p className="text-muted-foreground mt-1 font-mono text-xs capitalize">{algo.kind}</p>
          </div>
          <ArrowRightIcon className="text-muted-foreground mt-1 size-4 shrink-0 transition-transform group-hover:-rotate-45" />
        </Link>
      ))}
    </div>
  );
}
