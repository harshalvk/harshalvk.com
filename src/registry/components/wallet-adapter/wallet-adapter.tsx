'use client';

import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import { Loader2, Wallet } from 'lucide-react';
import { WalletName, WalletReadyState } from '@solana/wallet-adapter-base';
import { useCallback, useRef, useState } from 'react';

/**
 * Supported Solana networks.
 */
export type Network = 'mainnet' | 'devnet' | 'testnet' | 'localhost';

/**
 * Props for the WalletContextProvider component.
 */
export interface WalletProviderProps {
  /**
   * Components that should have access
   * to Solana wallet context.
   */
  children: React.ReactNode;

  /**
   * Solana cluster to connect to.
   *
   * @default "devnet"
   */
  network?: Network;

  /**
   * Automatically reconnect to previously
   * connected wallets when available.
   *
   * @default true
   */
  autoConnect?: boolean;
}

/**
 * Props for the WalletAdapter button component.
 */
export interface WalletButtonProps {
  /**
   * Additional classes applied to the trigger button.
   */
  className?: string;
}

export function WalletAdapter({ className }: WalletButtonProps) {
  const { select, connect, wallets, publicKey, disconnect, connecting } = useWallet();

  const [open, setOpen] = useState(false);
  const [connectingWallet, setConnectingWallet] = useState<WalletName | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Guards against overlapping connect attempts when the user rapidly
  // switches wallets (e.g. picks MetaMask, then immediately picks Phantom
  // before the first connect() call has settled).
  const connectTokenRef = useRef(0);

  const handleWalletSelect = useCallback(
    async (walletName: WalletName) => {
      const token = ++connectTokenRef.current;

      setError(null);
      setOpen(false);
      setConnectingWallet(walletName);

      try {
        // select() and connect() are called directly in the click handler
        // (instead of via a useEffect watching `wallet`) so we connect the
        // wallet that was actually clicked, not whatever `wallet` happens
        // to be on a later, possibly stale render.
        select(walletName);
        await connect();
      } catch (err) {
        // Ignore results from a stale/cancelled attempt (user switched
        // wallets mid-flight) so we don't show an error for a wallet
        // they're no longer trying to connect to.
        if (connectTokenRef.current !== token) return;

        const message =
          err instanceof Error ? err.message : 'Failed to connect wallet. Please try again.';
        setError(message);
      } finally {
        if (connectTokenRef.current === token) {
          setConnectingWallet(null);
        }
      }
    },
    [select, connect]
  );

  const handleDisconnect = useCallback(async () => {
    try {
      await disconnect();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to disconnect wallet.';
      setError(message);
    }
  }, [disconnect]);

  const isConnecting = connecting || connectingWallet !== null;

  return (
    <div>
      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (next) setError(null);
        }}
      >
        <div>
          {!publicKey ? (
            <DialogTrigger asChild>
              <Button
                aria-label="Connect Wallet"
                variant={'secondary'}
                className={`w-full border ${className ?? ''}`}
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <span className="flex items-center gap-1">
                    <Loader2 className="animate-spin" />
                    Connecting..
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Wallet />
                    Connect Wallet
                  </span>
                )}
              </Button>
            </DialogTrigger>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full">
                <p
                  className={buttonVariants({
                    variant: 'outline',
                  })}
                >
                  <span className="max-w-[140px] truncate select-none">{publicKey.toBase58()}</span>
                </p>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="center"
                className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-0 p-0"
              >
                <DropdownMenuItem asChild>
                  <Button onClick={handleDisconnect} className="w-full" variant={'ghost'}>
                    Disconnect
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <DialogContent className="max-w-[450px]">
            <DialogHeader>
              <DialogTitle>Select Wallet</DialogTitle>
              <DialogDescription>
                Below is the list of wallets available in your browser.
              </DialogDescription>
            </DialogHeader>
            <div className="w-full">
              {error && (
                <p className="border-destructive/50 bg-destructive/10 text-destructive mb-3 rounded-md border px-3 py-2 text-sm">
                  {error}
                </p>
              )}
              {wallets.length === 0 && (
                <p className="text-muted-foreground py-4 text-center text-sm">
                  No wallets found. Install a Solana wallet extension to continue.
                </p>
              )}
              {wallets.map((wallet) => {
                const isThisWalletConnecting = connectingWallet === wallet.adapter.name;
                const notReady = wallet.readyState === WalletReadyState.Unsupported;

                return (
                  <Button
                    key={wallet.adapter.name}
                    onClick={() => handleWalletSelect(wallet.adapter.name)}
                    variant={'ghost'}
                    disabled={isConnecting || notReady}
                    className="w-full px-0 ring-zinc-200 hover:ring-1 dark:ring-zinc-800"
                  >
                    <div className="flex w-full items-center justify-between p-2">
                      <div className="flex items-center">
                        <Image
                          src={wallet.adapter.icon}
                          alt={wallet.adapter.name}
                          height={19}
                          width={19}
                        />
                        <div className="font-slackey wallet-name ml-2 md:text-lg">
                          {wallet.adapter.name}
                        </div>
                      </div>
                      {isThisWalletConnecting ? (
                        <Loader2 className="mr-2 animate-spin" size={16} />
                      ) : wallet.readyState === WalletReadyState.Installed ? (
                        <span className="text-muted-foreground mr-2 text-xs">Detected</span>
                      ) : null}
                    </div>
                  </Button>
                );
              })}
            </div>
          </DialogContent>
        </div>
      </Dialog>
    </div>
  );
}

const NETWORK_URLS: Record<Network, string> = {
  mainnet: 'https://api.mainnet-beta.solana.com',
  devnet: 'https://api.devnet.solana.com',
  testnet: 'https://api.testnet.solana.com',
  localhost: 'http://localhost:8899',
};

export function WalletContextProvider({
  children,
  network = 'devnet',
  autoConnect = true,
}: WalletProviderProps) {
  const endpoint = NETWORK_URLS[network];

  return (
    <ConnectionProvider endpoint={endpoint}>
      {/* Pass an empty array: wallets that implement the Wallet Standard
          (Phantom, MetaMask Snaps, Backpack, Solflare, etc.) are
          auto-detected at runtime and do not need to be listed here.
          Only add legacy, non-Wallet-Standard adapters to this array. */}
      <WalletProvider wallets={[]} autoConnect={autoConnect}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
