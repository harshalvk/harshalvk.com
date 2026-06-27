import type { AlgorithmCategoryMeta, AlgorithmMeta } from '@/modules/theia/types/algorithm';

export const CATEGORIES: AlgorithmCategoryMeta[] = [
  {
    slug: 'sorting',
    title: 'Sorting Algorithms',
    description: 'Watch how arrays get sorted, step by step — comparisons, swaps, and final order.',
  },
  {
    slug: 'linked-list',
    title: 'Linked List',
    description: 'Insertion, deletion, traversal — coming soon.',
  },
  {
    slug: 'ml',
    title: 'Machine Learning',
    description: 'Algorithms that learn patterns from data to make predictions and decisions.',
  },
];

export const ALGORITHMS: AlgorithmMeta[] = [
  {
    slug: 'bubble-sort',
    category: 'sorting',
    title: 'Bubble Sort',
    description: 'Repeatedly swaps adjacent elements if they are in the wrong order.',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
  },
  {
    slug: 'selection-sort',
    category: 'sorting',
    title: 'Selection Sort',
    description: 'Finds the minimum from the unsorted part and places it at the front.',
    timeComplexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
  },
  {
    slug: 'insertion-sort',
    category: 'sorting',
    title: 'Insertion Sort',
    description: 'Builds sorted array one element at a time by inserting into correct position.',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
  },
  {
    slug: 'merge-sort',
    category: 'sorting',
    title: 'Merge Sort',
    description: 'Divides array into halves, sorts each, then merges them back together.',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(n)',
  },
  {
    slug: 'quick-sort',
    category: 'sorting',
    title: 'Quick Sort',
    description: 'Picks a pivot, partitions array around it, recursively sorts each side.',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
    spaceComplexity: 'O(log n)',
  },
  {
    slug: 'heap-sort',
    category: 'sorting',
    title: 'Heap Sort',
    description: 'Builds a max heap, then repeatedly extracts the largest element.',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(1)',
  },
  {
    slug: 'counting-sort',
    category: 'sorting',
    title: 'Counting Sort',
    description:
      'Counts occurrences of each value, then places them in order. Works best for small integer ranges.',
    timeComplexity: { best: 'O(n + k)', average: 'O(n + k)', worst: 'O(n + k)' },
    spaceComplexity: 'O(n + k)',
  },
  {
    slug: 'radix-sort',
    category: 'sorting',
    title: 'Radix Sort',
    description:
      'Sorts numbers digit by digit, from least to most significant, using counting sort as a subroutine.',
    timeComplexity: { best: 'O(nk)', average: 'O(nk)', worst: 'O(nk)' },
    spaceComplexity: 'O(n + k)',
  },
  {
    slug: 'shell-sort',
    category: 'sorting',
    title: 'Shell Sort',
    description:
      'Generalizes insertion sort by comparing elements far apart first, shrinking the gap each pass.',
    timeComplexity: { best: 'O(n log n)', average: 'O(n^1.3)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
  },
  {
    slug: 'bucket-sort',
    category: 'sorting',
    title: 'Bucket Sort',
    description: 'Distributes elements into buckets, sorts each bucket, then concatenates them.',
    timeComplexity: { best: 'O(n + k)', average: 'O(n + k)', worst: 'O(n²)' },
    spaceComplexity: 'O(n + k)',
  },
  {
    slug: 'tim-sort',
    category: 'sorting',
    title: 'Tim Sort',
    description:
      'Splits array into small runs sorted with insertion sort, then merges runs using merge sort.',
    timeComplexity: { best: 'O(n)', average: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(n)',
  },
  {
    slug: 'intro-sort',
    category: 'sorting',
    title: 'Intro Sort',
    description:
      'Hybrid of quicksort and insertion sort — uses quicksort for large ranges, insertion sort for small ones.',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(log n)',
  },
  {
    slug: 'bitonic-sort',
    category: 'sorting',
    title: 'Bitonic Sort',
    description:
      'Builds bitonic sequences and merges them recursively. Parallelizable, requires power-of-2 length (auto-padded here).',
    timeComplexity: { best: 'O(log² n)', average: 'O(log² n)', worst: 'O(log² n)' },
    spaceComplexity: 'O(n log n)',
  },
];

export function getCategory(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getAlgorithmsByCategory(category: string) {
  return ALGORITHMS.filter((a) => a.category === category);
}

export function getAlgorithm(category: string, slug: string) {
  return ALGORITHMS.find((a) => a.category === category && a.slug === slug);
}
