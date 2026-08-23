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
  {
    name: 'masonry-feed',
    type: 'registry:component',
    title: 'Masonry Feed',
    description:
      'A Pinterest-style image feed that places images left to right into the shortest column using manual height calculation — no CSS grid required.',
    files: [
      {
        path: 'components/masonry-feed/masonry-feed.tsx',
        type: 'registry:component',
        target: '@components/masonry-feed.tsx',
      },
    ],
    categories: ['media', 'gallery', 'interactive'],
    docs: 'https://harshalvk.com/components/masonry-feed',
  },
  {
    name: 'drag-to-confirm',
    type: 'registry:component',
    title: 'Drag To Confirm',
    description: '',
    files: [
      {
        path: 'components/drag-to-confirm/drag-to-confirm.tsx',
        type: 'registry:component',
        target: '@components/drag-to-confirm.tsx',
      },
    ],
    categories: ['interaction', 'forms'],
    docs: 'https://harshalvk.com/components/drag-to-confirm',
  },
  {
    name: 'scratch-card',
    type: 'registry:component',
    title: 'Scratch Card',
    description:
      'A canvas-based scratch-to-reveal card with built-in reward variants, scoped confetti, and an imperative handle for programmatic control — ideal for promotions, giveaways, and reward flows.',
    files: [
      {
        path: 'components/scratch-card/scratch-card.tsx',
        type: 'registry:component',
        target: '@components/scratch-card.tsx',
      },
    ],
    categories: ['interactive'],
    docs: 'https://harshalvk.com/components/scratch-card',
  },
  {
    name: 'component-playground',
    type: 'registry:component',
    title: 'Component Playground',
    description:
      "An interactive props editor that renders a component alongside live-editable controls — like Storybook's controls panel, but a plain component you can drop into MDX docs.",
    files: [
      {
        path: 'components/component-playground/component-playground.tsx',
        type: 'registry:component',
        target: '@components/component-playground.tsx',
      },
    ],
    categories: ['developer-tools', 'documentation'],
    docs: 'https://harshalvk.com/components/component-playground',
  },
  {
    name: 'ascii-dither',
    type: 'registry:component',
    title: 'Ascii Dither',
    description:
      'An animated ASCII character field driven by a layered sine noise function and a Bayer 4×4 ordered-dither matrix. Use it as a decorative canvas backdrop behind hero content, cards, or anywhere a subtle animated texture is needed.',
    files: [
      {
        path: 'components/ascii-dither/ascii-dither.tsx',
        type: 'registry:component',
        target: '@components/ascii-dither.tsx',
      },
    ],
    categories: [''],
    docs: 'https://harshalvk.com/components/ascii-dither',
  },
];
