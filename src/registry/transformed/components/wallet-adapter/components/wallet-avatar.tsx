'use client';

import { useMemo } from 'react';

// Simple deterministic hash -> two hues for gradient.
function hashToHues(input: string): [number, number] {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  const hue1 = Math.abs(hash) % 360;
  const hue2 = (hue1 + 80 + (Math.abs(hash >> 8) % 60)) % 360;
  return [hue1, hue2];
}

export function WalletAvatar({ address, size = 28 }: { address: string; size?: number }) {
  const gradient = useMemo(() => {
    const [h1, h2] = hashToHues(address);
    return `linear-gradient(135deg, hsl(${h1}, 70%, 55%), hsl(${h2}, 70%, 45%))`;
  }, [address]);

  return (
    <div
      style={{ width: size, height: size, background: gradient }}
      className="shrink-0 rounded-full"
      aria-hidden="true"
    />
  );
}
