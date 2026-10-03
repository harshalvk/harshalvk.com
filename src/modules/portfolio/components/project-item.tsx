'use client';

import React, { useEffect, useRef } from 'react';
import type { Project } from '@/modules/portfolio/types/projects';
import { AnimatePresence, motion } from 'framer-motion';
import { Box, SquareArrowOutUpRight } from 'lucide-react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Prose } from '@/components/Typography';
import { MarkdownClient } from '@/components/markdown';
import { formatDate } from '@/lib/formatDate';
import Image from 'next/image';
import { LinkIcon, LinkIconHandle } from '@/components/icons/link-icon';
import Link from 'next/link';
import { ChevronDownIcon, ChevronDownIconHandle } from '@/components/icons/chevron-icon';
import TechBadge from '@/components/TechBadge';
import { Route } from 'next';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function ProjectItem({ project }: { project: Project }) {
  const [isOpen, setIsOpen] = React.useState(project.isExpanded ?? false);
  const chevronTopRef = useRef<ChevronDownIconHandle>(null);
  const chevronBottomRef = useRef<ChevronDownIconHandle>(null);
  const linkRef = useRef<LinkIconHandle>(null);

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
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center border-b text-left hover:bg-zinc-100/30 dark:hover:bg-zinc-800/30"
          aria-label={`Toggle details for ${project.title}`}
        >
          <div className="flex aspect-square items-center justify-center self-stretch p-5">
            {project.logo ? (
              <Image
                src={project.logo}
                height={52}
                width={52}
                alt="Project Logo"
                className="bg-transparent"
              />
            ) : (
              <div className="px-0 sm:px-2">
                <div className="bg-muted rounded-md p-2">
                  <Box className="text-muted-foreground size-5" />
                </div>
              </div>
            )}
          </div>
          <div className="self-stretch border-r border-dashed" />
          <div className="flex h-full flex-1 items-center justify-between p-4">
            <div>
              <h3 className="font-medium lg:text-xl">{project.title}</h3>

              <div className="flex gap-1">
                <p className="text-muted-foreground text-sm">{formatDate(project.period.start)}</p>
                <p className="text-muted-foreground text-sm">—</p>
                {project.period.end ? (
                  <p className="text-muted-foreground text-sm">{formatDate(project.period.end)}</p>
                ) : (
                  <p className="text-muted-foreground text-sm">∞</p>
                )}
              </div>
              <p className="text-muted-foreground hidden max-w-prose text-sm leading-relaxed sm:block">
                {project.oneLiner}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Link
                href={`/projects/${project.title.toLowerCase()}`}
                aria-label={`Read more about ${project.title}`}
                className="text-muted-foreground hover:text-foreground inline-flex size-6 shrink-0 items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <SquareArrowOutUpRight aria-hidden="true" className="size-4" />
              </Link>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="absolute -top-2 -right-2" />
                </TooltipTrigger>
                <TooltipContent>Project Details</TooltipContent>
              </Tooltip>

              <a
                href={project.link as Route}
                aria-label={`Visit ${project.title} source code`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-muted-foreground hover:text-foreground inline-flex size-6 shrink-0 items-center justify-center"
              >
                <LinkIcon
                  aria-hidden="true"
                  ref={linkRef}
                  className="size-4"
                  onMouseEnter={() => linkRef.current?.startAnimation()}
                  onMouseLeave={() => linkRef.current?.stopAnimation()}
                />
              </a>

              <div aria-hidden="true" className="flex shrink-0 flex-col items-center">
                <ChevronDownIcon
                  ref={chevronBottomRef}
                  className="text-muted-foreground -mb-1 size-4 rotate-180"
                />
                <ChevronDownIcon
                  ref={chevronTopRef}
                  className="text-muted-foreground -mt-1 size-4"
                />
              </div>
            </div>
          </div>
        </button>
      </CollapsibleTrigger>

      <AnimatePresence initial={false}>
        {isOpen && (
          <CollapsibleContent forceMount asChild>
            <motion.div
              initial={{
                height: 0,
                opacity: 0,
              }}
              animate={{
                height: 'auto',
                opacity: 1,
              }}
              exit={{
                height: 0,
                opacity: 0,
              }}
              transition={{
                height: {
                  duration: 0.35,
                  ease: [0.22, 1, 0.36, 1],
                },
                opacity: {
                  duration: 0.2,
                },
              }}
              className="overflow-hidden border-b"
            >
              <motion.div
                initial={{ y: -8 }}
                animate={{ y: 0 }}
                exit={{ y: -8 }}
                transition={{
                  duration: 0.3,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="space-y-4 p-4"
              >
                {project.description && (
                  <Prose>
                    <MarkdownClient>{project.description}</MarkdownClient>
                  </Prose>
                )}

                <div className="flex flex-wrap gap-2">
                  {project.skills.map((skill, index) => (
                    <TechBadge key={index} name={skill} />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </CollapsibleContent>
        )}
      </AnimatePresence>
    </Collapsible>
  );
}
