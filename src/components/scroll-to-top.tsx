'use client';

import { useState } from 'react';
import { ArrowUpIcon } from 'lucide-react';
import { useMotionValueEvent, useScroll } from 'motion/react';

import { cn } from '@/lib/utils';
import { Button } from './ui/button';

export function ScrollToTop({ className, ...props }: React.ComponentProps<'button'>) {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');

  useMotionValueEvent(scrollY, 'change', (latestValue) => {
    setVisible(latestValue >= 400);
    const prev = scrollY.getPrevious() ?? 0;
    setScrollDirection(latestValue - prev > 0 ? 'down' : 'up');
  });

  return (
    <Button
      data-visible={visible}
      data-scroll-direction={scrollDirection}
      className={cn(
        '[--bottom:0.5rem] sm:[--bottom:1rem] lg:[--bottom:2rem]',
        'fixed right-1 z-50 lg:right-8',
        'bottom-[calc(var(--bottom,0.5rem)+env(safe-area-inset-bottom,0))]',
        'size-8 rounded-none',
        'bg-muted/50 text-muted-foreground',
        'border-muted-foreground/12 border',
        'before:absolute before:inset-x-0 before:top-0 before:h-px',
        'before:pointer-events-none before:bg-white/8',
        'shadow-none ring-0 outline-none',
        'transition-[opacity,transform]',
        'data-[visible=false]:pointer-events-none data-[visible=false]:opacity-0',
        'data-[visible=false]:translate-y-2',
        'data-[visible=true]:translate-y-0 data-[visible=true]:opacity-100',
        'data-[scroll-direction=down]:data-[visible=true]:opacity-30',
        'data-[scroll-direction=up]:data-[visible=true]:opacity-100',
        'data-[scroll-direction=down]:hover:opacity-100',
        'after:absolute after:bottom-[3px] after:left-[3px]',
        'after:size-[4px] after:border-b after:border-l',
        'after:border-muted-foreground/20 after:pointer-events-none',

        className
      )}
      variant="ghost"
      size="icon"
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      {...props}
    >
      <ArrowUpIcon className="size-3.5" />
    </Button>
  );
}
