import type { MLCategoryMeta } from '@/modules/theia/types/ml-algorithm';
import { gradientDescentSteps, randomLinearPoints } from '@/modules/theia/lib/regression-engine';
import { kMeansSteps, randomClusterPoints } from '@/modules/theia/lib/kmeans-engine';
import type { Point } from '@/modules/theia/types/ml-algorithm';

export const ML_CATEGORIES: MLCategoryMeta[] = [
  {
    slug: 'ml',
    title: 'Machine Learning',
    description:
      'Watch ML models learn — gradient descent, clustering, and more, one iteration at a time.',
  },
];

export type MLAlgorithmKind = 'regression' | 'clustering';

export type MLAlgorithmMeta = {
  slug: string;
  category: string;
  title: string;
  description: string;
  kind: MLAlgorithmKind;
};

export const ML_ALGORITHMS: MLAlgorithmMeta[] = [
  {
    slug: 'linear-regression',
    category: 'ml',
    title: 'Linear Regression (Gradient Descent)',
    description: 'Fits a line to data by iteratively minimizing mean squared error.',
    kind: 'regression',
  },
  {
    slug: 'k-means-clustering',
    category: 'ml',
    title: 'K-Means Clustering',
    description: 'Groups data into k clusters by repeatedly assigning points and moving centroids.',
    kind: 'clustering',
  },
];

export function getMLAlgorithm(category: string, slug: string) {
  return ML_ALGORITHMS.find((a) => a.category === category && a.slug === slug);
}

export function getMLAlgorithmsByCategory(category: string) {
  return ML_ALGORITHMS.filter((a) => a.category === category);
}

export function getMLCategory(slug: string) {
  return ML_CATEGORIES.find((c) => c.slug === slug);
}

export const mlGeneratorEngines = {
  'linear-regression': {
    generateData: () => randomLinearPoints(),
    generateSteps: (data: Point[]) => gradientDescentSteps(data),
  },
  'k-means-clustering': {
    generateData: () => randomClusterPoints(),
    generateSteps: (data: Point[]) => kMeansSteps(data),
  },
};
export type MLAlgoSlug = keyof typeof mlGeneratorEngines;
