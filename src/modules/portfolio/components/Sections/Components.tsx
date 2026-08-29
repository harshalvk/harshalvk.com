import { SectionCorners } from '@/components/shared/Navbar';
import React from 'react';
import { Panel, PanelContent, PanelHeader, PanelTitle, PanelTitleSup } from '../panel';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Route } from 'next';
import { getDocsByCategory } from '@/modules/doc/data/document';
import { buttonVariants } from '@/components/ui/button';
import { ArrowRightIcon } from 'lucide-react';

const ID = 'components';

const Components = async () => {
  const docs = await getDocsByCategory(ID);
  return (
    <Panel id={ID}>
      <SectionCorners />
      <PanelHeader>
        <PanelTitle>
          <a href={`#${ID}`}>Components.</a>
          <PanelTitleSup>({docs.length})</PanelTitleSup>
        </PanelTitle>
      </PanelHeader>
      <PanelContent>
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
        <div className="flex w-full items-center justify-center py-2">
          <Link
            className={cn(
              'group',
              buttonVariants({
                variant: 'ghost',
                className: 'bg-muted/30 p-0 text-xs ring-1 ring-zinc-700/10 dark:ring-zinc-100/10',
              })
            )}
            href={'/components'}
          >
            All Components{' '}
            <ArrowRightIcon className="transition-transform group-hover:-rotate-45" />
          </Link>
        </div>
      </PanelContent>
    </Panel>
  );
};

export default Components;

function ComponentItem({ className, ...props }: React.ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn('text-foreground flex w-full items-center gap-3 p-4 sm:py-5', className)}
      {...props}
    />
  );
}

function ComponentItemDot({ className, ...props }: Omit<React.ComponentProps<'span'>, 'children'>) {
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
