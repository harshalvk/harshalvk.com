export type Point = { x: number; y: number };

export type MLStepStatus = 'default' | 'active' | 'centroid' | 'assigned';

export type RegressionStep = {
  points: Point[];
  slope: number;
  intercept: number;
  loss: number;
  description: string;
  iteration: number;
};

export type ClusterPoint = Point & {
  clusterId: number | null;
};

export type ClusteringStep = {
  points: ClusterPoint[];
  centroids: Point[];
  description: string;
  iteration: number;
};

export type MLCategoryMeta = {
  slug: string;
  title: string;
  description: string;
};
