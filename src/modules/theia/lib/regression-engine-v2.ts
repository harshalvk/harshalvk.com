import type { GradientStep, RegressionPoint } from '@/modules/theia/types/regression-v2';

export function randomRegressionPoints(n = 12, noise = 12): RegressionPoint[] {
  const trueSlope = Math.random() * 1.6 + 0.4;
  const trueIntercept = Math.random() * 15 + 5;

  return Array.from({ length: n }, (_, i) => {
    const x = 5 + (i / (n - 1)) * 90;
    const y = trueSlope * x + trueIntercept + (Math.random() - 0.5) * noise * 2;
    return { x: Math.round(x * 10) / 10, y: Math.round(Math.max(0, y) * 10) / 10 };
  });
}

function meanSquaredError(points: RegressionPoint[], slope: number, intercept: number) {
  const sumSq = points.reduce((acc, p) => {
    const pred = slope * p.x + intercept;
    return acc + (p.y - pred) ** 2;
  }, 0);
  return sumSq / points.length;
}

function computeGradients(points: RegressionPoint[], slope: number, intercept: number) {
  const n = points.length;
  let slopeGrad = 0;
  let interceptGrad = 0;

  for (const p of points) {
    const pred = slope * p.x + intercept;
    const error = pred - p.y;
    slopeGrad += error * p.x;
    interceptGrad += error;
  }

  return { slopeGradient: (2 / n) * slopeGrad, interceptGradient: (2 / n) * interceptGrad };
}

const round = (n: number, d = 3) => Math.round(n * 10 ** d) / 10 ** d;

export function gradientDescentDetailedSteps(
  points: RegressionPoint[],
  learningRate = 0.0006,
  iterations = 24
): GradientStep[] {
  const steps: GradientStep[] = [];
  let slope = 0;
  let intercept = 0;

  for (let iter = 1; iter <= iterations; iter++) {
    // Cycle through points so every point gets illustrated over the run.
    const focusIndex = (iter - 1) % points.length;
    const focusPoint = points[focusIndex];

    const predicted = slope * focusPoint.x + intercept;
    const error = focusPoint.y - predicted;
    const loss = meanSquaredError(points, slope, intercept);

    // ── Phase 1: predict ─────────────────────────────────────────────
    steps.push({
      iteration: iter,
      phase: 'predict',
      slope,
      intercept,
      points,
      focusIndex,
      predicted,
      error,
      loss,
      slopeGradient: 0,
      interceptGradient: 0,
      newSlope: slope,
      newIntercept: intercept,
      learningRate,
      description: `Iteration ${iter}: using the current line (slope ${round(slope)}, intercept ${round(intercept)}), predict ŷ for point (${focusPoint.x}, ${focusPoint.y}).`,
    });

    // ── Phase 2: error ───────────────────────────────────────────────
    steps.push({
      iteration: iter,
      phase: 'error',
      slope,
      intercept,
      points,
      focusIndex,
      predicted,
      error,
      loss,
      slopeGradient: 0,
      interceptGradient: 0,
      newSlope: slope,
      newIntercept: intercept,
      learningRate,
      description: `The actual value is ${focusPoint.y}, predicted was ${round(predicted)} — error of ${round(error)}. Averaged across all ${points.length} points, current loss (MSE) is ${round(loss)}.`,
    });

    // ── Phase 3: gradient ────────────────────────────────────────────
    const { slopeGradient, interceptGradient } = computeGradients(points, slope, intercept);

    steps.push({
      iteration: iter,
      phase: 'gradient',
      slope,
      intercept,
      points,
      focusIndex,
      predicted,
      error,
      loss,
      slopeGradient,
      interceptGradient,
      newSlope: slope,
      newIntercept: intercept,
      learningRate,
      description: `Computing the gradient across all points: how much would the loss change if slope or intercept nudged slightly? ∂Loss/∂slope = ${round(slopeGradient)}, ∂Loss/∂intercept = ${round(interceptGradient)}.`,
    });

    // ── Phase 4: update ──────────────────────────────────────────────
    const newSlope = slope - learningRate * slopeGradient;
    const newIntercept = intercept - learningRate * interceptGradient;

    steps.push({
      iteration: iter,
      phase: 'update',
      slope,
      intercept,
      points,
      focusIndex,
      predicted,
      error,
      loss,
      slopeGradient,
      interceptGradient,
      newSlope,
      newIntercept,
      learningRate,
      description: `Step downhill against the gradient: new slope = ${round(slope)} − ${learningRate} × ${round(slopeGradient)} = ${round(newSlope)}. New intercept = ${round(intercept)} − ${learningRate} × ${round(interceptGradient)} = ${round(newIntercept)}.`,
    });

    slope = newSlope;
    intercept = newIntercept;
  }

  const finalLoss = meanSquaredError(points, slope, intercept);
  steps.push({
    iteration: iterations,
    phase: 'update',
    slope,
    intercept,
    points,
    focusIndex: 0,
    predicted: 0,
    error: 0,
    loss: finalLoss,
    slopeGradient: 0,
    interceptGradient: 0,
    newSlope: slope,
    newIntercept: intercept,
    learningRate,
    description: `Done. Final line: y = ${round(slope)}x + ${round(intercept)}. Final loss (MSE): ${round(finalLoss)}.`,
  });

  return steps;
}
