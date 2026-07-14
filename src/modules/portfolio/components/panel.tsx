import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

export function Panel({ className, ...props }: React.ComponentProps<'section'>) {
  return (
    <section
      className={cn('border-border relative scroll-mt-[75px] border-x', className)}
      {...props}
    />
  );
}

export function PanelHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <>
      <div className="bg-hatching screen-line-top screen-line-bottom h-4 w-full" />

      <div className={cn('px-4', className)} {...props} />

      <div className="bg-hatching screen-line-top screen-line-bottom h-7 w-full" />
    </>
  );
}

export function PanelTitleSup({ className, ...props }: React.ComponentProps<'sup'>) {
  return (
    <sup
      className={cn(
        'text-muted-foreground top-[-0.75em] ml-1 text-sm font-medium tracking-normal',
        className
      )}
      {...props}
    />
  );
}

export function PanelTitle({
  className,
  asChild,
  ...props
}: React.ComponentProps<'h2'> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot : 'h2';

  return (
    <Comp
      className={cn('text-2xl font-medium tracking-tight md:text-3xl lg:text-4xl', className)}
      {...props}
    />
  );
}

export function PanelDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p className={cn('text-muted-foreground text-sm leading-relaxed', className)} {...props} />
  );
}

export function PanelContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('', className)} {...props} />;
}
