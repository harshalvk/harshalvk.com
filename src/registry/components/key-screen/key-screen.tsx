'use client';

import * as React from 'react';
import { useEffect, useRef, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@/lib/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface KeyDisplayProps {
  /** How long (ms) a key stays visible after release */
  fadeDelay?: number;
  /** Max number of key combos shown in history */
  historySize?: number;
  /** Where on screen to anchor the display */
  position?: 'bottom-left' | 'bottom-right' | 'bottom-center' | 'top-left' | 'top-right';
  /** Show modifier names in full (e.g. "Control" vs "Ctrl") */
  verbose?: boolean;
  /** Extra class names on the container */
  className?: string;
}

interface KeyCombo {
  id: string;
  keys: string[];
  timestamp: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const MODIFIER_MAP: Record<string, string> = {
  Control: 'Ctrl',
  Meta: '⌘',
  Alt: 'Alt',
  Shift: 'Shift',
};

const SPECIAL_KEY_MAP: Record<string, string> = {
  ' ': 'Space',
  ArrowUp: '↑',
  ArrowDown: '↓',
  ArrowLeft: '←',
  ArrowRight: '→',
  Enter: '↵',
  Backspace: '⌫',
  Delete: 'Del',
  Escape: 'Esc',
  Tab: 'Tab',
  CapsLock: 'Caps',
  PageUp: 'PgUp',
  PageDown: 'PgDn',
  Home: 'Home',
  End: 'End',
  Insert: 'Ins',
  PrintScreen: 'PrtSc',
  ScrollLock: 'ScrlLk',
  Pause: 'Pause',
  ContextMenu: 'Menu',
};

const MODIFIER_KEYS = new Set(['Control', 'Shift', 'Alt', 'Meta']);

function normalizeKey(key: string, verbose: boolean): string {
  if (SPECIAL_KEY_MAP[key]) return SPECIAL_KEY_MAP[key];
  if (MODIFIER_MAP[key]) return verbose ? key : MODIFIER_MAP[key];
  if (key.startsWith('F') && !isNaN(Number(key.slice(1)))) return key;
  return key.toUpperCase();
}

function buildCombo(pressedSet: Set<string>, verbose: boolean): string[] {
  const modifierOrder = ['Control', 'Alt', 'Shift', 'Meta'];
  const mods = modifierOrder.filter((m) => pressedSet.has(m));
  const regular = [...pressedSet].filter((k) => !MODIFIER_KEYS.has(k));

  return [...mods, ...regular].map((k) => normalizeKey(k, verbose));
}

const POSITION_CLASSES: Record<NonNullable<KeyDisplayProps['position']>, string> = {
  'bottom-left': 'bottom-6 left-6 items-start',
  'bottom-right': 'bottom-6 right-6 items-end',
  'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2 items-center',
  'top-left': 'top-6 left-6 items-start',
  'top-right': 'top-6 right-6 items-end',
};

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    setIsDesktop(window.matchMedia('(pointer: fine)').matches);
  }, []);
  return isDesktop;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function KeyCap({ label }: { label: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center',
        'h-8 min-w-[2rem] px-2',
        'border-border/60 rounded-sm border',
        'bg-card text-card-foreground',
        'font-mono text-xs font-semibold tracking-widest uppercase',
        // structural shadow — top highlight + bottom depth
        'shadow-[inset_0_1px_0_0_hsl(var(--border)/0.3),0_2px_0_0_hsl(var(--border)/0.5)]',
        'select-none'
      )}
    >
      {label}
    </span>
  );
}

function ComboRow({ combo, isCurrent }: { combo: KeyCombo; isCurrent: boolean }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: isCurrent ? 1 : 0.35, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.94, transition: { duration: 0.15 } }}
      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
      className="flex items-center gap-1.5"
    >
      {combo.keys.map((key, i) => (
        <React.Fragment key={i}>
          {i > 0 && (
            <span className="text-muted-foreground font-mono text-[10px] select-none">+</span>
          )}
          <KeyCap label={key} />
        </React.Fragment>
      ))}
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function KeyScreen({
  fadeDelay = 1800,
  historySize = 3,
  position = 'bottom-left',
  verbose = false,
  className,
}: KeyDisplayProps) {
  const [history, setHistory] = useState<KeyCombo[]>([]);
  const pressedRef = useRef<Set<string>>(new Set());
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentIdRef = useRef<string | null>(null);

  const isDesktop = useIsDesktop();

  const scheduleRemove = useCallback(
    (id: string) => {
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
      fadeTimerRef.current = setTimeout(() => {
        setHistory((prev) => prev.filter((c) => c.id !== id));
      }, fadeDelay);
    },
    [fadeDelay]
  );

  const pushCombo = useCallback(
    (keys: string[]) => {
      if (keys.length === 0) return;
      const id = `${Date.now()}-${Math.random()}`;
      currentIdRef.current = id;
      setHistory((prev) => {
        const next = [...prev, { id, keys, timestamp: Date.now() }];
        return next.slice(-historySize);
      });
      scheduleRemove(id);
    },
    [historySize, scheduleRemove]
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Ignore pure modifier-only presses until a regular key joins
      pressedRef.current.add(e.key);

      if (!MODIFIER_KEYS.has(e.key)) {
        // We have at least one non-modifier key — emit the combo
        const keys = buildCombo(pressedRef.current, verbose);
        pushCombo(keys);
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      pressedRef.current.delete(e.key);
    };

    const onBlur = () => {
      pressedRef.current.clear();
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    };
  }, [pushCombo, verbose]);

  const posClass = POSITION_CLASSES[position];

  if (!isDesktop) return null;

  return (
    <div
      className={cn('pointer-events-none fixed z-50 flex flex-col gap-2', posClass, className)}
      aria-live="polite"
      aria-label="Key display"
    >
      <AnimatePresence mode="popLayout">
        {history.map((combo, i) => (
          <ComboRow key={combo.id} combo={combo} isCurrent={i === history.length - 1} />
        ))}
      </AnimatePresence>
    </div>
  );
}
