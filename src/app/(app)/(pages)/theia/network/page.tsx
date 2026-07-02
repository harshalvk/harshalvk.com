import type { Metadata } from 'next';
import { PanelTitle } from '@/modules/portfolio/components/panel';
import { NetworkSimulator } from '@/modules/theia/components/network-simulator';

export const metadata: Metadata = {
  title: 'Computer Networks — Theia',
  description:
    'Interactive simulations of network topologies — bus, star, ring, mesh, and tree — with animated packet transmission.',
  alternates: { canonical: 'theia/network' },
};

export default function NetworkPage() {
  return (
    <section className="flex-1 border-x">
      <div className="space-y-2 px-4 py-2">
        <PanelTitle>Computer Networks</PanelTitle>
        <p className="text-muted-foreground text-sm md:text-base">
          Pick a topology, send a packet, and watch how each network structure actually moves data —
          collisions, tokens, and all.
        </p>
      </div>
      <div className="screen-line-top screen-line-bottom bg-hatching h-4" />
      <div className="p-4">
        <NetworkSimulator />
      </div>
    </section>
  );
}
