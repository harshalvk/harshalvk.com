'use client';

import * as React from 'react';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MasonryImage {
  src: string;
  alt?: string;
  /** Natural width hint — skips waiting for onLoad if provided */
  width?: number;
  /** Natural height hint — skips waiting for onLoad if provided */
  height?: number;
  /** Arbitrary metadata you want back in callbacks */
  id?: string | number;
}

export interface MasonryFeedProps {
  images: MasonryImage[];
  /** Number of columns */
  columns?: number;
  /** Gap between items in px */
  gap?: number;
  /** Border radius on each image card in px */
  radius?: number;
  /**
   * Opens a fullscreen lightbox when an image is clicked.
   * Required to be true for `carousel` to have any effect.
   */
  lightbox?: boolean;
  /**
   * Enables prev/next navigation inside the lightbox.
   * Only works when `lightbox` is true.
   */
  carousel?: boolean;
  /** Called when an image is clicked (fires before lightbox opens) */
  onImageClick?: (image: MasonryImage, index: number) => void;
  /** Overlay element rendered on hover over each image */
  renderOverlay?: (image: MasonryImage, index: number) => React.ReactNode;
  /** Shown while images are still measuring */
  loadingPlaceholder?: React.ReactNode;
  className?: string;
}

// ─── Layout engine ────────────────────────────────────────────────────────────

interface LayoutItem {
  image: MasonryImage;
  index: number;
  top: number;
  left: number;
  width: number;
  height: number;
}

function computeLayout(
  images: MasonryImage[],
  containerWidth: number,
  columns: number,
  gap: number,
  ratios: Record<string, number>
): { items: LayoutItem[]; totalHeight: number } {
  if (containerWidth === 0 || images.length === 0) {
    return { items: [], totalHeight: 0 };
  }

  const colWidth = (containerWidth - gap * (columns - 1)) / columns;
  const colHeights = new Array<number>(columns).fill(0);
  const items: LayoutItem[] = [];

  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    const ratio = ratios[img.src];
    if (ratio === undefined) continue;

    let shortestCol = 0;
    let shortestHeight = colHeights[0];
    for (let c = 1; c < columns; c++) {
      if (colHeights[c] < shortestHeight) {
        shortestHeight = colHeights[c];
        shortestCol = c;
      }
    }

    const top =
      colHeights[shortestCol] === 0 ? colHeights[shortestCol] : colHeights[shortestCol] + gap;
    const left = shortestCol * (colWidth + gap);
    const height = colWidth * ratio;

    items.push({ image: img, index: i, top, left, width: colWidth, height });
    colHeights[shortestCol] = top + height;
  }

  return { items, totalHeight: Math.max(...colHeights) };
}

// ─── Invisible probe ──────────────────────────────────────────────────────────

function ImageProbe({
  src,
  onMeasured,
}: {
  src: string;
  onMeasured: (src: string, ratio: number) => void;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      aria-hidden
      onLoad={(e) => {
        const el = e.currentTarget;
        if (el.naturalWidth > 0) onMeasured(src, el.naturalHeight / el.naturalWidth);
      }}
      style={{
        position: 'absolute',
        width: 1,
        height: 1,
        opacity: 0,
        pointerEvents: 'none',
        visibility: 'hidden',
      }}
    />
  );
}

// ─── Masonry card ─────────────────────────────────────────────────────────────

function MasonryCard({
  item,
  radius,
  onClick,
  renderOverlay,
}: {
  item: LayoutItem;
  radius: number;
  onClick?: () => void;
  renderOverlay?: (image: MasonryImage, index: number) => React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.35,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: Math.min(item.index * 0.04, 0.6),
      }}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'absolute',
        top: item.top,
        left: item.left,
        width: item.width,
        height: item.height,
        borderRadius: radius,
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'top 0.3s ease, left 0.3s ease, width 0.3s ease, height 0.3s ease',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.image.src}
        alt={item.image.alt ?? ''}
        draggable={false}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          userSelect: 'none',
        }}
      />

      {renderOverlay && (
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.18 }}
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: hovered ? 'auto' : 'none',
          }}
        >
          {renderOverlay(item.image, item.index)}
        </motion.div>
      )}
    </motion.div>
  );
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────

const DIRECTIONS = { left: -1, right: 1 } as const;

function Lightbox({
  images,
  activeIndex,
  carousel,
  onClose,
  onNavigate,
}: {
  images: MasonryImage[];
  activeIndex: number;
  carousel: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const [direction, setDirection] = useState<1 | -1>(1);
  const [currentIndex, setCurrentIndex] = useState(activeIndex);

  const navigate = useCallback(
    (dir: keyof typeof DIRECTIONS) => {
      const d = DIRECTIONS[dir];
      const next =
        dir === 'left'
          ? (currentIndex - 1 + images.length) % images.length
          : (currentIndex + 1) % images.length;
      setDirection(d);
      setCurrentIndex(next);
      onNavigate(next);
    },
    [currentIndex, images.length, onNavigate]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (!carousel) return;
      if (e.key === 'ArrowLeft') navigate('left');
      if (e.key === 'ArrowRight') navigate('right');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [carousel, navigate, onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const image = images[currentIndex];

  const variants = {
    enter: (d: number) => ({ x: d * 60, opacity: 0, scale: 0.97 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (d: number) => ({ x: d * -60, opacity: 0, scale: 0.97 }),
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
        aria-label="Close lightbox"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Counter */}
      {carousel && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 font-mono text-xs tracking-widest text-white/60 uppercase select-none">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Prev */}
      {carousel && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate('left');
          }}
          className="absolute left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}

      {/* Image */}
      <AnimatePresence mode="popLayout" custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-h-[90vh] max-w-[90vw]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.src}
            alt={image.alt ?? ''}
            className="block max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
            draggable={false}
          />
          {image.alt && (
            <p className="absolute right-0 bottom-0 left-0 rounded-b-lg bg-black/40 px-4 py-2 text-center font-mono text-xs tracking-widest text-white/70 uppercase backdrop-blur-sm">
              {image.alt}
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Next */}
      {carousel && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate('right');
          }}
          className="absolute right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          aria-label="Next image"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}

      {/* Dot indicators — only show when image count is manageable */}
      {carousel && images.length <= 20 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                setDirection(i > currentIndex ? 1 : -1);
                setCurrentIndex(i);
                onNavigate(i);
              }}
              aria-label={`Go to image ${i + 1}`}
              className="h-1.5 rounded-full transition-all duration-200"
              style={{
                width: i === currentIndex ? 20 : 6,
                background: i === currentIndex ? 'white' : 'rgba(255,255,255,0.35)',
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function MasonryFeed({
  images,
  columns = 3,
  gap = 12,
  radius = 12,
  lightbox = false,
  carousel = false,
  onImageClick,
  renderOverlay,
  loadingPlaceholder,
  className,
}: MasonryFeedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Enforce: carousel only works when lightbox is enabled
  const carouselEnabled = lightbox && carousel;

  const [ratios, setRatios] = useState<Record<string, number>>(() => {
    const seed: Record<string, number> = {};
    for (const img of images) {
      if (img.width && img.height && img.width > 0) {
        seed[img.src] = img.height / img.width;
      }
    }
    return seed;
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    ro.observe(el);
    setContainerWidth(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);

  const handleMeasured = useCallback((src: string, ratio: number) => {
    setRatios((prev) => {
      if (prev[src] === ratio) return prev;
      return { ...prev, [src]: ratio };
    });
  }, []);

  const unknownSrcs = useMemo(
    () => images.filter((img) => ratios[img.src] === undefined).map((img) => img.src),
    [images, ratios]
  );

  const { items, totalHeight } = useMemo(
    () => computeLayout(images, containerWidth, columns, gap, ratios),
    [images, containerWidth, columns, gap, ratios]
  );

  const hasItems = items.length > 0;

  const handleCardClick = useCallback(
    (image: MasonryImage, index: number) => {
      onImageClick?.(image, index);
      if (lightbox) setLightboxIndex(index);
    },
    [lightbox, onImageClick]
  );

  return (
    <>
      <div ref={containerRef} className={cn('w-full', className)}>
        {unknownSrcs.map((src) => (
          <ImageProbe key={src} src={src} onMeasured={handleMeasured} />
        ))}

        {!hasItems && unknownSrcs.length > 0 && (
          <div>
            {loadingPlaceholder ?? (
              <div className="text-muted-foreground flex items-center justify-center py-16 font-mono text-xs tracking-widest uppercase">
                loading…
              </div>
            )}
          </div>
        )}

        {hasItems && (
          <div style={{ position: 'relative', width: '100%', height: totalHeight }}>
            {items.map((item) => (
              <MasonryCard
                key={`${item.image.src}-${item.index}`}
                item={item}
                radius={radius}
                onClick={() => handleCardClick(item.image, item.index)}
                renderOverlay={renderOverlay}
              />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {lightbox && lightboxIndex !== null && (
          <Lightbox
            images={images}
            activeIndex={lightboxIndex}
            carousel={carouselEnabled}
            onClose={() => setLightboxIndex(null)}
            onNavigate={setLightboxIndex}
          />
        )}
      </AnimatePresence>
    </>
  );
}
