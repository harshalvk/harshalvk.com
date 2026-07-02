// src/modules/theia/components/network-simulator.tsx
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Pause, Play, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NetworkCanvas } from './network-canvas';
import { NetworkControls } from './network-controls';
import { TopologyConceptPanel } from './topology-concept-panel';
import { generateTopology } from '@/modules/theia/lib/topology-layouts';
import { sendUnicastSteps, sendBusSteps, sendRingSteps } from '@/modules/theia/lib/network-engine';
import { getTopology } from '@/modules/theia/data/network-topologies';
import type { NetworkStep, TopologyType } from '@/modules/theia/types/network';

function idleStep(
  nodes: ReturnType<typeof generateTopology>['nodes'],
  links: ReturnType<typeof generateTopology>['links']
): NetworkStep {
  return {
    nodes,
    links,
    activeLinkIds: [],
    packets: [],
    description:
      'Choose a sender and receiver, then send a packet to see how this topology handles it.',
  };
}

export function NetworkSimulator() {
  const [topology, setTopology] = useState<TopologyType>('star');
  const [layout, setLayout] = useState(() => generateTopology('star'));
  const [fromId, setFromId] = useState('host-0');
  const [toId, setToId] = useState('host-1');
  const [steps, setSteps] = useState<NetworkStep[]>(() => [idleStep(layout.nodes, layout.links)]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const topologyMeta = getTopology(topology)!;

  const handleTopologyChange = useCallback((t: TopologyType) => {
    const newLayout = generateTopology(t);
    setTopology(t);
    setLayout(newLayout);
    setFromId(newLayout.nodes.find((n) => n.role === 'host')!.id);
    setToId(newLayout.nodes.filter((n) => n.role === 'host')[1]?.id ?? newLayout.nodes[0].id);
    setSteps([idleStep(newLayout.nodes, newLayout.links)]);
    setCurrentStep(0);
    setIsPlaying(false);
  }, []);

  const runSteps = useCallback((newSteps: NetworkStep[]) => {
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(true);
  }, []);

  const handleSend = useCallback(() => {
    if (topology === 'bus') {
      runSteps(sendBusSteps(layout.nodes, layout.links, fromId, toId, false));
    } else if (topology === 'ring') {
      runSteps(sendRingSteps(layout.nodes, layout.links, fromId, toId));
    } else {
      runSteps(sendUnicastSteps(layout.nodes, layout.links, topology, fromId, toId));
    }
  }, [topology, layout, fromId, toId, runSteps]);

  const handleCollisionDemo = useCallback(() => {
    runSteps(sendBusSteps(layout.nodes, layout.links, fromId, toId, true));
  }, [layout, fromId, toId, runSteps]);

  useEffect(() => {
    if (!isPlaying) return;
    if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }
    intervalRef.current = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1400);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, steps.length, currentStep]);

  const step = steps[currentStep];

  return (
    <div className="flex flex-col gap-4">
      <NetworkControls
        topology={topology}
        onTopologyChange={handleTopologyChange}
        nodes={layout.nodes}
        fromId={fromId}
        toId={toId}
        onFromChange={setFromId}
        onToChange={setToId}
        onSend={handleSend}
        onCollisionDemo={handleCollisionDemo}
        showCollisionDemo={topology === 'bus'}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-3">
          <NetworkCanvas step={step} />

          <div className="bg-surface inset-ring-border/64 rounded-xl p-4 inset-ring-1">
            <p className="text-sm leading-relaxed">{step.description}</p>
          </div>

          <div className="bg-surface inset-ring-border/64 flex items-center gap-2 rounded-xl p-3 inset-ring-1">
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => {
                setIsPlaying(false);
                setCurrentStep((s) => Math.max(0, s - 1));
              }}
              disabled={currentStep === 0}
            >
              <SkipBack className="size-3.5" />
            </Button>
            <Button
              size="icon"
              className="size-8"
              onClick={() => setIsPlaying((p) => !p)}
              disabled={steps.length <= 1}
            >
              {isPlaying ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => {
                setIsPlaying(false);
                setCurrentStep((s) => Math.min(steps.length - 1, s + 1));
              }}
              disabled={currentStep >= steps.length - 1}
            >
              <SkipForward className="size-3.5" />
            </Button>
            <span className="text-muted-foreground ml-auto font-mono text-xs">
              Step {currentStep + 1} / {steps.length}
            </span>
          </div>
        </div>

        <TopologyConceptPanel topology={topologyMeta} />
      </div>
    </div>
  );
}
