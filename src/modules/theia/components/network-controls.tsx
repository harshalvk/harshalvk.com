'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { SendIcon, ZapIcon } from 'lucide-react';
import type { NetworkNode, TopologyType } from '@/modules/theia/types/network';

const TOPOLOGY_LABELS: Record<TopologyType, string> = {
  bus: 'Bus',
  star: 'Star',
  ring: 'Ring',
  mesh: 'Mesh',
  tree: 'Tree',
};

export function NetworkControls({
  topology,
  onTopologyChange,
  nodes,
  fromId,
  toId,
  onFromChange,
  onToChange,
  onSend,
  onCollisionDemo,
  showCollisionDemo,
}: {
  topology: TopologyType;
  onTopologyChange: (t: TopologyType) => void;
  nodes: NetworkNode[];
  fromId: string;
  toId: string;
  onFromChange: (id: string) => void;
  onToChange: (id: string) => void;
  onSend: () => void;
  onCollisionDemo?: () => void;
  showCollisionDemo: boolean;
}) {
  const hostNodes = nodes.filter((n) => n.role === 'host');

  return (
    <div className="bg-surface inset-ring-border/64 flex flex-col gap-3 rounded-xl p-4 inset-ring-1">
      <Tabs value={topology} onValueChange={(v) => onTopologyChange(v as TopologyType)}>
        <TabsList className="grid w-full grid-cols-5">
          {(Object.keys(TOPOLOGY_LABELS) as TopologyType[]).map((t) => (
            <TabsTrigger key={t} value={t} className="text-xs">
              {TOPOLOGY_LABELS[t]}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1.5">
          <Label className="text-muted-foreground text-xs">From</Label>
          <Select value={fromId} onValueChange={onFromChange}>
            <SelectTrigger size="sm" className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {hostNodes.map((n) => (
                <SelectItem key={n.id} value={n.id}>
                  {n.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-muted-foreground text-xs">To</Label>
          <Select value={toId} onValueChange={onToChange}>
            <SelectTrigger size="sm" className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {hostNodes
                .filter((n) => n.id !== fromId)
                .map((n) => (
                  <SelectItem key={n.id} value={n.id}>
                    {n.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <Button size="sm" className="gap-1.5" onClick={onSend} disabled={fromId === toId}>
          <SendIcon className="size-3.5" />
          Send Packet
        </Button>

        {showCollisionDemo && onCollisionDemo && (
          <Button size="sm" variant="outline" className="gap-1.5" onClick={onCollisionDemo}>
            <ZapIcon className="size-3.5" />
            Simulate Collision
          </Button>
        )}
      </div>
    </div>
  );
}
