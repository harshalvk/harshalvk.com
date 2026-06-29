'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { useHotkeys } from 'react-hotkeys-hook';
import { useWebHaptics } from 'web-haptics/react';

const SUN_RAYS = [
  { x1: '12', y1: '2', x2: '12', y2: '4' },
  { x1: '12', y1: '20', x2: '12', y2: '22' },
  { x1: '4.93', y1: '4.93', x2: '6.34', y2: '6.34' },
  { x1: '17.66', y1: '17.66', x2: '19.07', y2: '19.07' },
  { x1: '2', y1: '12', x2: '4', y2: '12' },
  { x1: '20', y1: '12', x2: '22', y2: '12' },
  { x1: '6.34', y1: '17.66', x2: '4.93', y2: '19.07' },
  { x1: '19.07', y1: '4.93', x2: '17.66', y2: '6.34' },
];

export function ModeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  const { trigger: haptic } = useWebHaptics();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const current = resolvedTheme || theme;
    haptic('success');
    setTheme(current === 'dark' ? 'light' : 'dark');
  };

  const switchTheme = (e: KeyboardEvent) => {
    if (e.repeat) return;
    e.preventDefault();
    toggleTheme();
  };

  useHotkeys('d', (e) => switchTheme(e));

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" aria-label="Toggle theme">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          {SUN_RAYS.map((r, i) => (
            <line key={i} {...r} />
          ))}
        </svg>
      </Button>
    );
  }

  const isDark = (resolvedTheme || theme) === 'dark';

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ overflow: 'visible' }}
      >
        <motion.circle
          cx="12"
          cy="12"
          animate={{ r: isDark ? 0 : 4 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />

        {SUN_RAYS.map((ray, i) => (
          <motion.line
            key={i}
            {...ray}
            animate={{ pathLength: isDark ? 0 : 1, opacity: isDark ? 0 : 1 }}
            transition={{
              duration: 0.2,
              ease: 'easeInOut',
              delay: isDark ? 0 : i * 0.025,
            }}
          />
        ))}

        <motion.path
          d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"
          animate={{ pathLength: isDark ? 1 : 0, opacity: isDark ? 1 : 0 }}
          transition={{
            duration: 0.4,
            ease: 'easeInOut',
            delay: isDark ? 0.2 : 0,
          }}
        />

        <motion.line
          x1="18"
          y1="5"
          x2="22"
          y2="5"
          animate={{ pathLength: isDark ? 1 : 0, opacity: isDark ? 1 : 0 }}
          transition={{
            duration: 0.2,
            ease: 'easeInOut',
            delay: isDark ? 0.45 : 0,
          }}
        />

        <motion.line
          x1="20"
          y1="3"
          x2="20"
          y2="7"
          animate={{ pathLength: isDark ? 1 : 0, opacity: isDark ? 1 : 0 }}
          transition={{
            duration: 0.2,
            ease: 'easeInOut',
            delay: isDark ? 0.5 : 0,
          }}
        />
      </svg>

      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
