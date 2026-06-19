import type { Registry } from 'shadcn/schema';

import { components } from './components/_registry';
import { examples } from './examples/_registry';

export const registry = {
  name: 'harshalvk',
  homepage: 'https://harshalvk.com/components',
  items: [
    ...components,

    // Internal use only
    ...examples,
  ],
} satisfies Registry;
