'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PROBLEMS } from '../data/problems';
import { DIFFICULTY_CLASS } from '../lib/constants';

export function ProblemList() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2">
      {PROBLEMS.map((problem, idx) => (
        <motion.div
          key={problem.slug}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.04 }}
          className="hover:bg-muted-foreground/5 relative flex h-full items-start justify-between gap-4 border-b border-dashed p-5 sm:odd:border-r"
        >
          <Link href={`/theia/problems/${problem.slug}`} className="flex-1">
            <div className="flex w-full items-center justify-between gap-2">
              <h3 className="text-sm font-medium">{problem.title}</h3>
              <Badge
                variant="outline"
                className={cn('shrink-0 text-xs capitalize', DIFFICULTY_CLASS[problem.difficulty])}
              >
                {problem.difficulty}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">{problem.summary}</p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {problem.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs font-normal">
                  {tag}
                </Badge>
              ))}
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
