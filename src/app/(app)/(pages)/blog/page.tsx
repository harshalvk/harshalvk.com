import { PanelTitle } from '@/modules/portfolio/components/panel';
import type { Metadata } from 'next';

const title = 'Blog';
const description = 'Writing about code, systems, and everything in between.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: 'blog',
  },
};

const BlogPage = () => {
  return (
    <section aria-labelledby="blogs-heading" className="flex-1 gap-3 border-x">
      <div className="space-y-2 px-4 py-2">
        <PanelTitle>{title}</PanelTitle>
        <p className="text-muted-foreground text-sm md:text-base">{description}</p>
      </div>
      <div className="screen-line-top screen-line-bottom bg-hatching h-10" />
      <p className="text-muted-foreground p-4 text-sm md:text-base">
        Nothing to read. Please comback after some time.
      </p>
    </section>
  );
};

export default BlogPage;
