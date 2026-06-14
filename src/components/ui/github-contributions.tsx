'use client';

import { use, useState } from 'react';
import { format } from 'date-fns';
import { createPortal } from 'react-dom';

import { cn } from '@/lib/utils';
import { Spinner } from '@/components/ui/spinner';
import type { Activity } from '@/components/ui/contribution-graph';
import {
  ContributionGraph,
  ContributionGraphBlock,
  ContributionGraphCalendar,
  ContributionGraphFooter,
  ContributionGraphLegend,
  ContributionGraphTotalCount,
} from '@/components/ui/contribution-graph';

// ── SVG-safe tooltip ──────────────────────────────────────────────────────────
// Radix Tooltip breaks inside SVG elements because SVG bounding rects
// behave differently from HTML elements. This uses mouse coords + portal instead.

type TooltipPos = { x: number; y: number };

function SVGTooltip({ content, children }: { content: string; children: React.ReactNode }) {
  const [pos, setPos] = useState<TooltipPos | null>(null);

  return (
    <g
      onMouseEnter={(e) => setPos({ x: e.clientX, y: e.clientY })}
      onMouseMove={(e) => setPos({ x: e.clientX, y: e.clientY })}
      onMouseLeave={() => setPos(null)}
      style={{ outline: 'none' }}
    >
      {children}
      {pos &&
        createPortal(
          <div
            style={{
              position: 'fixed',
              left: pos.x,
              top: pos.y - 44,
              transform: 'translateX(-50%)',
              zIndex: 9999,
              pointerEvents: 'none',
            }}
            className="bg-foreground text-background animate-in fade-in-0 zoom-in-95 rounded-md px-3 py-1.5 font-sans text-xs whitespace-nowrap"
          >
            {content}
            {/* Arrow */}
            <span
              style={{
                position: 'absolute',
                bottom: -4,
                left: '50%',
                transform: 'translateX(-50%) rotate(45deg)',
              }}
              className="bg-foreground block size-2 rounded-[2px]"
            />
          </div>,
          document.body
        )}
    </g>
  );
}

// ── GitHubContributions ───────────────────────────────────────────────────────

export function GitHubContributions({
  contributions,
  githubProfileUrl,
  className,
}: {
  contributions: Promise<Activity[]>;
  githubProfileUrl: string;
  className?: string;
}) {
  const data = use(contributions);

  return (
    <ContributionGraph
      className={cn('mx-auto py-2', className)}
      data={data}
      blockSize={15}
      blockMargin={3}
      blockRadius={1}
    >
      <ContributionGraphCalendar className="no-scrollbar px-2" title="GitHub Contributions">
        {({ activity, dayIndex, weekIndex }) => (
          <SVGTooltip
            content={`${activity.count} contribution${activity.count !== 1 ? 's' : ''} on ${format(new Date(activity.date), 'dd.MM.yyyy')}`}
          >
            <ContributionGraphBlock activity={activity} dayIndex={dayIndex} weekIndex={weekIndex} />
          </SVGTooltip>
        )}
      </ContributionGraphCalendar>

      <ContributionGraphFooter className="px-2">
        <ContributionGraphTotalCount>
          {({ totalCount, year }) => (
            <div className="text-muted-foreground">
              {totalCount.toLocaleString('en')} contributions in {year} on{' '}
              <a
                className="text-foreground link-underline"
                href={githubProfileUrl}
                target="_blank"
                rel="noopener"
              >
                GitHub
              </a>
              .
            </div>
          )}
        </ContributionGraphTotalCount>

        <ContributionGraphLegend />
      </ContributionGraphFooter>
    </ContributionGraph>
  );
}

export function GitHubContributionsFallback() {
  return (
    <div className="flex h-40.5 w-full items-center justify-center">
      <Spinner className="text-muted-foreground" />
    </div>
  );
}
