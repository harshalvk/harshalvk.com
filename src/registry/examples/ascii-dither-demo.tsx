'use client';

import { AsciiDither } from '@/registry/components/ascii-dither/ascii-dither';

export default function AsciiDitherDemo() {
  return (
    <div className="bg-background relative h-64 w-full overflow-hidden rounded-xl border">
      <AsciiDither className="absolute inset-0 h-full w-full" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-1">
        <span className="text-foreground font-mono text-2xl font-semibold tracking-tight">
          harshalvk
        </span>
        <span className="text-muted-foreground font-mono text-xs">move your cursor</span>
      </div>
    </div>
  );
}
