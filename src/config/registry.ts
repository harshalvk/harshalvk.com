export const registryConfig = {
  /**
   * Registry namespace identifier for shadcn CLI
   * @example "@harshalvk" - Users can install components with: `npx shadcn add @harshalvk/wallet-adapter`
   * @see https://ui.shadcn.com/docs/registry/namespace#overview
   */
  namespace: process.env.NEXT_PUBLIC_REGISTRY_NAMESPACE || '@harshalvk',
  /**
   * URL pattern for resolving namespaced components
   * The {name} placeholder will be replaced with the component name
   * @example "https://harshalvk.com/r/{name}.json" resolves to "https://harshalvk.com/r/wallet-adapter.json"
   * This tells shadcn CLI where to fetch component definitions when installing with namespace prefix
   * @see https://ui.shadcn.com/docs/registry/namespace#url-pattern-system
   */
  namespaceUrl:
    process.env.NEXT_PUBLIC_REGISTRY_NAMESPACE_URL || 'https://harshalvk.com/r/{name}.json',
};

export const componentCategories = [
  {
    name: 'wallet-adapter',
    title: 'Wallet Adapter',
    description:
      'A Solana wallet connection button with a dialog wallet picker and connected-state dropdown.',
  },
  {
    name: 'key-screen',
    title: 'Key Screen',
    description:
      'A floating overlay that captures and displays keyboard shortcuts and keypresses in real time — ideal for demos, screencasts, and presentations.',
  },
  {
    name: 'masnory-feed',
    title: 'Masnory Feed',
    description:
      'A Pinterest-style image feed that places images left to right into the shortest column using manual height calculation — no CSS grid required.',
  },
  {
    name: 'component-playground',
    title: 'Component Playground',
    description:
      "An interactive props editor that renders a component alongside live-editable controls — like Storybook's controls panel, but a plain component you can drop into MDX docs.",
  },
  {
    name: 'drag-to-confirm',
    title: 'Drag To Confirm',
    description:
      'A slider the user must drag all the way to the right to confirm a destructive or irreversible action — safer than a confirm dialog, harder to trigger by accident.',
  },
  {
    name: 'scratch-card',
    title: 'Scratch Card',
    description:
      'A canvas-based scratch-to-reveal card with built-in reward variants, scoped confetti, and an imperative handle for programmatic control — ideal for promotions, giveaways, and reward flows.',
  },
];
