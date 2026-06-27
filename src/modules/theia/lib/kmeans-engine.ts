import type { ClusteringStep, ClusterPoint, Point } from '@/modules/theia/types/ml-algorithm';

export function randomClusterPoints(n = 40): Point[] {
  const blobs = 3;
  const points: Point[] = [];

  for (let b = 0; b < blobs; b++) {
    const cx = 20 + Math.random() * 60;
    const cy = 20 + Math.random() * 60;

    for (let i = 0; i < n / blobs; i++) {
      points.push({
        x: cx + (Math.random() - 0.5) * 25,
        y: cy + (Math.random() - 0.5) * 25,
      });
    }
  }

  return points;
}

function distance(a: Point, b: Point) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

export function kMeansSteps(points: Point[], k = 3, maxIterations = 10): ClusteringStep[] {
  const steps: ClusteringStep[] = [];

  let centroids: Point[] = Array.from({ length: k }, () => {
    const p = points[Math.floor(Math.random() * points.length)];
    return { x: p.x, y: p.y };
  });

  let clusterPoints: ClusterPoint[] = points.map((p) => ({ ...p, clusterId: null }));

  steps.push({
    points: clusterPoints,
    centroids,
    description: `Start: ${k} centroids placed randomly among data points.`,
    iteration: 0,
  });

  for (let iter = 1; iter <= maxIterations; iter++) {
    // assign step
    clusterPoints = clusterPoints.map((p) => {
      let bestIdx = 0;
      let bestDist = Infinity;
      centroids.forEach((c, idx) => {
        const d = distance(p, c);
        if (d < bestDist) {
          bestDist = d;
          bestIdx = idx;
        }
      });
      return { ...p, clusterId: bestIdx };
    });

    steps.push({
      points: clusterPoints,
      centroids,
      description: `Iteration ${iter}: assigned each point to its nearest centroid.`,
      iteration: iter,
    });

    // update step
    const newCentroids = centroids.map((c, idx) => {
      const assigned = clusterPoints.filter((p) => p.clusterId === idx);
      if (assigned.length === 0) return c;

      const avgX = assigned.reduce((sum, p) => sum + p.x, 0) / assigned.length;
      const avgY = assigned.reduce((sum, p) => sum + p.y, 0) / assigned.length;
      return { x: avgX, y: avgY };
    });

    const moved = newCentroids.some((c, idx) => distance(c, centroids[idx]) > 0.5);
    centroids = newCentroids;

    steps.push({
      points: clusterPoints,
      centroids,
      description: `Iteration ${iter}: moved centroids to the average position of their assigned points.`,
      iteration: iter,
    });

    if (!moved) {
      steps.push({
        points: clusterPoints,
        centroids,
        description: `Converged after ${iter} iterations — centroids stopped moving.`,
        iteration: iter,
      });
      break;
    }
  }

  return steps;
}
