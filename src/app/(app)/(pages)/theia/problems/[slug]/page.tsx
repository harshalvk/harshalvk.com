import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PROBLEMS, getProblem } from '@/modules/theia/data/problems';
import { ProblemVisualizer } from '@/modules/theia/components/problem-visualizer';
import { ProblemSolutionTabs } from '@/modules/theia/components/problem-solution-tabs';
import { PanelTitle } from '@/modules/portfolio/components/panel';
import { Badge } from '@/components/ui/badge';
import { MarkdownClient } from '@/components/markdown';
import { Prose } from '@/components/Typography';
import { cn } from '@/lib/utils';
import { DIFFICULTY_CLASS } from '@/modules/theia/lib/constants';

export async function generateStaticParams() {
  return PROBLEMS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const problem = getProblem(slug);
  if (!problem) return notFound();

  return {
    title: problem.title,
    description: problem.summary,
    alternates: { canonical: `theia/problems/${slug}` },
  };
}

export default async function ProblemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const problem = getProblem(slug);
  if (!problem) notFound();

  return (
    <section className="flex-1 border-x">
      <div className="space-y-2 px-4 py-2">
        <div className="flex items-center gap-2">
          <PanelTitle>{problem.title}</PanelTitle>
          <Badge
            className={cn('shrink-0 text-xs capitalize', DIFFICULTY_CLASS[problem.difficulty])}
          >
            {problem.difficulty}
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm md:text-base">{problem.summary}</p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {problem.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs font-normal">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div className="screen-line-top screen-line-bottom bg-hatching h-10" />

      {/* Visualization */}
      <div className="p-4">
        <h2 className="text-muted-foreground mb-3 text-sm font-medium">Visualize</h2>
        <ProblemVisualizer problem={problem} />
      </div>

      <div className="screen-line-top screen-line-bottom bg-hatching h-4" />

      {/* Solution */}
      <div className="p-4">
        <h2 className="text-muted-foreground mb-3 text-sm font-medium">Solution</h2>
        <ProblemSolutionTabs code={problem.code} />
      </div>

      <div className="screen-line-top screen-line-bottom bg-hatching h-4" />

      {/* Docs */}
      <div className="p-4">
        <h2 className="text-muted-foreground mb-3 text-sm font-medium">Docs</h2>
        <Prose className="prose-harshalvk max-w-none">
          <MarkdownClient>{problem.docs}</MarkdownClient>
        </Prose>
      </div>
    </section>
  );
}
