import type { Registry } from 'shadcn/schema';

export const components: Registry['items'] = [
  {
    name: 'wallet-adapter',
    type: 'registry:component',
    title: 'Wallet Adapter',
    description:
      'A Solana wallet connection button with a dialog wallet picker and connected-state dropdown.',
    files: [
      {
        path: 'components/wallet-adapter/wallet-adapter.tsx',
        type: 'registry:component',
        target: '@components/wallet-adapter',
      },
    ],
    categories: ['web3', 'authentication'],
    docs: 'https://harshalvk.com/components/wallet-adapter',
  },
];
