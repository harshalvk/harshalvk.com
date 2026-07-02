'use client';

import { AnimatePresence, motion } from 'motion/react';
import type { NetworkStep } from '@/modules/theia/types/network';
import { Router, Server, Wifi } from 'lucide-react';

const ROLE_ICON = { host: Server, hub: Wifi, switch: Router, router: Router } as const;

const STATUS_COLOR: Record<string, string> = {
  traveling: '#0ea5e9',
  delivered: '#10b981',
  collided: '#ef4444',
  dropped: '#6b7280',
  broadcasting: '#a855f7',
};

export function NetworkCanvas({ step }: { step: NetworkStep }) {
  const { nodes, links, activeLinkIds, packets } = step;

  return (
    <div className="bg-surface inset-ring-border/64 h-[420px] w-full overflow-hidden rounded-xl inset-ring-1">
      <svg viewBox="0 0 600 400" className="h-full w-full">
        {/* Links */}
        {links.map((link) => {
          const from = nodes.find((n) => n.id === link.from);
          const to = nodes.find((n) => n.id === link.to);
          if (!from || !to) return null;
          const isActive = activeLinkIds.includes(link.id);

          return (
            <motion.line
              key={link.id}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={isActive ? 'var(--primary)' : 'var(--border)'}
              strokeWidth={isActive ? 2.5 : 1.5}
              animate={{ opacity: isActive ? 1 : 0.5 }}
              transition={{ duration: 0.3 }}
            />
          );
        })}

        {/* Packets traveling along paths */}
        <AnimatePresence>
          {packets.map((packet) => {
            const pathNodes = packet.path
              .map((id) => nodes.find((n) => n.id === id))
              .filter((n): n is NonNullable<typeof n> => Boolean(n));

            if (pathNodes.length === 0) return null;

            if (packet.status === 'broadcasting' || packet.to === 'broadcast') {
              // pulse from source outward to all nodes
              const source = pathNodes[0];
              return (
                <motion.circle
                  key={packet.id}
                  cx={source.x}
                  cy={source.y}
                  r={4}
                  fill={STATUS_COLOR[packet.status]}
                  initial={{ r: 4, opacity: 1 }}
                  animate={{ r: 220, opacity: 0 }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                />
              );
            }

            const xKeyframes = pathNodes.map((n) => n.x);
            const yKeyframes = pathNodes.map((n) => n.y);
            const color = STATUS_COLOR[packet.status] ?? STATUS_COLOR.traveling;

            return (
              <motion.circle
                key={packet.id}
                r={6}
                fill={color}
                initial={{ cx: xKeyframes[0], cy: yKeyframes[0] }}
                animate={
                  packet.status === 'collided'
                    ? {
                        cx: xKeyframes[0],
                        cy: yKeyframes[0],
                        scale: [1, 1.8, 0],
                        opacity: [1, 1, 0],
                      }
                    : { cx: xKeyframes, cy: yKeyframes }
                }
                transition={{
                  duration: packet.status === 'collided' ? 0.6 : 0.9,
                  ease: 'easeInOut',
                }}
              />
            );
          })}
        </AnimatePresence>

        {/* Nodes */}
        {nodes.map((node) => {
          const Icon = ROLE_ICON[node.role ?? 'host'];
          const isInvolved = packets.some(
            (p) => p.from === node.id || p.to === node.id || p.path.includes(node.id)
          );

          return (
            <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
              <motion.circle
                r={22}
                fill="var(--surface)"
                stroke={isInvolved ? 'var(--primary)' : 'var(--border)'}
                strokeWidth={isInvolved ? 2.5 : 1.5}
                animate={{ scale: isInvolved ? 1.08 : 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              />
              <foreignObject x={-11} y={-11} width={22} height={22}>
                <div className="text-foreground flex h-full w-full items-center justify-center">
                  <Icon className="size-4" />
                </div>
              </foreignObject>
              <text
                y={38}
                textAnchor="middle"
                className="fill-muted-foreground font-mono text-[10px]"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
