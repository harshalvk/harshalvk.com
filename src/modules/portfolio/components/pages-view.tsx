'use client';

import { getPageViews } from '@/lib/get-page-views';
import { useQuery } from '@tanstack/react-query';
import { Eye } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React from 'react';

export type PageViewsResponse = {
  version: number;
  query: {
    since: string;
    until: string;
  };
  data: {
    visitors: number;
    pageviews: number;
  };
};

function FlipDigit({ digit, index }: { digit: string; index: number }) {
  return (
    <span className="relative inline-flex h-[1.2em] overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={digit}
          initial={{ y: '100%', opacity: 0, filter: 'blur(4px)' }}
          animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: '-100%', opacity: 0, filter: 'blur(4px)' }}
          transition={{
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1],
            delay: index * 0.04,
          }}
          className="inline-block"
        >
          {digit}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function AnimatedNumber({ value }: { value: number }) {
  const [displayed, setDisplayed] = React.useState(0);
  const rafRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    if (!value) return;

    const duration = 1200;
    const steps = 30;
    const increment = value / steps;
    let current = 0;
    let step = 0;

    const tick = () => {
      step++;
      current = step === steps ? value : Math.floor(increment * step);
      setDisplayed(current);
      if (step < steps) {
        rafRef.current = setTimeout(tick, duration / steps);
      }
    };

    rafRef.current = setTimeout(tick, 300); // slight initial delay

    return () => {
      if (rafRef.current) clearTimeout(rafRef.current);
    };
  }, [value]);

  const digits = displayed.toLocaleString('en').split('');

  return (
    <span className="inline-flex tabular-nums">
      {digits.map((char, i) => (
        <FlipDigit key={`${i}-${char}`} digit={char} index={i} />
      ))}
    </span>
  );
}

const PagesView = () => {
  const { data, isLoading } = useQuery<PageViewsResponse | null>({
    queryKey: ['page-view'],
    queryFn: getPageViews,
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="text-muted-foreground flex items-center gap-2 text-sm">
      <Eye className="mt-1 size-4" />
      {isLoading ? (
        <span className="tabular-nums opacity-30">0000</span>
      ) : (
        <AnimatedNumber value={data?.data.pageviews ?? 0} />
      )}
    </div>
  );
};

export default PagesView;
