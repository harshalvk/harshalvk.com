'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { BriefcaseBusinessIcon, InfinityIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/formatDate';
import { ChevronDownIcon, ChevronDownIconHandle } from '@/components/icons/chevron-icon';
import { LinkIcon, LinkIconHandle } from '@/components/icons/link-icon';
import type { Experience, ExperiencePosition } from '@/modules/portfolio/types/experiences';
import { Route } from 'next';

// ── Position item ─────────────────────────────────────────────────────────────

function PositionItem({ position, isLast }: { position: ExperiencePosition; isLast: boolean }) {
  const [isOpen, setIsOpen] = React.useState(position.isExpanded ?? false);
  const chevronTopRef = useRef<ChevronDownIconHandle>(null);
  const chevronBottomRef = useRef<ChevronDownIconHandle>(null);
  const hasContent = !!(position.description || (position.skills?.length ?? 0) > 0);

  useEffect(() => {
    if (position.isExpanded) {
      chevronTopRef.current?.startAnimation();
      chevronBottomRef.current?.startAnimation();
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      chevronTopRef.current?.startAnimation();
      chevronBottomRef.current?.startAnimation();
    } else {
      chevronTopRef.current?.stopAnimation();
      chevronBottomRef.current?.stopAnimation();
    }
  }, [isOpen]);

  return (
    <Collapsible open={isOpen} onOpenChange={hasContent ? setIsOpen : undefined}>
      <CollapsibleTrigger asChild>
        <button
          type="button"
          className={cn(
            'flex w-full items-start gap-3 rounded-sm py-2 text-left',
            'hover:bg-zinc-100 dark:hover:bg-zinc-800/30',
            !hasContent && 'cursor-default'
          )}
        >
          {/* Position icon — sits on top of the vertical line */}
          <div
            className={cn(
              'relative z-10 flex size-6 shrink-0 items-center justify-center rounded-sm',
              'bg-muted',
              '[&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-3.5'
            )}
          >
            {position.icon ?? <BriefcaseBusinessIcon className="text-muted-foreground" />}
          </div>

          <div className="flex flex-1 items-start justify-between gap-2">
            <div>
              <h4 className="text-sm font-medium md:text-base">{position.title}</h4>
              <div className="text-muted-foreground flex flex-wrap items-center gap-1 text-xs">
                {position.employmentType && (
                  <>
                    <span className="font-mono">{position.employmentType}</span>
                    <span>·</span>
                  </>
                )}
                <span className="font-mono tabular-nums">
                  {formatDate(position.employmentPeriod.start)}
                </span>
                <span className="font-mono">—</span>
                {position.employmentPeriod.end ? (
                  <span className="font-mono tabular-nums">
                    {formatDate(position.employmentPeriod.end)}
                  </span>
                ) : (
                  <InfinityIcon className="size-3.5 translate-y-px" aria-label="Present" />
                )}
              </div>
            </div>

            {hasContent && (
              <div className="flex shrink-0 flex-col items-center pt-0.5">
                <ChevronDownIcon
                  ref={chevronBottomRef}
                  className="text-muted-foreground -mb-1 h-4 w-4 rotate-180"
                />
                <ChevronDownIcon
                  ref={chevronTopRef}
                  className="text-muted-foreground -mt-1 h-4 w-4"
                />
              </div>
            )}
          </div>
        </button>
      </CollapsibleTrigger>

      <AnimatePresence initial={false}>
        {isOpen && (
          <CollapsibleContent forceMount asChild>
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                height: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                opacity: { duration: 0.2 },
              }}
              className="overflow-hidden"
            >
              <motion.div
                initial={{ y: -8 }}
                animate={{ y: 0 }}
                exit={{ y: -8 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-3 pr-1 pb-3 pl-9"
              >
                {position.description && (
                  <p className="text-muted-foreground font-mono text-sm leading-relaxed">
                    {position.description}
                  </p>
                )}
                {position.skills && position.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {position.skills.map((skill, i) => (
                      <div
                        key={i}
                        className="text-muted-foreground cursor-default rounded-sm border bg-zinc-100 px-2 py-1 text-xs select-none md:text-sm dark:bg-zinc-800"
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </motion.div>
          </CollapsibleContent>
        )}
      </AnimatePresence>
    </Collapsible>
  );
}

// ── Experience item (company level) ──────────────────────────────────────────

export function ExperienceItem({
  experience,
  isLast,
}: {
  experience: Experience;
  isLast?: boolean;
}) {
  const linkRef = useRef<LinkIconHandle>(null);

  const starts = experience.positions.map((p) => p.employmentPeriod.start);
  const ends = experience.positions.map((p) => p.employmentPeriod.end);
  const earliestStart = starts[starts.length - 1];
  const latestEnd = ends[0];

  return (
    <div id={`experience-${experience.id}`} className={cn('scroll-mt-20 space-y-3 px-4 py-4')}>
      {/* Company header */}
      <div className="flex items-center gap-3">
        {/* Company logo/icon */}
        <div className="flex size-6 shrink-0 items-center justify-center select-none">
          {experience.companyLogo ? (
            <Image
              src={experience.companyLogo}
              alt={`${experience.companyName} logo`}
              width={24}
              height={24}
              className="rounded-sm object-contain"
              unoptimized
            />
          ) : experience.companyIcon ? (
            <span className="size-6">{experience.companyIcon}</span>
          ) : (
            <span className="flex size-2 rounded-full bg-zinc-300 dark:bg-zinc-600" />
          )}
        </div>

        <h3 className="text-base font-semibold md:text-lg">
          {experience.companyWebsite ? (
            <Link
              href={experience.companyWebsite as Route}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5"
            >
              {experience.companyName}
              <LinkIcon
                ref={linkRef}
                className="text-muted-foreground h-3.5 w-3.5"
                tooltip={`Visit ${experience.companyName}`}
                onMouseEnter={() => linkRef.current?.startAnimation()}
                onMouseLeave={() => linkRef.current?.stopAnimation()}
              />
            </Link>
          ) : (
            experience.companyName
          )}
        </h3>

        {/* Current employer — pulsing dot */}
        {experience.isCurrentEmployer && (
          <span className="relative flex items-center justify-center" aria-label="Current Employer">
            <span className="absolute inline-flex size-3 animate-ping rounded-full bg-green-500 opacity-40" />
            <span className="relative inline-flex size-2 rounded-full bg-green-500" />
          </span>
        )}

        {/* Date range */}
        <div className="text-muted-foreground ml-auto flex items-center gap-1 text-xs">
          <span className="font-mono tabular-nums">{formatDate(earliestStart)}</span>
          <span className="font-mono">—</span>
          {latestEnd ? (
            <span className="font-mono tabular-nums">{formatDate(latestEnd)}</span>
          ) : (
            <InfinityIcon className="size-3.5 translate-y-px" aria-label="Present" />
          )}
        </div>
      </div>

      {/* Positions — vertical line via before: on the wrapper */}
      <div className="before:bg-border relative space-y-1 before:absolute before:top-0 before:left-3 before:h-full before:w-px">
        {experience.positions.map((position, i) => (
          <PositionItem
            key={position.id}
            position={position}
            isLast={i === experience.positions.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
