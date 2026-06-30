import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CATEGORIES, getAlgorithmsByCategory, getCategory } from '@/modules/theia/data/algorithms';
import { AlgorithmList } from '@/modules/theia/components/algorithm-list';
import { PanelTitle } from '@/modules/portfolio/components/panel';
import { X_HANDLE } from '@/config/site';
import { LinkedListPlayground } from '@/modules/theia/components/linked-list-playground';
import { MLAlgorithmList } from '@/modules/theia/components/ml-algorithm-list';
import { getMLAlgorithmsByCategory } from '@/modules/theia/data/ml-algorithms';

export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<'/theia/[category]'>): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) return notFound();

  const portUrl = `/theia/${cat.slug}`;
  const ogImage = '/theia.png';

  return {
    title: cat.title,
    description: cat.description,
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
    alternates: { canonical: `theia/${cat.slug}` },
    openGraph: {
      url: portUrl,
      type: 'website',
      images: {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: cat.title,
      },
    },
    twitter: {
      card: 'summary_large_image',
      site: X_HANDLE,
      creator: X_HANDLE,
      images: [ogImage],
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();

  const algorithms = getAlgorithmsByCategory(category);
  const mlAlgorithms = getMLAlgorithmsByCategory(category);

  return (
    <section className="flex-1 border-x">
      <div className="space-y-2 px-4 py-2">
        <PanelTitle>{cat.title}</PanelTitle>
        <p className="text-muted-foreground text-sm md:text-base">{cat.description}</p>
      </div>
      <div className="screen-line-top screen-line-bottom bg-hatching h-10" />

      {category === 'linked-list' ? (
        <div className="p-4">
          <LinkedListPlayground />
        </div>
      ) : category === 'ml' ? (
        <MLAlgorithmList algorithms={mlAlgorithms} category={category} />
      ) : (
        <AlgorithmList algorithms={algorithms} category={category} />
      )}
    </section>
  );
}
