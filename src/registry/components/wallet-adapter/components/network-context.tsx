'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import type { Network } from '../wallet-adapter';

interface NetworkContextValue {
  network: Network;
  setNetwork: (n: Network) => void;
}

const NetworkContext = createContext<NetworkContextValue | null>(null);

export function NetworkContextProvider({
  children,
  defaultNetwork = 'devnet',
}: {
  children: React.ReactNode;
  defaultNetwork?: Network;
}) {
  const [network, setNetworkState] = useState<Network>(defaultNetwork);

  const setNetwork = useCallback((n: Network) => {
    setNetworkState(n);
  }, []);

  return (
    <NetworkContext.Provider value={{ network, setNetwork }}>{children}</NetworkContext.Provider>
  );
}

export function useNetwork() {
  const ctx = useContext(NetworkContext);
  if (!ctx) throw new Error('useNetwork must be used within NetworkContextProvider');
  return ctx;
}
