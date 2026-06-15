import { Blocks } from 'lucide-react';
import type { Metadata } from 'next';

const title = 'Components';
const description = '';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: 'blog',
  },
};

const ComponentsPage = () => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
      <Blocks className="text-muted-foreground h-8 w-8" strokeWidth={1.5} />
      <h2 className="text-lg font-medium tracking-tight">Components coming soon</h2>
      <p className="text-muted-foreground max-w-xs text-sm">
        Building something useful. Check back later.
      </p>
    </div>
  );
};

export default ComponentsPage;
