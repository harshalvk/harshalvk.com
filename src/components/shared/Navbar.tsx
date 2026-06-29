import React from 'react';
import { ModeToggle } from '@/components/ModeToggle';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { getAllDocs } from '@/modules/doc/data/document';
import type { DocPreview } from '@/modules/doc/types/document';
import { UrlObject } from 'url';
import { cn } from '@/lib/utils';
import { inter } from '@/lib/fonts';

const CommandMenu = dynamic(() => import('@/components/command-menu'));

const navLinks = [
  {
    shrug: 'blog',
    name: 'Blog',
    link: '/blog',
  },
  {
    shrug: 'blog',
    name: 'Components',
    link: '/components',
  },
  {
    shrug: 'theia',
    name: 'Theia',
    link: '/theia',
  },
];

const Navbar = async () => {
  const docs = await getAllDocs();
  const docPreview: DocPreview[] = docs.map((doc) => ({
    slug: doc.slug,
    title: doc.metadata.title,
    category: doc.metadata.category,
  }));
  return (
    <div className="bg-background fixed top-0 right-0 left-0 z-50 flex justify-center">
      <div className="mt-4 w-full max-w-5xl px-4 lg:px-0">
        <nav className="screen-line-top screen-line-bottom pointer-events-auto relative flex w-full items-center justify-between border-x px-4 py-3">
          <SectionCorners />
          <Link href={'/'} className={cn('text-shadow text-sm sm:text-base', inter.className)}>
            @harshalvk
          </Link>
          <div className="flex items-center">
            <div className="mr-1 flex items-center gap-4">
              <ul className="hidden gap-4 md:flex">
                {navLinks.map((navLink, idx) => (
                  <Link key={idx} href={navLink.link as unknown as UrlObject}>
                    {navLink.name}
                  </Link>
                ))}
              </ul>
              <CommandMenu docs={docPreview} />
            </div>
            <p className="text-muted-foreground mx-1 cursor-default opacity-80 select-none">|</p>
            <ModeToggle />
          </div>
        </nav>
      </div>
    </div>
  );
};

export function SectionCorners() {
  return (
    <>
      <div className="border-muted-foreground/50 absolute top-0 -left-[1px] z-5 h-2 w-2 border-t border-l" />
      <div className="border-muted-foreground/50 absolute top-0 -right-[1px] z-5 h-2 w-2 border-t border-r" />
      <div className="border-muted-foreground/50 absolute bottom-0 -left-[1px] z-5 h-2 w-2 border-b border-l" />
      <div className="border-muted-foreground/50 absolute -right-[1px] bottom-0 z-5 h-2 w-2 border-r border-b" />
    </>
  );
}

export default Navbar;
