'use client';

import { cn } from '@/lib/utils';
import { ImageZoom } from './image-zoom';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';
import { useFigCounter } from './fig-counter';

export function YouTubeEmbed({ videoId, title }: { videoId: string; title: string }) {
  return (
    <div className="relative my-[1.25em]">
      <iframe
        className="aspect-video w-full rounded-xl"
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />

      <div className="pointer-events-none absolute inset-0 rounded-xl inset-ring-1 inset-ring-black/10 dark:inset-ring-white/10" />
    </div>
  );
}

export function IframeEmbed({ className, ...props }: React.ComponentProps<'iframe'>) {
  return (
    <div className="relative my-[1.25em]">
      <iframe className={cn('aspect-video w-full rounded-xl', className)} {...props} />

      <div className="pointer-events-none absolute inset-0 rounded-xl inset-ring-1 inset-ring-black/10 dark:inset-ring-white/10" />
    </div>
  );
}

export function FramedImage({
  canZoom = true,
  darkSrc,
  figName,
  className,
  alt,
  ...props
}: React.ComponentProps<'img'> & {
  canZoom?: boolean;
  darkSrc?: string;
  figName?: string | false;
}) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { next } = useFigCounter();
  const figNum = useRef<number | null>(null);
  if (figNum.current === null) {
    figNum.current = next();
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  const src = darkSrc && mounted && resolvedTheme === 'dark' ? darkSrc : (props.src as string);

  const caption: string | false =
    figName === false
      ? false
      : figName
        ? `Fig. ${figNum.current}: ${figName}`
        : `Fig. ${figNum.current}: ${cleanFilename(props.src as string)}`;

  const image = (
    <img
      {...props}
      src={src}
      alt={(alt ?? caption) || ''}
      className={cn('h-auto w-full', className)}
    />
  );

  return (
    <div className="relative">
      <figure className="bg-muted/20 relative w-full space-y-2 [&_img]:rounded-xl">
        {canZoom ? <ImageZoom>{image}</ImageZoom> : image}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-full rounded-xl inset-ring-1 inset-ring-black/10 dark:inset-ring-white/10" />
      </figure>
      {caption !== false && (
        <figcaption className="text-muted-foreground absolute inset-x-0 -bottom-7 text-center text-xs italic md:text-base">
          {caption}
        </figcaption>
      )}
    </div>
  );
}

function cleanFilename(src: string): string {
  const filename =
    src
      .split('/')
      .pop()
      ?.replace(/\.[^.]+$/, '') ?? '';
  return filename
    .replace(/[-_](dark|light)$/i, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}
