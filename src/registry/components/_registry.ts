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
        target: '@components/wallet-adapter.tsx',
      },
    ],
    categories: ['web3', 'authentication'],
    docs: 'https://harshalvk.com/components/wallet-adapter',
  },
  {
    name: 'key-screen',
    type: 'registry:component',
    title: 'Key Screen',
    description:
      'A floating overlay that captures and displays keyboard shortcuts and keypresses in real time — ideal for demos, screencasts, and presentations.',
    files: [
      {
        path: 'components/key-screen/key-screen.tsx',
        type: 'registry:component',
        target: '@components/key-screen.tsx',
      },
    ],
    categories: ['utility', 'overlay', 'keyboard', 'interaction'],
    docs: 'https://harshalvk.com/components/key-screen',
  },
];
