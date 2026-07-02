'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2Icon, XCircleIcon } from 'lucide-react';
import type { TopologyMeta } from '@/modules/theia/types/network';

export function TopologyConceptPanel({ topology }: { topology: TopologyMeta }) {
  return (
    <Card className="bg-surface inset-ring-border/64 inset-ring-1">
      <CardContent className="flex flex-col gap-4 pt-4">
        <div>
          <h3 className="text-sm font-medium">{topology.title}</h3>
          <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
            {topology.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {topology.characteristics.map((c) => (
            <Badge key={c.label} variant="secondary" className="text-xs font-normal">
              {c.label}: {c.value}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <p className="mb-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              Advantages
            </p>
            <ul className="flex flex-col gap-1">
              {topology.pros.map((p) => (
                <li key={p} className="text-muted-foreground flex items-start gap-1.5 text-xs">
                  <CheckCircle2Icon className="mt-0.5 size-3 shrink-0 text-emerald-500" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
              Trade-offs
            </p>
            <ul className="flex flex-col gap-1">
              {topology.cons.map((c) => (
                <li key={c} className="text-muted-foreground flex items-start gap-1.5 text-xs">
                  <XCircleIcon className="mt-0.5 size-3 shrink-0 text-rose-500" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
