'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useNetwork } from './network-context';
import type { Network } from '../wallet-adapter';

const NETWORKS: Network[] = ['mainnet', 'devnet', 'testnet', 'localhost'];

export function NetworkSwitcher() {
  const { network, setNetwork } = useNetwork();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="capitalize">
          {network}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {NETWORKS.map((n) => (
          <DropdownMenuItem key={n} onClick={() => setNetwork(n)} className="capitalize">
            {n}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
