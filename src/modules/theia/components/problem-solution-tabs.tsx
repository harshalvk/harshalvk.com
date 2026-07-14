'use client';

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CodeBlock, type CodeLang } from './code-block';

const LANGUAGES: { value: CodeLang; label: string }[] = [
  { value: 'ts', label: 'TypeScript' },
  { value: 'go', label: 'Go' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
];

export function ProblemSolutionTabs({ code }: { code: Record<CodeLang, string> }) {
  const [lang, setLang] = useState<CodeLang>('ts');

  return (
    <div className="flex flex-col gap-2">
      <Tabs value={lang} onValueChange={(v) => setLang(v as CodeLang)}>
        <TabsList>
          {LANGUAGES.map((l) => (
            <TabsTrigger key={l.value} value={l.value} className="font-mono text-xs">
              {l.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <CodeBlock code={code[lang]} lang={lang} />
    </div>
  );
}
