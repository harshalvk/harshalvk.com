import type { Registry } from 'shadcn/schema';

export const examples: Registry['items'] = [
  {
    name: 'wallet-adapter-demo',
    type: 'registry:example',
    files: [
      {
        path: 'components/wallet-adapter/wallet-adapter.tsx',
        type: 'registry:component',
        target: '@components/wallet-adapter',
      },
    ],
  },
];
