'use client';

import { cn } from '@/lib/utils';

/**
 * Breaks the lab content out of the site's default `max-w-5xl` shell on large
 * screens, without touching the shared layout used by every other route.
 */
export function ArgusBreakout({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'lg:w-[min(96vw,1600px)] lg:max-w-none',
        'lg:relative lg:left-1/2 lg:-translate-x-1/2',
        className
      )}
    >
      {children}
    </div>
  );
}
