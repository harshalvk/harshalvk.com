import { cn } from '@/lib/utils';
import Link from 'next/link';

export function ComponentItem({ className, ...props }: React.ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn('text-foreground flex w-full items-center gap-3 p-4 sm:py-5', className)}
      {...props}
    />
  );
}

export function ComponentItemDot({
  className,
  ...props
}: Omit<React.ComponentProps<'span'>, 'children'>) {
  return (
    <span
      className={cn('bg-info ring-background size-2 shrink-0 rounded-full ring-1', className)}
      {...props}
    />
  );
}

type HeadingTypes = 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type HeadingProps<T extends HeadingTypes> = React.ComponentProps<T> & {
  as?: T;
};

export function ComponentItemTitle<T extends HeadingTypes = 'h2'>({
  as,
  className,
  ...props
}: HeadingProps<T>) {
  const Comp = as ?? 'h2';

  return (
    <Comp
      className={cn('line-clamp-1 leading-snug font-medium text-balance', className)}
      {...props}
    />
  );
}

export function ComponentItemIcon({ className, ...props }: React.ComponentProps<typeof IconTile>) {
  // Positioned so ComponentItemDot can anchor to the tile corner.
  return <IconTile className={cn('relative', className)} {...props} />;
}

/**
 * Small square chip that frames a leading icon in list items and metadata rows.
 * The layered border + ring is a site-wide visual signature, so it lives here
 * instead of being retyped per call site.
 */
export function IconTile({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="icon-tile"
      className={cn(
        'relative flex size-6 shrink-0 items-center justify-center select-none',
        'rounded-none',
        'bg-muted text-muted-foreground',
        'border-muted-foreground/12 border',
        'before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-white/8',
        'after:border-muted-foreground/20 after:pointer-events-none after:absolute after:right-[3px] after:bottom-[3px] after:size-[4px] after:border-r after:border-b',
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
        className
      )}
      {...props}
    />
  );
}
