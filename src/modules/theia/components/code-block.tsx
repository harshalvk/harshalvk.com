'use client';

import { useEffect, useState } from 'react';
import { createHighlighter, type Highlighter } from 'shiki';
import { useTheme } from 'next-themes';

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['vesper', 'github-light'],
      langs: ['typescript', 'go', 'java'],
    });
  }
  return highlighterPromise;
}

const LANG_MAP = { ts: 'typescript', go: 'go', java: 'java', cpp: 'cpp' } as const;

export function CodeBlock({
  code,
  lang,
  activeLine,
}: {
  code: string;
  lang: 'ts' | 'go' | 'java' | 'cpp';
  activeLine?: number;
}) {
  const { resolvedTheme } = useTheme();
  const [html, setHtml] = useState<string>('');

  useEffect(() => {
    let cancelled = false;

    getHighlighter().then((highlighter) => {
      if (cancelled) return;

      const out = highlighter.codeToHtml(code, {
        lang: LANG_MAP[lang],
        theme: resolvedTheme === 'dark' ? 'vesper' : 'github-light',
        transformers: [
          {
            line(node, line) {
              if (line === activeLine) {
                this.addClassToHast(node, 'code-active-line');
              }
            },
          },
        ],
      });

      setHtml(out);
    });

    return () => {
      cancelled = true;
    };
  }, [code, lang, resolvedTheme, activeLine]);

  return (
    <div className="[&_pre]:no-scrollbar bg-code relative overflow-hidden rounded-xl border [&_pre]:overflow-x-auto [&_pre]:p-4 [&_pre]:text-sm [&_pre]:leading-6">
      <style jsx global>{`
        .code-active-line {
          display: inline-block;
          width: 100%;
          background: var(--code-highlight);
          margin-inline: -1rem;
          padding-inline: 1rem;
        }
      `}</style>
      {html ? (
        <div dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <pre className="text-muted-foreground rounded-xl p-4">{code}</pre>
      )}
    </div>
  );
}
