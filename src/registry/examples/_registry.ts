import type { Registry } from 'shadcn/schema';

export const examples: Registry['items'] = [
  {
    name: 'wallet-adapter-demo',
    type: 'registry:example',
    files: [
      {
        path: 'examples/wallet-adapter-demo.tsx',
        type: 'registry:example',
        target: '@components/wallet-adapter-demo.tsx',
      },
    ],
  },
  {
    name: 'key-screen-demo',
    type: 'registry:example',
    files: [
      {
        path: 'examples/key-screen-demo.tsx',
        type: 'registry:example',
        target: '@components/key-screen-demo.tsx',
      },
    ],
  },
  {
    name: 'masonry-feed-demo',
    type: 'registry:component',
    files: [
      {
        path: 'examples/masonry-feed-demo.tsx',
        type: 'registry:example',
        target: '@components/masonry-feed-demo.tsx',
      },
    ],
  },
];
