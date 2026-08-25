'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { ChevronUp, List } from 'lucide-react';

export type TocItem = {
  id: string;
  title: string;
  depth: number;
};

function useActiveHeading(items: TocItem[]) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? '');

  useEffect(() => {
    if (items.length === 0) return;
    setActiveId(items[0].id);

    const headingElements = items
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    );

    headingElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  return activeId;
}

function DesktopToc({ items }: { items: TocItem[] }) {
  const activeId = useActiveHeading(items);
  const listRef = useRef<HTMLUListElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ top: 0, height: 0 });

  useEffect(() => {
    if (!listRef.current || !activeId) return;
    const activeEl = listRef.current.querySelector<HTMLElement>(`[data-id="${activeId}"]`);
    if (!activeEl) return;
    setIndicatorStyle({
      top: activeEl.offsetTop,
      height: activeEl.offsetHeight,
    });
  }, [activeId]);

  const handleClick = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav
      className="fixed hidden xl:block"
      style={{
        top: '10rem',
        left: 'calc(50% + 512px + 24px)',
        width: '200px',
        maxHeight: 'calc(100vh - 10rem - 24px)',
        overflowY: 'auto',
        scrollbarWidth: 'none',
      }}
    >
      <p className="text-foreground mb-3 font-mono text-xs font-medium tracking-widest uppercase">
        table of content
      </p>

      <div className="relative pl-0.5">
        <div className="bg-border absolute top-0 left-0 h-full w-px" />

        <motion.div
          className="bg-foreground absolute left-0 w-px"
          animate={{
            top: indicatorStyle.top,
            height: indicatorStyle.height,
          }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
        <ul className="space-y-0.5 pl-4" ref={listRef}>
          {items.map((item) => {
            const isActive = activeId === item.id;
            return (
              <li
                key={item.id}
                style={{ paddingLeft: `${(item.depth - 1) * 10}px` }}
                className="relative"
              >
                {isActive && (
                  <motion.span
                    layoutId="toc-active-dot"
                    className="bg-foreground absolute top-1/2 -left-[19px] h-3 w-0.5 -translate-y-1/2 rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <button
                  onClick={() => handleClick(item.id)}
                  className={cn(
                    'w-full rounded-sm py-1 text-left text-sm transition-colors duration-150',
                    isActive
                      ? 'text-foreground font-medium'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {item.title}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

// ── Mobile TOC ────────────────────────────────────────────────────────────────

function MobileToc({ items }: { items: TocItem[] }) {
  const activeId = useActiveHeading(items);
  const [open, setOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const activeItem = items.find((item) => item.id === activeId) ?? items[0];

  const handleClick = (id: string) => {
    setOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  };

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        sheetRef.current?.contains(e.target as Node) ||
        triggerRef.current?.contains(e.target as Node)
      )
        return;
      setOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-xs xl:hidden"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Bottom sheet + trigger — centered, never shifts */}
      <div className="fixed right-0 bottom-6 left-0 z-[70] flex flex-col items-center xl:hidden">
        {/* Sheet — slides up from trigger */}
        <AnimatePresence>
          {open && (
            <motion.div
              ref={sheetRef}
              key="sheet"
              initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom center' }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="bg-background/95 border-border z-[70] mb-3 w-[min(calc(100vw-2rem),340px)] overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-md"
              style={{ transformOrigin: 'bottom center' }}
            >
              <div className="border-border border-b px-4 py-3">
                <p className="text-muted-foreground font-mono text-[0.6rem] font-bold tracking-widest uppercase">
                  table of content
                </p>
              </div>

              <ul className="max-h-[50vh] overflow-y-auto p-2" style={{ scrollbarWidth: 'none' }}>
                {items.map((item, i) => {
                  const isActive = activeId === item.id;
                  return (
                    <motion.li
                      key={item.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.02, duration: 0.2 }}
                      style={{ paddingLeft: `${(item.depth - 1) * 12}px` }}
                    >
                      <button
                        onClick={() => handleClick(item.id)}
                        className={cn(
                          'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-all duration-150',
                          isActive
                            ? 'bg-foreground/8 text-foreground font-medium'
                            : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground'
                        )}
                      >
                        <motion.span
                          animate={{
                            width: isActive ? 6 : 0,
                            opacity: isActive ? 1 : 0,
                          }}
                          transition={{ duration: 0.15 }}
                          className="bg-foreground inline-block h-1.5 shrink-0 rounded-full"
                        />
                        {item.title}
                      </button>
                    </motion.li>
                  );
                })}
              </ul>
            </motion.div>
          )}
          r{' '}
        </AnimatePresence>

        <motion.button
          ref={triggerRef}
          onClick={() => setOpen((o) => !o)}
          className="bg-background/90 border-border flex w-64 items-center gap-2 rounded-full border px-4 py-2.5 shadow-xl backdrop-blur-xs"
          whileTap={{ scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <List className="text-muted-foreground size-3.5 shrink-0" />
          <span className="relative flex-1 overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={activeItem?.id ?? 'default'}
                initial={{ y: 4, opacity: 0, filter: 'blur(2px)' }}
                animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                exit={{ y: -4, opacity: 0, filter: 'blur(2px)' }}
                transition={{ duration: 0.15 }}
                className="text-foreground block truncate text-left text-sm font-medium"
              >
                {activeItem?.title ?? 'Contents'}
              </motion.span>
            </AnimatePresence>
          </span>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <ChevronUp className="text-muted-foreground size-3.5 shrink-0" />
          </motion.span>
        </motion.button>
      </div>
    </>
  );
}

// ── Export ────────────────────────────────────────────────────────────────────

export function TableOfContents({ items }: { items: TocItem[] }) {
  if (!items.length) return null;

  return (
    <>
      <DesktopToc items={items} />
      <MobileToc items={items} />
    </>
  );
}
