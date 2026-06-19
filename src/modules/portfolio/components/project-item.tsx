'use client';

import React, { useEffect, useRef } from 'react';
import type { Project } from '@/modules/portfolio/types/projects';
import { AnimatePresence, motion } from 'framer-motion';
import { Box } from 'lucide-react';

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
        >
          <div className="flex aspect-square items-center justify-center self-stretch p-5">
            {project.logo ? (
              <Image src={project.logo} height={500} width={500} alt="Project Logo" />
            ) : (
              <div className="bg-muted rounded-md p-2">
                <Box className="text-muted-foreground size-5" />
              </div>
            )}
          </div>
          <div className="self-stretch border-r border-dashed" />
          <div className="flex h-full flex-1 items-center justify-between p-5">
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
            </div>

            <div className="flex items-center gap-4">
              <Link
                href={project.link as Route}
                target="_blank"
                onClick={(e) => e.stopPropagation()}
              >
                <LinkIcon
                  ref={linkRef}
                  className="text-muted-foreground h-4 w-4"
                  tooltip="Open Project Link"
                  onMouseEnter={() => linkRef.current?.startAnimation()}
                  onMouseLeave={() => linkRef.current?.stopAnimation()}
                />
              </Link>
              <div className="flex flex-col items-center gap-0.5">
                <ChevronDownIcon
                  ref={chevronBottomRef}
                  className="text-muted-foreground -mb-1 h-4 w-4 rotate-180"
                />
                <ChevronDownIcon
                  ref={chevronTopRef}
                  className="text-muted-foreground -mt-1 h-4 w-4"
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
