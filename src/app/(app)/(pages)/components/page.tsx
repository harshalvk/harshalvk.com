import { cn } from '@/lib/utils';
import { getDocsByCategory } from '@/modules/doc/data/document';
import { PanelTitle } from '@/modules/portfolio/components/panel';
import type { Metadata, Route } from 'next';
import Link from 'next/link';

const title = 'Components';
const description = 'A curated component registry built on shadcn/ui. More coming soon.';

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
    canonical: 'components',
  },
};

export async function generateStaticParams() {
  const docs = await getDocsByCategory('components');
  return docs.map((doc) => ({ slug: doc.slug }));
}

export default async function ComponentsPage() {
  const docs = await getDocsByCategory('components');

  return (
    <section aria-labelledby="components-heading" className="flex-1 gap-3 border-x">
      <div className="space-y-2 px-4 py-2">
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
            <ComponentItemTitle>{doc.metadata.title}</ComponentItemTitle>
          </ComponentItem>
        ))}
      </div>
    </section>
  );
}

export function ComponentItem({ className, ...props }: React.ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn('text-foreground flex w-full items-center gap-3 p-4 sm:py-5', className)}
      {...props}
    />
  );
}

export function ComponentItemDot({
  className,
  ...props
}: Omit<React.ComponentProps<'span'>, 'children'>) {
  return (
    <span
      className={cn('bg-info ring-background size-2 shrink-0 rounded-full ring-1', className)}
      {...props}
    />
  );
}

type HeadingTypes = 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type HeadingProps<T extends HeadingTypes> = React.ComponentProps<T> & {
  as?: T;
};

export function ComponentItemTitle<T extends HeadingTypes = 'h2'>({
  as,
  className,
  ...props
}: HeadingProps<T>) {
  const Comp = as ?? 'h2';

  return (
    <Comp
      className={cn('line-clamp-1 leading-snug font-medium text-balance', className)}
      {...props}
    />
  );
}
