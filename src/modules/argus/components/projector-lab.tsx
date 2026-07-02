'use client';

import { useMemo, useState, useCallback, useRef } from 'react';
import { UploadIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { DatasetUpload } from './dataset-upload';
import { ProjectorCanvas } from './projector-canvas';
import { ProjectorControls } from './projector-controls';
import { PointInspector } from './point-inspector';
import { ColorLegend } from './color-legend';
import { computePCA3D, computeExplainedVariance } from '@/modules/argus/lib/pca';
import { buildColorScale } from '@/modules/argus/lib/color-scale';
import { exportProjectionCSV } from '@/modules/argus/lib/export-csv';
import type { ParsedDataset } from '@/modules/argus/types/projector';

export function ProjectorLab() {
  const [dataset, setDataset] = useState<ParsedDataset | null>(null);
  const [colorByColumn, setColorByColumn] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isComputing, setIsComputing] = useState(false);
  const [pointSize, setPointSize] = useState(0.18);
  const [autoRotate, setAutoRotate] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleLoaded = useCallback((ds: ParsedDataset) => {
    setIsComputing(true);
    setSelectedId(null);
    setTimeout(() => {
      setDataset(ds);
      setColorByColumn(ds.labelColumn ?? ds.metadataColumns[0] ?? null);
      setIsComputing(false);
    }, 30);
  }, []);

  const projected = useMemo(() => (dataset ? computePCA3D(dataset.points) : []), [dataset]);
  const explainedVariance = useMemo(
    () => (dataset ? computeExplainedVariance(dataset.points) : []),
    [dataset]
  );

  const colorOf = useMemo(() => {
    if (!dataset) return () => '#6366f1';
    return buildColorScale(dataset.points, colorByColumn);
  }, [dataset, colorByColumn]);

  const handleToggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const selectedPoint = dataset?.points.find((p) => p.id === selectedId) ?? null;
  const hoveredPoint = dataset?.points.find((p) => p.id === hoveredId) ?? null;

  if (!dataset) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-8">
        {isComputing ? (
          <div className="flex w-full max-w-xl flex-col gap-3">
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-9 w-full rounded-md" />
          </div>
        ) : (
          <DatasetUpload onLoaded={handleLoaded} />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-4">
      <ProjectorControls
        points={dataset.points}
        metadataColumns={dataset.metadataColumns}
        colorByColumn={colorByColumn}
        onColorByChange={setColorByColumn}
        onSearchSelect={setSelectedId}
        totalCount={dataset.points.length}
        downsampled={dataset.downsampled}
        pointSize={pointSize}
        onPointSizeChange={setPointSize}
        autoRotate={autoRotate}
        onAutoRotateChange={setAutoRotate}
        showGrid={showGrid}
        onShowGridChange={setShowGrid}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        onExport={() => exportProjectionCSV(dataset.points, projected)}
        explainedVariance={explainedVariance}
      />

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_340px]">
        <div
          ref={containerRef}
          className="bg-surface inset-ring-border/64 relative h-[75vh] overflow-hidden rounded-xl inset-ring-1"
        >
          <ProjectorCanvas
            points={dataset.points}
            projected={projected}
            colorOf={colorOf}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onHover={setHoveredId}
            pointSize={pointSize}
            autoRotate={autoRotate}
            showGrid={showGrid}
          />

          {hoveredPoint && !selectedId && (
            <div className="bg-popover text-popover-foreground pointer-events-none absolute top-3 left-3 rounded-md border px-2.5 py-1.5 text-xs shadow-md">
              {hoveredPoint.label}
            </div>
          )}

          <div className="bg-background/80 absolute bottom-3 left-3 rounded-md px-2 py-1.5 backdrop-blur">
            <ColorLegend points={dataset.points} column={colorByColumn} />
          </div>

          <div className="absolute top-3 right-3 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-background/80 gap-1.5 backdrop-blur"
              onClick={() => {
                setDataset(null);
                setSelectedId(null);
              }}
            >
              <UploadIcon className="size-3.5" />
              New dataset
            </Button>
          </div>
        </div>

        <div className="h-[75vh]">
          {selectedPoint ? (
            <PointInspector
              point={selectedPoint}
              allPoints={dataset.points}
              onClose={() => setSelectedId(null)}
              onSelectNeighbor={setSelectedId}
            />
          ) : (
            <div className="bg-surface inset-ring-border/64 flex h-full items-center justify-center rounded-xl p-6 text-center inset-ring-1">
              <p className="text-muted-foreground text-sm">
                Click any point in the 3D view to see its details and nearest neighbors.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
