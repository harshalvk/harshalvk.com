import { cn } from '@/lib/utils';
import React from 'react';

const TechBadge = ({
  name,
  Logo,
  className,
}: {
  name?: string;
  Logo?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'flex h-8 w-fit cursor-default items-center gap-1 rounded-sm border px-2 py-1 transition-all duration-200 hover:border-zinc-500/40 hover:bg-zinc-100 dark:hover:bg-zinc-900',
        className
      )}
    >
      {Logo && <div className="h-5 w-5">{Logo}</div>}
      <p className={cn('cursor-default text-sm font-medium tracking-wide', className)}>{name}</p>
    </div>
  );
};

export default TechBadge;
