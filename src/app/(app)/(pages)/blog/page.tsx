import { formatDate } from '@/lib/formatDate';
import { getDocsByCategory } from '@/modules/doc/data/document';
import { PanelTitle } from '@/modules/portfolio/components/panel';
import type { Metadata, Route } from 'next';
import Link from 'next/link';
import { ogPages } from '@/config/og';
import { SITE_INFO, X_HANDLE } from '@/config/site';

const { title, description } = ogPages.blog;

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    'blogs',
    'blog',
    'articles',
    'technical blog',
    'harshalvk blogs',
    'harshal blogs',
    'harshalvk blog',
    'harshal blog',
    'technical writing',
  ],
  alternates: {
    canonical: `${SITE_INFO.url}/blog`,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: `${SITE_INFO.url}/blog`,
    title: `${title} \u2013 ${SITE_INFO.name}`,
    description,
    siteName: SITE_INFO.name,
    images: [
      {
        url: `${SITE_INFO.url}/og/blog`,
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
    images: [`${SITE_INFO.url}/og/blog`],
    creator: X_HANDLE,
  },
  icons: {
    icon: '/profile.png',
  },
};

export async function generateStaticParams() {
  const docs = await getDocsByCategory('blogs');
  return docs.map((doc) => ({ slug: doc.slug }));
}

const BlogPage = async () => {
  const docs = (await getDocsByCategory('blogs')).slice().sort((a, b) =>
    a.metadata.title.localeCompare(b.metadata.title, 'en', {
      sensitivity: 'base',
    })
  );

  return (
    <section aria-labelledby="blogs-heading" className="flex-1 gap-3 border-x">
      <div className="space-y-1 px-4 py-2">
        <PanelTitle id="blogs-heading">{title}</PanelTitle>
        <p className="text-muted-foreground text-sm md:text-base">{description}</p>
      </div>
      <div className="screen-line-top screen-line-bottom bg-hatching h-10" />
      <ul className="divide-y">
        {docs.map((doc) => (
          <li key={doc.slug}>
            <Link
              href={`/blog/${doc.slug}` as Route}
              className="group flex items-baseline justify-between gap-4 px-4 py-3 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800/30"
            >
              <span className="text-sm leading-snug font-medium sm:text-base">
                {doc.metadata.title}
              </span>

              <span className="text-muted-foreground shrink-0 font-mono text-xs tabular-nums">
                {doc.metadata.readingTime} &bull; {formatDate(doc.metadata.createdAt)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};
export default BlogPage;
