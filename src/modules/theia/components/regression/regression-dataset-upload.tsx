'use client';

import { useRef } from 'react';
import { UploadIcon, ShuffleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { parseRegressionCSV } from '@/modules/theia/lib/parse-regression-csv';
import { randomRegressionPoints } from '@/modules/theia/lib/regression-engine-v2';
import type { RegressionPoint } from '@/modules/theia/types/regression-v2';

export function RegressionDatasetUpload({
  onLoad,
  onError,
}: {
  onLoad: (points: RegressionPoint[]) => void;
  onError: (msg: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center gap-2">
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          try {
            onLoad(await parseRegressionCSV(file));
          } catch (err) {
            onError(err instanceof Error ? err.message : 'Failed to parse CSV.');
          }
          e.target.value = '';
        }}
      />
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5"
        onClick={() => inputRef.current?.click()}
      >
        <UploadIcon className="size-3.5" />
        Upload CSV
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5"
        onClick={() => onLoad(randomRegressionPoints())}
      >
        <ShuffleIcon className="size-3.5" />
        Random dataset
      </Button>
    </div>
  );
}
