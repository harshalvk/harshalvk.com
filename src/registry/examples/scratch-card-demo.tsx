'use client';

import * as React from 'react';
import { ScratchCard, ScratchCardHandle } from '@/registry/components/scratch-card';

const VARIANTS = [
  {
    key: 'gold',
    label: 'Gold',
    reward: 'HIRE ME',
    rewardLabel: 'open to new projects',
    variant: 'gold' as const,
    overlayColor: '#78716c',
    overlayText: 'Scratch to find out',
  },
  {
    key: 'success',
    label: 'Success',
    reward: 'SHIPPED',
    rewardLabel: '12+ production apps',
    variant: 'success' as const,
    overlayColor: '#6b7280',
    overlayText: 'Scratch to reveal',
  },
  {
    key: 'brand',
    label: 'Brand',
    reward: 'WEB3',
    rewardLabel: 'smart contracts & dApps',
    variant: 'brand' as const,
    overlayColor: '#CC5500',
    overlayText: 'gm — scratch me',
  },
  {
    key: 'mystery',
    label: 'Mystery',
    reward: '???',
    rewardLabel: 'something is cooking',
    variant: 'mystery' as const,
    overlayColor: '#52525b',
    overlayText: 'Top secret',
  },
  {
    key: 'default',
    label: 'Default',
    reward: 'FULL STACK',
    rewardLabel: 'end-to-end, top to bottom',
    variant: 'default' as const,
    overlayColor: '#a1a1aa',
    overlayText: 'Scratch to reveal',
  },
] as const;

export default function ScratchCardDemo() {
  const [active, setActive] = React.useState<string>('gold');
  const [key, setKey] = React.useState(0);
  const cardRef = React.useRef<ScratchCardHandle>(null);

  const current = VARIANTS.find((v) => v.key === active)!;

  const handleVariantChange = (k: string) => {
    setActive(k);
    setKey((prev) => prev + 1);
  };

  return (
    <div className="flex w-full flex-col items-center gap-6 p-4">
      {/* Variant tabs */}
      <div className="flex flex-wrap justify-center gap-1.5">
        {VARIANTS.map((v) => (
          <button
            key={v.key}
            onClick={() => handleVariantChange(v.key)}
            className={[
              'rounded-md px-3 py-1.5 text-xs font-medium transition-all',
              active === v.key
                ? 'bg-foreground text-background shadow-sm'
                : 'bg-muted text-muted-foreground hover:bg-muted/80',
            ].join(' ')}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* Card */}
      <ScratchCard
        key={key}
        ref={cardRef}
        reward={current.reward}
        rewardLabel={current.rewardLabel}
        variant={current.variant}
        overlayColor={current.overlayColor}
        overlayText={current.overlayText}
        brushSize={36}
        threshold={0.58}
        confetti
        className="h-36 w-60 sm:h-40 sm:w-72"
      />

      {/* Reset link */}
      <button
        onClick={() => setKey((prev) => prev + 1)}
        className="text-muted-foreground hover:text-foreground text-xs underline underline-offset-4 transition-colors"
      >
        Reset card
      </button>
    </div>
  );
}
