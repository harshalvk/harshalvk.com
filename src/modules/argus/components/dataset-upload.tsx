'use client';

import { useCallback, useState } from 'react';
import { UploadCloudIcon, SparklesIcon, Loader2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { parseDatasetFile, generateSampleDataset } from '@/modules/argus/lib/parse-dataset';
import type { ParsedDataset } from '@/modules/argus/types/projector';
import { cn } from '@/lib/utils';

export function DatasetUpload({ onLoaded }: { onLoaded: (dataset: ParsedDataset) => void }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      setIsLoading(true);
      try {
        const dataset = await parseDatasetFile(file);
        onLoaded(dataset);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to parse file.');
      } finally {
        setIsLoading(false);
      }
    },
    [onLoaded]
  );

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4">
      <Card
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files[0];
          if (file) handleFile(file);
        }}
        className={cn(
          'border-2 border-dashed transition-colors',
          isDragging ? 'border-primary bg-primary/5' : 'border-border'
        )}
      >
        <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
          {isLoading ? (
            <Loader2Icon className="text-muted-foreground size-8 animate-spin" />
          ) : (
            <UploadCloudIcon className="text-muted-foreground size-8" />
          )}

          <div>
            <p className="text-sm font-medium">Drop a CSV or TSV file here</p>
            <p className="text-muted-foreground mt-1 text-xs">
              Up to 8MB, 5,000 rows, 200 numeric columns. Everything runs in your browser — nothing
              is uploaded anywhere.
            </p>
          </div>

          <label>
            <input
              type="file"
              accept=".csv,.tsv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
            <Button asChild variant="outline" size="sm" className="mt-1">
              <span>Browse files</span>
            </Button>
          </label>
        </CardContent>
      </Card>

      {error && <p className="text-destructive text-center text-sm">{error}</p>}

      <div className="flex items-center gap-3">
        <div className="bg-border h-px flex-1" />
        <span className="text-muted-foreground text-xs">or</span>
        <div className="bg-border h-px flex-1" />
      </div>

      <Button
        variant="secondary"
        className="gap-2"
        onClick={() => onLoaded(generateSampleDataset())}
      >
        <SparklesIcon className="size-4" />
        Load a sample dataset (6 clusters, 24 dimensions)
      </Button>
    </div>
  );
}
