import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ALGORITHMS, getAlgorithm } from '@/modules/theia/data/algorithms';
import { AlgorithmVisualizer } from '@/modules/theia/components/algorithm-visualizer';
import { PanelTitle } from '@/modules/portfolio/components/panel';
import { getMLAlgorithm, ML_ALGORITHMS } from '@/modules/theia/data/ml-algorithms';
import { MLAlgorithmPlayer } from '@/modules/theia/components/ml-algorithm-player';

export async function generateStaticParams() {
  return [
    ...ALGORITHMS.map((a) => ({ category: a.category, slug: a.slug })),
    ...ML_ALGORITHMS.map((a) => ({ category: a.category, slug: a.slug })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  const mlAlgo = getMLAlgorithm(category, slug);
  const algo = mlAlgo ? undefined : getAlgorithm(category, slug);

  if (!algo && !mlAlgo) return notFound();

  return {
    title: algo?.title ?? mlAlgo!.title,
    description: algo?.description ?? mlAlgo!.description,
    keywords: [
      'DSA Visualizer',
      'Algorithm Visualizer',
      'Data Structures and Algorithms',
      'DSA',
      'Sorting Visualizer',
      'Sorting Algorithms',
      'Bubble Sort Visualizer',
      'Merge Sort Visualizer',
      'Quick Sort Visualizer',
      'Heap Sort Visualizer',
      'Insertion Sort Visualizer',
      'Selection Sort Visualizer',
      'Algorithm Animation',
      'Interactive Algorithms',
      'Learn DSA',
      'Computer Science',
      'Coding Interview Preparation',
      'LeetCode Preparation',
      'Algorithm Simulator',
      'Data Structure Visualizer',
      'Programming Education',
      'Software Engineering',
      'Technical Interview',
    ],
    alternates: { canonical: `theia/${category}/${slug}` },
  };
}

export default async function AlgorithmPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const mlAlgo = getMLAlgorithm(category, slug);
  const algo = mlAlgo ? undefined : getAlgorithm(category, slug);

  if (!algo && !mlAlgo) notFound();

  return (
    <section className="flex-1 border-x">
      <div className="space-y-2 px-4 py-2">
        <PanelTitle>{algo?.title ?? mlAlgo!.title}</PanelTitle>
        <p className="text-muted-foreground text-sm md:text-base">
          {algo?.description ?? mlAlgo!.description}
        </p>
        {algo && (
          <p className="text-muted-foreground font-mono text-xs">
            Best: {algo.timeComplexity.best} · Avg: {algo.timeComplexity.average} · Worst:{' '}
            {algo.timeComplexity.worst} · Space: {algo.spaceComplexity}
          </p>
        )}
      </div>
      <div className="screen-line-top screen-line-bottom bg-hatching h-10" />
      <div className="p-4">
        {algo && <AlgorithmVisualizer algorithm={algo} />}
        {mlAlgo && <MLAlgorithmPlayer algorithm={mlAlgo} />}
      </div>
    </section>
  );
}
