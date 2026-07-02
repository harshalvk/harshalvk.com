'use client';

import { XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import type { DataPoint } from '@/modules/argus/types/projector';
import { findNearestNeighbors } from '@/modules/argus/lib/pca';

export function PointInspector({
  point,
  allPoints,
  onClose,
  onSelectNeighbor,
}: {
  point: DataPoint;
  allPoints: DataPoint[];
  onClose: () => void;
  onSelectNeighbor: (id: string) => void;
}) {
  const neighbors = findNearestNeighbors(point, allPoints, 10);

  return (
    <div className="bg-surface inset-ring-border/64 flex h-full flex-col rounded-xl inset-ring-1">
      <div className="flex items-center justify-between p-4 pb-2">
        <div>
          <p className="text-sm font-medium">{point.label}</p>
          <p className="text-muted-foreground text-xs">{point.vector.length}-dimensional vector</p>
        </div>
        <Button variant="ghost" size="icon" className="size-7" onClick={onClose}>
          <XIcon className="size-4" />
        </Button>
      </div>

      {Object.keys(point.metadata).length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-4 pb-3">
          {Object.entries(point.metadata).map(([key, value]) => (
            <Badge key={key} variant="secondary" className="text-xs">
              {key}: {String(value)}
            </Badge>
          ))}
        </div>
      )}

      <Separator />

      <div className="px-4 pt-3 pb-1">
        <p className="text-muted-foreground text-xs font-medium">
          Nearest neighbors (cosine similarity)
        </p>
      </div>

      <ScrollArea className="flex-1 px-4 pb-4">
        <div className="flex flex-col gap-1">
          {neighbors.map(({ point: n, similarity }) => (
            <button
              key={n.id}
              onClick={() => onSelectNeighbor(n.id)}
              className="hover:bg-muted flex items-center justify-between rounded-md px-2 py-1.5 text-left text-sm transition-colors"
            >
              <span className="line-clamp-1">{n.label}</span>
              <span className="text-muted-foreground ml-2 shrink-0 font-mono text-xs">
                {similarity.toFixed(3)}
              </span>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
