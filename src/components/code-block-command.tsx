'use client';

import { useMemo } from 'react';

import type { NpmCommands } from '@/types/unist';
import type { PackageManager } from '@/hooks/usePackageManager';
import { usePackageManager } from '@/hooks/usePackageManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { getIconForPackageManager } from './icons/icons';
import { IconSwap, IconSwapItem } from './icon-swap';
import { CopyButton } from './copy-button';

export function CodeBlockCommand({ __pnpm__, __yarn__, __npm__, __bun__ }: NpmCommands) {
  const [packageManager, setPackageManager] = usePackageManager();

  const tabs = useMemo(() => {
    return {
      pnpm: __pnpm__,
      yarn: __yarn__,
      npm: __npm__,
      bun: __bun__,
    };
  }, [__pnpm__, __yarn__, __npm__, __bun__]);

  return (
    <div data-slot="code-block-command" className="relative">
      <Tabs
        className="gap-0"
        value={packageManager}
        onValueChange={(value) => {
          setPackageManager(value as PackageManager);
        }}
      >
        <div className="px-3">
          <TabsList className="[&_svg]:text-muted-foreground h-10 rounded-none bg-transparent p-0 inset-ring-0 dark:bg-transparent [&_svg]:size-4">
            <IconSwap>
              <IconSwapItem className="mr-2" key={packageManager}>
                {getIconForPackageManager(packageManager)}
              </IconSwapItem>
            </IconSwap>

            {Object.entries(tabs).map(([key]) => {
              return (
                <TabsTrigger key={key} className="h-7 rounded-lg p-0 px-2 font-mono" value={key}>
                  {key}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {Object.entries(tabs).map(([key, value]) => {
          return (
            <TabsContent key={key} value={key}>
              <div className="bg-background rounded-[9px] border">
                <pre className="overflow-x-auto overscroll-x-contain leading-5">
                  <code
                    data-slot="code-block"
                    data-language="bash"
                    data-line=""
                    className="text-muted-foreground font-mono text-sm/none"
                  >
                    {value}
                  </code>
                </pre>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>

      <CopyButton
        className="text-muted-foreground absolute top-1.5 right-0.5 z-10 size-7 rounded-md border-none [&_svg:not([class*='size-'])]:size-4"
        variant="ghost"
        text={tabs[packageManager] || ''}
      />
    </div>
  );
}
