import type { DataPoint, ProjectedPoint } from '@/modules/argus/types/projector';

function mean(vectors: number[][]): number[] {
  const d = vectors[0].length;
  const m = new Array(d).fill(0);
  for (const v of vectors) for (let i = 0; i < d; i++) m[i] += v[i];
  return m.map((x) => x / vectors.length);
}

function subtractMean(vectors: number[][], m: number[]): number[][] {
  return vectors.map((v) => v.map((x, i) => x - m[i]));
}

function covarianceMatrix(centered: number[][]): number[][] {
  const n = centered.length;
  const d = centered[0].length;
  const cov = Array.from({ length: d }, () => new Array(d).fill(0));

  for (const v of centered) {
    for (let i = 0; i < d; i++) {
      for (let j = i; j < d; j++) {
        cov[i][j] += v[i] * v[j];
      }
    }
  }
  for (let i = 0; i < d; i++) {
    for (let j = i; j < d; j++) {
      cov[i][j] /= n - 1;
      cov[j][i] = cov[i][j];
    }
  }
  return cov;
}

function matVec(mat: number[][], vec: number[]): number[] {
  return mat.map((row) => row.reduce((sum, v, i) => sum + v * vec[i], 0));
}

function normalize(vec: number[]): number[] {
  const norm = Math.sqrt(vec.reduce((s, x) => s + x * x, 0)) || 1;
  return vec.map((x) => x / norm);
}

function dot(a: number[], b: number[]): number {
  return a.reduce((s, x, i) => s + x * b[i], 0);
}

// Power iteration to find the dominant eigenvector, then deflate and repeat.
function topEigenvectors(cov: number[][], k: number, iterations = 100): number[][] {
  const d = cov.length;
  const workingCov = cov.map((row) => [...row]);
  const eigenvectors: number[][] = [];

  for (let comp = 0; comp < k; comp++) {
    let vec = normalize(Array.from({ length: d }, () => Math.random() - 0.5));

    for (let iter = 0; iter < iterations; iter++) {
      vec = normalize(matVec(workingCov, vec));
    }

    eigenvectors.push(vec);

    // Deflate: remove this component's contribution before finding the next one.
    const eigenvalue = dot(matVec(workingCov, vec), vec);
    for (let i = 0; i < d; i++) {
      for (let j = 0; j < d; j++) {
        workingCov[i][j] -= eigenvalue * vec[i] * vec[j];
      }
    }
  }

  return eigenvectors;
}

export function computePCA3D(points: DataPoint[]): ProjectedPoint[] {
  const vectors = points.map((p) => p.vector);
  const d = vectors[0].length;

  // With fewer than 3 dimensions, pad rather than crash.
  const k = Math.min(3, d);
  const m = mean(vectors);
  const centered = subtractMean(vectors, m);
  const cov = covarianceMatrix(centered);
  const eigenvectors = topEigenvectors(cov, k);

  const projected = centered.map((v) => eigenvectors.map((e) => dot(v, e)));

  // Normalize to a comfortable viewing range for the 3D scene.
  const flat = projected.flat();
  const maxAbs = Math.max(...flat.map(Math.abs), 1e-6);
  const scale = 8 / maxAbs;

  return points.map((p, idx) => ({
    id: p.id,
    x: (projected[idx][0] ?? 0) * scale,
    y: (projected[idx][1] ?? 0) * scale,
    z: (projected[idx][2] ?? 0) * scale,
  }));
}

// Cosine similarity nearest-neighbor search on the ORIGINAL high-dim vectors
// (more accurate than searching in the 3D-reduced space).
export function findNearestNeighbors(
  target: DataPoint,
  allPoints: DataPoint[],
  count = 10
): { point: DataPoint; similarity: number }[] {
  const targetNorm = Math.sqrt(target.vector.reduce((s, x) => s + x * x, 0)) || 1;

  const scored = allPoints
    .filter((p) => p.id !== target.id)
    .map((p) => {
      const pNorm = Math.sqrt(p.vector.reduce((s, x) => s + x * x, 0)) || 1;
      const dotProd = target.vector.reduce((s, x, i) => s + x * (p.vector[i] ?? 0), 0);
      return { point: p, similarity: dotProd / (targetNorm * pNorm) };
    });

  return scored.sort((a, b) => b.similarity - a.similarity).slice(0, count);
}

export function computeExplainedVariance(points: DataPoint[]): number[] {
  const vectors = points.map((p) => p.vector);
  const d = vectors[0].length;
  const k = Math.min(3, d);

  const m = mean(vectors);
  const centered = subtractMean(vectors, m);
  const cov = covarianceMatrix(centered);
  const totalVariance = cov.reduce((sum, row, i) => sum + row[i], 0);

  const eigenvectors = topEigenvectors(cov, k);
  const eigenvalues = eigenvectors.map((vec) => dot(matVec(cov, vec), vec));

  return eigenvalues.map((ev) => (totalVariance > 0 ? ev / totalVariance : 0));
}
