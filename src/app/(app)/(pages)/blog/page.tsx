import { NotebookPen } from 'lucide-react';
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
    <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
      <NotebookPen className="text-muted-foreground h-8 w-8" strokeWidth={1.5} />
      <h2 className="text-lg font-medium tracking-tight">Blogs coming soon</h2>
      <p className="text-muted-foreground max-w-xs text-sm">
        I&apos;m working on some articles. Check back later.
      </p>
    </div>
  );
};

export default BlogPage;
