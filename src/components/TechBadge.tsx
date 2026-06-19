import { cn } from '@/lib/utils';
import React from 'react';
import type { Tech } from '@/modules/portfolio/components/Sections/MyTechnologies';
import Link from 'next/link';
import { Route } from 'next';

const TechBadge = ({ name, icon: Icon, url, className }: Tech & { className?: string }) => {
  const classes = cn(
    'text-muted-foreground flex cursor-default items-center gap-1.5 rounded-sm border bg-zinc-100 px-2 py-1 font-mono text-xs select-none md:text-sm dark:bg-zinc-800',
    className
  );

  const content = (
    <>
      {Icon && <Icon className="size-3.5 shrink-0" />}
      {name}
    </>
  );

  if (url) {
    return (
      <Link href={url as Route} target="_blank" className={`cursor-pointer select-none ${classes}`}>
        {content}
      </Link>
    );
  }

  return <div className={classes}>{content}</div>;
};

export default TechBadge;
