export const ogPages = {
  components: {
    title: 'Components',
    description: 'A curated component registry built on shadcn/ui. More coming soon.',
  },

  blog: {
    title: 'Blog',
    description:
      'Technical articles about software engineering, systems, infrastructure, and development.',
  },

  theia: {
    title: 'Theia',
    description: 'Interactive algorithm visualizations and computer science concepts.',
  },
} as const;

export type OGPageSlug = keyof typeof ogPages;
