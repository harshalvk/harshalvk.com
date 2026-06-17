import { cn } from '@/lib/utils';
import React from 'react';
import { Slot } from 'radix-ui';

export const Title = ({ text, className }: { text: string; className?: string }) => {
  return (
    <h1
      className={cn(
        'text-xl font-medium tracking-tight sm:text-2xl md:text-3xl lg:text-4xl',
        className
      )}
    >
      {text}
    </h1>
  );
};

export const SectionContent = ({
  children,
  className,
}: {
  children: React.ReactNode | string;
  className?: string;
}) => {
  return (
    <p className={cn('text-muted-foreground text-base leading-relaxed sm:text-lg', className)}>
      {children}
    </p>
  );
};

export function Prose({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<'div'> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot.Root : 'div';

  return (
    <Comp
      data-slot="prose"
      className={cn('prose prose-harshalvk dark:prose-invert max-w-none', className)}
      {...props}
    />
  );
}

export function Code({ className, ...props }: React.ComponentProps<'code'>) {
  const isCodeBlock = 'data-language' in props;

  return (
    <code
      data-slot={isCodeBlock ? 'code-block' : 'code-inline'}
      className={cn(
        !isCodeBlock &&
          'not-prose bg-muted font-geist-mono rounded-md px-1.5 py-0.5 text-sm whitespace-pre-wrap',
        className
      )}
      {...props}
    />
  );
}
