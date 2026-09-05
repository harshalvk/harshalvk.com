'use client';

import React, { useMemo } from 'react';
import { ThemeProvider } from '@/components/Providers/ThemeProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { KeyboardShortcuts } from '@/components/keyboard-shortcuts';
import { ProgressProvider } from '@bprogress/next/app';
import { TooltipProvider } from '../ui/tooltip';

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      }),
    []
  );

  return (
    <>
      <ProgressProvider
        color="var(--foreground)"
        height="2px"
        delay={500}
        options={{ showSpinner: false }}
      >
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <ThemeProvider
              attribute={'class'}
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Toaster />
              {children}
              <KeyboardShortcuts />
            </ThemeProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </ProgressProvider>
    </>
  );
};

export default AppProvider;
