import { extractToc } from '@/components/extract-toc';
import { MDX } from '@/components/mdx';
import { TableOfContents } from '@/components/shared/toc';
import { Prose } from '@/components/Typography';
import { Button } from '@/components/ui/button';
import { Kbd } from '@/components/ui/kbd';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { SITE_INFO, X_HANDLE } from '@/config/site';
import { formatDate } from '@/lib/formatDate';
import { DocKeyboardShortcuts } from '@/modules/doc/components/doc-keyboard-shortcuts';
import { DocContentCol } from '@/modules/doc/components/doc-layout';
import { LLMCopyButtonWithViewOptions } from '@/modules/doc/components/doc-page.actions';
import { DocShareMenu } from '@/modules/doc/components/doc-share-menu';
import { findNeighbour, getDocBySlug, getDocsByCategory } from '@/modules/doc/data/document';
import { Doc } from '@/modules/doc/types/document';
import { PanelTitle } from '@/modules/portfolio/components/panel';
import { USER } from '@/modules/portfolio/data/user';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import { Metadata, Route } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { WithContext, BlogPosting as PageSchema } from 'schema-dts';

export async function generateMetadata({ params }: PageProps<'/blog/[slug]'>): Promise<Metadata> {
  const slug = (await params).slug;

  const doc = await getDocBySlug(slug);
  if (!doc || doc.metadata.category !== 'blogs') {
    return notFound();
  }

  const { title, description, image, createdAt, updatedAt } = doc.metadata;
  const postUrl = `${SITE_INFO.url}/blog/${doc.slug}`;
  const ogImage = image || `${SITE_INFO.url}/og/blog/${doc.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      type: 'article',
      url: postUrl,
      title: `${title} \u2013 ${SITE_INFO.name}`,
      description,
      siteName: SITE_INFO.name,
      publishedTime: new Date(createdAt).toISOString(),
      modifiedTime: new Date(updatedAt).toISOString(),
      images: [
        {
          url: ogImage,
          width: 2400,
          height: 1260,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: X_HANDLE,
      creator: X_HANDLE,
      title,
      description,
      images: [ogImage],
    },
  };
}

function getPageJsonLd(doc: Doc): WithContext<PageSchema> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: doc.metadata.title,
    description: doc.metadata.description,
    image:
      doc.metadata.image ||
      `/og/simple?title=${encodeURIComponent(doc.metadata.title)}&description=${encodeURIComponent(doc.metadata.description)}`,
    url: `${SITE_INFO.url}/blog/${doc.slug}`,
    datePublished: new Date(doc.metadata.createdAt).toISOString(),
    dateModified: new Date(doc.metadata.updatedAt).toISOString(),
    author: {
      '@type': 'Person',
      name: USER.displayName,
      identifier: USER.username,
      image: USER.avatar,
    },
  };
}

export async function generateStaticParams() {
  const docs = await getDocsByCategory('components');
  return docs.map((doc) => ({ slug: doc.slug }));
}

const BlogPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const slug = (await params).slug;
  const doc = await getDocBySlug(slug);

  if (!doc) notFound();
  if (doc.metadata.category !== 'blogs') notFound();

  const toc = extractToc(doc.content);

  const allDocs = (await getDocsByCategory(doc.metadata.category))
    .slice()
    .sort((a, b) =>
      a.metadata.title.localeCompare(b.metadata.title, 'en', { sensitivity: 'base' })
    );

  const { previous, next } = await findNeighbour(allDocs, slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getPageJsonLd(doc)).replace(/</g, '\\u003c'),
        }}
      />
      <section className="flex-1 border-x">
        <div className="bg-hatching screen-line-bottom h-4" />
        <DocContentCol>
          <DocKeyboardShortcuts
            previous={previous ? (`/blog/${previous.slug}` as Route) : null}
            next={next ? (`/blog/${next.slug}` as Route) : null}
          />
          <div className="flex items-center justify-between p-2">
            <Button
              className="text-muted-foreground hover:text-foreground h-7 gap-2 border-none !px-0 hover:no-underline"
              variant={'link'}
              size={'sm'}
              asChild
            >
              <Link href={'/blog'}>
                <ArrowLeftIcon /> Blogs
              </Link>
            </Button>

            <div className="flex items-center gap-2">
              <LLMCopyButtonWithViewOptions markdownUrl={`/blog/${doc.slug}.mdx`} />

              <DocShareMenu title={doc.metadata.title} url={`/blog/${doc.slug}`} />

              {previous && (
                <Tooltip>
                  <TooltipTrigger>
                    <Button className="size-7 border-none" variant="secondary" asChild>
                      <Link
                        href={`/blog/${previous.slug}` as Route}
                        aria-label="Previous Component"
                      >
                        <ArrowLeftIcon />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="pr-2 pl-3">
                    <div className="flex items-center gap-3">
                      Previous Component
                      <Kbd>
                        <ArrowLeftIcon />
                      </Kbd>
                    </div>
                  </TooltipContent>
                </Tooltip>
              )}

              {next && (
                <Tooltip>
                  <TooltipTrigger>
                    <Button className="size-7 border-none" variant="secondary" asChild>
                      <Link href={`/blog/${next.slug}` as Route} aria-label="Next Component">
                        <ArrowRightIcon />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="pr-2 pl-3">
                    <div className="flex items-center gap-3">
                      Next Component
                      <Kbd>
                        <ArrowRightIcon />
                      </Kbd>
                    </div>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
          <div className="screen-line-top screen-line-bottom bg-hatching h-4" />
          <div className="px-4 py-1">
            <PanelTitle>{doc.metadata.title}</PanelTitle>
            <p className="text-muted-foreground text-sm md:text-base">{doc.metadata.description}</p>
          </div>
          <div className="text-foreground/80 screen-line-top flex w-full justify-between gap-2 px-4 py-1 text-sm md:text-base">
            <p>{formatDate(doc.metadata.createdAt)}</p>
            <p>{doc.metadata.readingTime}</p>
          </div>
          <div className="screen-line-top screen-line-bottom bg-hatching h-10" />
          <Prose className="p-4">
            <div id="toc-sentinel" />
            <div>
              <MDX code={doc.content} />
            </div>
          </Prose>
        </DocContentCol>
      </section>

      <TableOfContents items={toc} />
    </>
  );
};

export default BlogPage;
