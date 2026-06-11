import { cn } from '@/lib/utils';
import React from 'react';

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
