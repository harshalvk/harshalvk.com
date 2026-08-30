import { SectionCorners } from '@/components/shared/Navbar';
import React from 'react';
import { Panel, PanelContent, PanelHeader, PanelTitle, PanelTitleSup } from '../panel';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Route } from 'next';
import { getDocsByCategory } from '@/modules/doc/data/document';
import { buttonVariants } from '@/components/ui/button';
import { ArrowRightIcon } from 'lucide-react';
import ComponentsIcon from '@/components/components-icon';
import { ComponentItem, ComponentItemIcon, ComponentItemTitle } from '../component-item';

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
        <div className="grid auto-rows-fr grid-cols-1 sm:grid-cols-3">
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
        <div className="flex w-full items-center justify-center py-2">
          <Link
            className={cn(
              'group',
              buttonVariants({
                variant: 'ghost',
                className: 'bg-muted/30 p-0 text-xs ring-1 ring-zinc-700/10 dark:ring-zinc-100/10',
              })
            )}
            href={'/components' as Route}
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
