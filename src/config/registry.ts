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
];
