import { MDX } from '@/components/mdx';
import { Prose } from '@/components/Typography';
import { Button } from '@/components/ui/button';
import { Kbd } from '@/components/ui/kbd';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { SITE_INFO, X_HANDLE } from '@/config/site';
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

export async function generateMetadata({
  params,
}: PageProps<'/components/[slug]'>): Promise<Metadata> {
  const slug = (await params).slug;
  const doc = await getDocBySlug(slug);

  if (!doc || doc.metadata.category !== 'components') {
    return notFound();
  }

  const { title, description, image, createdAt, updatedAt } = doc.metadata;

  const postUrl = `/components/${doc.slug}`;
  const ogImage =
    image ||
    `/og/simple?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`;

  return {
    title,
    description,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      url: postUrl,
      type: 'article',
      publishedTime: new Date(createdAt).toISOString(),
      modifiedTime: new Date(updatedAt).toISOString(),
      images: {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: title,
      },
    },
    twitter: {
      card: 'summary_large_image',
      site: X_HANDLE,
      creator: X_HANDLE,
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
    url: `${SITE_INFO.url}/components/${doc.slug}`,
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

const ComponentItemPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const slug = (await params).slug;
  const doc = await getDocBySlug(slug);

  if (!doc) {
    notFound();
  }

  if (doc.metadata.category !== 'components') {
    notFound();
  }

  const allDocs = (await getDocsByCategory(doc.content)).slice().sort((a, b) =>
    a.metadata.title.localeCompare(b.metadata.title, 'en', {
      sensitivity: 'base',
    })
  );

  const { previous, next } = await findNeighbour(allDocs, slug);

  return (
    <>
      <script
        type="applicaiton/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getPageJsonLd(doc)).replace(/</g, '\\u003c'),
        }}
      />
      <section className="flex-1 border-x">
        <div className="bg-hatching screen-line-bottom h-4" />
        <DocContentCol>
          <DocKeyboardShortcuts
            previous={previous ? (`/components/${previous.slug}` as Route) : null}
            next={next ? (`/components/${next.slug}` as Route) : null}
          />
          <div className="flex items-center justify-between p-2">
            <Button
              className="text-muted-foreground hover:text-foreground h-7 gap-2 border-none !px-0 hover:no-underline"
              variant="link"
              size="sm"
              asChild
            >
              <Link href="/components">
                <ArrowLeftIcon />
                Components
              </Link>
            </Button>

            <div className="flex items-center gap-2">
              <LLMCopyButtonWithViewOptions
                markdownUrl={`/components/${doc.slug}.mdx`}
                isComponent
              />

              <DocShareMenu title={doc.metadata.title} url={`/components/${doc.slug}`} />

              {previous && (
                <Tooltip>
                  <TooltipTrigger>
                    <Button className="size-7 border-none" variant="secondary" asChild>
                      <Link href={`/components/${previous.slug}`} aria-label="Previous Component">
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
                      <Link href={`/components/${next.slug}`} aria-label="Next Component">
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
          <div className="screen-line-top screen-line-bottom bg-hatching h-4" />

          <Prose className="px-4">
            <div>
              <MDX code={doc.content} />
            </div>
          </Prose>
        </DocContentCol>
      </section>
    </>
  );
};

export default ComponentItemPage;
