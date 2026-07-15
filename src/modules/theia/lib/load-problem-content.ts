// src/modules/theia/lib/load-problem-content.ts
import fs from 'node:fs';
import path from 'node:path';
import type { CodeLang } from '@/modules/theia/components/code-block';

const CONTENT_ROOT = path.join(process.cwd(), 'src/modules/theia/content/problems');

const CODE_FILE_EXT: Record<CodeLang, string> = {
  ts: 'ts.txt',
  go: 'go.txt',
  java: 'java.txt',
  cpp: 'cpp.txt',
};

export type ProblemContent = {
  approach: string;
  code: Record<CodeLang, string>;
};

/**
 * Reads a problem's approach.md and all solution files from disk.
 *
 * Solution files are stored with a `.txt` suffix (e.g. `solution.go.txt`)
 * rather than their real extension (`.go`, `.java`, `.cpp`) so that
 * language-specific VSCode extensions (Go, Java, C/C++) don't try to
 * lint/type-check them as if they belonged to a real project in that
 * language — this repo is TypeScript-only and these files are just
 * reference snippets rendered as code blocks, not compiled anywhere.
 *
 * Server-only — relies on `fs`, so this must never be imported into
 * a 'use client' component. Only call it from server components
 * (e.g. the problem detail page) or generateStaticParams/generateMetadata.
 */
export function loadProblemContent(slug: string): ProblemContent {
  const dir = path.join(CONTENT_ROOT, slug);

  const approachPath = path.join(dir, 'approach.md');
  const approach = fs.existsSync(approachPath) ? fs.readFileSync(approachPath, 'utf-8') : '';

  const code = Object.entries(CODE_FILE_EXT).reduce(
    (acc, [lang, ext]) => {
      const filePath = path.join(dir, 'solutions', `solution.${ext}`);
      acc[lang as CodeLang] = fs.existsSync(filePath)
        ? fs.readFileSync(filePath, 'utf-8').trimEnd()
        : '';
      return acc;
    },
    {} as Record<CodeLang, string>
  );

  return { approach, code };
}
