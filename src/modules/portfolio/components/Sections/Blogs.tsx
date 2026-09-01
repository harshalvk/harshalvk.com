import React from 'react';
import { Panel, PanelHeader, PanelTitle, PanelTitleSup, PanelContent } from '../panel';
import { getDocsByCategory } from '@/modules/doc/data/document';
import { SectionCorners } from '@/components/shared/Navbar';
import Link from 'next/link';
import { formatDate } from '@/lib/formatDate';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { ArrowRightIcon } from 'lucide-react';
import { Route } from 'next';

const ID = 'blogs';

const Blogs = async () => {
  const docs = await getDocsByCategory(ID);
  return (
    <Panel id={ID}>
      <SectionCorners />
      <PanelHeader>
        <PanelTitle>
          <a href={`#${ID}`}>Blogs.</a>
          <PanelTitleSup>({docs.length})</PanelTitleSup>
        </PanelTitle>
      </PanelHeader>
      <PanelContent>
        <ul className="grid w-full grid-cols-1 divide-y md:grid-cols-2 md:divide-y-0">
          {docs.slice(0, 6).map((doc) => (
            <li
              key={doc.slug}
              className="md:[&:nth-child(odd)]:border-border border-b md:[&:nth-child(odd)]:border-r"
            >
              <Link
                href={`/blog/${doc.slug}` as Route}
                className="group hover:bg-muted/40 flex h-full flex-col justify-between gap-4 p-4 transition-colors"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-sm leading-snug font-medium sm:text-base">
                    {doc.metadata.title}
                  </span>
                  <p className="text-muted-foreground line-clamp-2 text-xs">
                    {doc.metadata.description}
                  </p>
                </div>

                <span className="text-muted-foreground font-mono text-xs tabular-nums">
                  {doc.metadata.readingTime}&nbsp;&bull;&nbsp;{formatDate(doc.metadata.createdAt)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </PanelContent>
      <div className="flex w-full items-center justify-center py-2">
        <Link
          className={cn(
            'group',
            buttonVariants({
              variant: 'ghost',
              className: 'bg-muted/30 p-0 text-xs ring-1 ring-zinc-700/10 dark:ring-zinc-100/10',
            })
          )}
          href={'/blog'}
        >
          All Blogs <ArrowRightIcon className="transition-transform group-hover:-rotate-45" />
        </Link>
      </div>
    </Panel>
  );
};

export default Blogs;
