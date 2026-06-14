'use client';

import React from 'react';
import { ThemeProvider } from '@/components/Providers/ThemeProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { KeyboardShortcuts } from '@/components/keyboard-shortcuts';
import { ProgressProvider } from '@bprogress/next/app';

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute={'class'}
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ProgressProvider
            color="var(--foreground)"
            height="2px"
            delay={500}
            options={{ showSpinner: false }}
          >
            <Toaster />
            {children}
            <KeyboardShortcuts />
          </ProgressProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
};

export default AppProvider;
