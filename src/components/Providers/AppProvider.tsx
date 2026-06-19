'use client';

import React from 'react';
import { ThemeProvider } from '@/components/Providers/ThemeProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { KeyboardShortcuts } from '@/components/keyboard-shortcuts';
import { ProgressProvider } from '@bprogress/next/app';
import { TooltipProvider } from '../ui/tooltip';
import { WalletContextProvider } from '@/registry/transformed/components/wallet-adapter';

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
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
              <WalletContextProvider network="devnet" autoConnect={true}>
                {children}
              </WalletContextProvider>
              <KeyboardShortcuts />
            </ProgressProvider>
          </ThemeProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </>
  );
};

export default AppProvider;
