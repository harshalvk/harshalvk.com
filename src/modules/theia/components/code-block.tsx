'use client';

import { useEffect, useState } from 'react';
import { createHighlighter, type Highlighter } from 'shiki';

import { cn } from '@/lib/utils';
import { CopyButton } from '@/components/copy-button';
import { getIconForLanguageExtension } from '@/components/icons/icons';

export type CodeLang = 'ts' | 'go' | 'java' | 'cpp';

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['github-light', 'vesper'],
      langs: ['typescript', 'go', 'java', 'cpp'],
    });
  }
  return highlighterPromise;
}

const SHIKI_LANG_MAP: Record<CodeLang, string> = {
  ts: 'typescript',
  go: 'go',
  java: 'java',
  cpp: 'cpp',
};

const LANG_LABEL: Record<CodeLang, string> = {
  ts: 'TypeScript',
  go: 'Go',
  java: 'Java',
  cpp: 'C++',
};

export function CodeBlock({
  code,
  lang,
  activeLine,
  className,
}: {
  code: string;
  lang: CodeLang;
  activeLine?: number;
  className?: string;
}) {
  const [html, setHtml] = useState<string>('');

  useEffect(() => {
    let cancelled = false;

    getHighlighter().then((highlighter) => {
      if (cancelled) return;

      const out = highlighter.codeToHtml(code, {
        lang: SHIKI_LANG_MAP[lang],
        themes: { light: 'github-light', dark: 'vesper' },
        defaultColor: false,
        transformers: [
          {
            line(node, line) {
              node.properties['data-line'] = line;
              if (line === activeLine) {
                node.properties['data-highlighted-line'] = '';
              }
            },
            pre(node) {
              delete node.properties['style'];
            },
            code(node) {
              delete node.properties['style'];
            },
          },
        ],
      });

      setHtml(out);
    });

    return () => {
      cancelled = true;
    };
  }, [code, lang, activeLine]);

  const icon = getIconForLanguageExtension(lang);

  return (
    <div className={cn('relative', className)}>
      <div className="group/pre bg-code overflow-hidden rounded-[9px] border">
        <div
          data-rehype-pretty-code-title=""
          className={cn(
            'text-muted-foreground bg-surface [&_svg]:text-muted-foreground',
            'flex items-center gap-3 py-2.5 pr-8.5 pl-3 font-mono text-sm',
            '[&_svg]:size-4 [&_svg]:shrink-0',
            'border-b'
          )}
        >
          {icon}
          <span>{LANG_LABEL[lang]}</span>
        </div>

        {html ? (
          <div
            className={cn(
              '[&_pre]:no-scrollbar bg-surface [&_pre]:overflow-x-auto [&_pre]:overscroll-x-contain',
              '[&_pre]:py-4 [&_pre]:outline-none',
              '[&_code]:min-w-full [&_code]:font-mono [&_code]:text-sm',
              '[&_[data-line]]:pr-[var(--code-padding-right,0)] [&_[data-line]]:pl-4',
              '[--code-padding-right:6rem]',
              '[&_[data-line]_span]:text-[--shiki-light] dark:[&_[data-line]_span]:text-[--shiki-dark]',
              '[&_[data-highlighted-line]]:relative',
              '[&_[data-highlighted-line]]:after:bg-code-highlight',
              '[&_[data-highlighted-line]]:after:pointer-events-none',
              '[&_[data-highlighted-line]]:after:absolute',
              '[&_[data-highlighted-line]]:after:inset-0',
              '[&_[data-highlighted-line]]:after:z-[2]'
            )}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          // Skeleton while highlighter loads — same pre/code structure.
          <pre className="no-scrollbar overflow-x-auto py-4 pl-4 outline-none">
            <code className="text-muted-foreground/40 min-w-full font-mono text-sm">{code}</code>
          </pre>
        )}

        {/*
         * Copy button — mirrors mdx-code-block __withMeta__ branch
         * (we always have a title, so the button sits at top-1.5 right-1.5).
         */}
        <CopyButton
          data-slot="copy-button"
          className={cn(
            'text-muted-foreground absolute top-1.5 right-1.5 z-10 size-7 rounded-md border-none',
            "[&_svg:not([class*='size-'])]:size-4"
          )}
          variant="ghost"
          text={code}
        />
      </div>
    </div>
  );
}
