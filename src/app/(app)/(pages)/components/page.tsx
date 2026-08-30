import { cn } from '@/lib/utils';
import { getDocsByCategory } from '@/modules/doc/data/document';
import { PanelTitle } from '@/modules/portfolio/components/panel';
import type { Metadata, Route } from 'next';
import { ogPages } from '@/config/og';
import { SITE_INFO, X_HANDLE } from '@/config/site';
import {
  ComponentItem,
  ComponentItemIcon,
  ComponentItemTitle,
} from '@/modules/portfolio/components/component-item';
import ComponentsIcon from '@/components/components-icon';

const { title, description } = ogPages.components;

export const metadata: Metadata = {
  title,
  description,

  keywords: [
    'components',
    'ui',
    'ui components',
    'ui components library',
    'shadcn/ui',
    'shadcn',
    'react components',
    'react',
    'harshalvk components',
    'harshal components',
  ],
  alternates: {
    canonical: `${SITE_INFO.url}/components`,
  },
  openGraph: {
    type: 'website',
    url: `${SITE_INFO.url}/components`,
    title: `${title} \u2013 ${SITE_INFO.author}`,
    description,
    siteName: SITE_INFO.name,
    images: [
      {
        url: `${SITE_INFO.url}/og/components`,
        width: 2400,
        height: 1260,
        alt: title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [`${SITE_INFO.url}/og/components`],
    creator: X_HANDLE,
  },
  icons: {
    icon: '/profile.png',
  },
};

export async function generateStaticParams() {
  const docs = await getDocsByCategory('components');
  return docs.map((doc) => ({ slug: doc.slug }));
}

export default async function ComponentsPage() {
  const docs = (await getDocsByCategory('components'))
    .slice()
    .sort((a, b) =>
      a.metadata.title.localeCompare(b.metadata.title, 'en', { sensitivity: 'base' })
    );

  return (
    <section aria-labelledby="components-heading" className="flex-1 gap-3 border-x">
      <div className="space-y-1 px-4 py-2">
        <PanelTitle>{title}</PanelTitle>
        <p className="text-muted-foreground text-sm md:text-base">{description}</p>
      </div>
      <div className="screen-line-top screen-line-bottom bg-hatching h-10" />
      <div className="grid auto-rows-fr grid-cols-2 sm:grid-cols-3">
        {docs.map((doc) => (
          <ComponentItem
            className={cn(
              'border-b border-dashed',
              'odd:border-r sm:odd:border-r-0',
              'sm:[&:not(:nth-child(3n))]:border-r'
            )}
            key={doc.slug}
            href={`/components/${doc.slug}` as Route}
          >
            <ComponentItemIcon>
              <ComponentsIcon slug={doc.slug} />
            </ComponentItemIcon>
            <ComponentItemTitle>{doc.metadata.title}</ComponentItemTitle>
          </ComponentItem>
        ))}
      </div>
    </section>
  );
}
