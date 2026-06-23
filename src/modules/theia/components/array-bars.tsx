'use client';

import { motion } from 'motion/react';
import type { ArrayStep } from '@/modules/theia/types/algorithm';
import { useTheme } from 'next-themes';

const STATUS_COLORS: Record<string, string> = {
  default: '#e4e4e7',
  comparing: '#f59e0b',
  swapping: '#ef4444',
  sorted: '#10b981',
  pivot: '#8b5cf6',
  active: '#0ea5e9',
};

export function ArrayBars({ step }: { step: ArrayStep }) {
  const max = Math.max(...step.array, 1);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <div
      style={{
        height: 288,
        position: 'relative',
        width: '100%',
        borderRadius: 12,
        border: `1px solid ${isDark ? '#27272a' : '#e4e4e7'}`,
        color: isDark ? '#71717a' : '#52525b',
        overflow: 'hidden',
        padding: '8px 12px 28px 12px',
        boxSizing: 'border-box',
      }}
    >
      {/* bars area */}
      <div
        style={{
          position: 'absolute',
          top: 8,
          left: 12,
          right: 12,
          bottom: 28,
          display: 'flex',
          alignItems: 'flex-end',
          gap: 3,
        }}
      >
        {step.array.map((value, idx) => {
          const color = STATUS_COLORS[step.highlights[idx] ?? 'default'];
          return (
            <motion.div
              key={idx}
              layout
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{
                flex: 1,
                height: `${(value / max) * 100}%`,
                backgroundColor: color,
                borderRadius: '8px 8px 2px 2px',
                minHeight: 4,
              }}
            />
          );
        })}
      </div>

      {/* labels row at bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 4,
          left: 12,
          right: 12,
          display: 'flex',
          gap: 3,
        }}
      >
        {step.array.map((value, idx) => (
          <div key={idx} style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#71717a' }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
