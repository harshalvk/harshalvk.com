import type { Point, RegressionStep } from '@/modules/theia/types/ml-algorithm';

export function randomLinearPoints(n = 25, noise = 15): Point[] {
  const trueSlope = Math.random() * 2 + 0.3;
  const trueIntercept = Math.random() * 20;

  return Array.from({ length: n }, (_, i) => {
    const x = (i / n) * 100;
    const y = trueSlope * x + trueIntercept + (Math.random() - 0.5) * noise * 2;
    return { x, y: Math.max(0, y) };
  });
}

function computeLoss(points: Point[], slope: number, intercept: number) {
  const n = points.length;
  const sumSq = points.reduce((acc, p) => {
    const pred = slope * p.x + intercept;
    return acc + (p.y - pred) ** 2;
  }, 0);
  return sumSq / n;
}

export function gradientDescentSteps(
  points: Point[],
  learningRate = 0.0001,
  iterations = 60
): RegressionStep[] {
  const steps: RegressionStep[] = [];
  let slope = 0;
  let intercept = 0;
  const n = points.length;

  steps.push({
    points,
    slope,
    intercept,
    loss: computeLoss(points, slope, intercept),
    description: 'Start: line initialized at slope 0, intercept 0. Will adjust to minimize error.',
    iteration: 0,
  });

  for (let iter = 1; iter <= iterations; iter++) {
    let slopeGrad = 0;
    let interceptGrad = 0;

    for (const p of points) {
      const pred = slope * p.x + intercept;
      const error = pred - p.y;
      slopeGrad += error * p.x;
      interceptGrad += error;
    }

    slopeGrad = (2 / n) * slopeGrad;
    interceptGrad = (2 / n) * interceptGrad;

    slope -= learningRate * slopeGrad;
    intercept -= learningRate * interceptGrad;

    const loss = computeLoss(points, slope, intercept);

    steps.push({
      points,
      slope,
      intercept,
      loss,
      description: `Iteration ${iter}: adjusted slope to ${slope.toFixed(3)}, intercept to ${intercept.toFixed(2)}. Loss (MSE): ${loss.toFixed(2)}.`,
      iteration: iter,
    });
  }

  steps.push({
    ...steps[steps.length - 1],
    description: `Converged after ${iterations} iterations. Final line: y = ${slope.toFixed(3)}x + ${intercept.toFixed(2)}.`,
  });

  return steps;
}
