import type { Metadata } from 'next';
import { CategoryGrid } from '@/modules/theia/components/category-grid';
import { PanelTitle, PanelTitleSup } from '@/modules/portfolio/components/panel';
import { X_HANDLE } from '@/config/site';

const title = 'Theia';
const description =
  'Step-by-step visualizations of algorithms — DSA, ML, and cryptographic — explained one move at a time.';

export async function generateMetadata(): Promise<Metadata> {
  const postUrl = `/theia`;
  const ogImage = '/theia.png';

  return {
    title,
    description,
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
    alternates: { canonical: postUrl },
    openGraph: {
      url: postUrl,
      type: 'website',
      images: {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: title,
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

export default function DsaVisualizerPage() {
  return (
    <section className="flex-1 border-x">
      <div className="space-y-2 px-4 py-2">
        <PanelTitle>
          {title}
          <PanelTitleSup>v1</PanelTitleSup>
        </PanelTitle>
        <p className="text-muted-foreground text-sm md:text-base">{description}</p>
      </div>
      <div className="screen-line-top screen-line-bottom bg-hatching h-10" />
      <CategoryGrid />
    </section>
  );
}
