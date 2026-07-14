import type { Metadata } from 'next';
import { ProblemList } from '@/modules/theia/components/problem-list';
import { PanelTitle } from '@/modules/portfolio/components/panel';

export const metadata: Metadata = {
  title: 'DSA Problems — Theia',
  description:
    'Common data structures & algorithms interview problems, with step-by-step visualization and multi-language solutions.',
  alternates: { canonical: 'theia/problems' },
};

export default function ProblemsPage() {
  return (
    <section className="flex-1 border-x">
      <div className="space-y-2 px-4 py-2">
        <PanelTitle>DSA Problems</PanelTitle>
        <p className="text-muted-foreground text-sm md:text-base">
          Common interview problems — watch the algorithm run step by step, then read the solution
          in your language of choice.
        </p>
      </div>
      <div className="screen-line-top screen-line-bottom bg-hatching h-10" />
      <div>
        <ProblemList />
      </div>
    </section>
  );
}
