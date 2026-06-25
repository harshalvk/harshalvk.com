'use client';

import { ExternalLink } from 'lucide-react';
import type { Network } from '../wallet-adapter';

const EXPLORER_BASE: Record<Network, string> = {
  mainnet: 'https://solscan.io/account',
  devnet: 'https://solscan.io/account',
  testnet: 'https://solscan.io/account',
  localhost: 'https://explorer.solana.com/address',
};

const CLUSTER_QUERY: Record<Network, string> = {
  mainnet: '',
  devnet: '?cluster=devnet',
  testnet: '?cluster=testnet',
  localhost: '?cluster=custom&customUrl=http://localhost:8899',
};

export function ExplorerLink({ address, network }: { address: string; network: Network }) {
  const url = `${EXPLORER_BASE[network]}/${address}${CLUSTER_QUERY[network]}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-muted-foreground flex items-center gap-1 text-xs hover:underline"
    >
      View on Explorer
      <ExternalLink size={12} />
    </a>
  );
}
