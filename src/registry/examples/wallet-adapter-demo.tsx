'use client';

import {
  WalletAdapter,
  WalletContextProvider,
} from '@/registry/components/wallet-adapter/wallet-adapter';

export default function WalletAdapterDemo() {
  return (
    <WalletContextProvider network="devnet">
      <WalletAdapter />
    </WalletContextProvider>
  );
}
