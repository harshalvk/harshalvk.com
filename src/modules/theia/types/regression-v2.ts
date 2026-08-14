export type RegressionPoint = { x: number; y: number };

export type RegressionPhase = 'predict' | 'error' | 'gradient' | 'update';

export type GradientStep = {
  iteration: number;
  phase: RegressionPhase;
  slope: number;
  intercept: number;
  points: RegressionPoint[];
  focusIndex: number; // which point is used to illustrate the math this step
  predicted: number; // ŷ for the focus point
  error: number; // y - ŷ for the focus point
  loss: number; // MSE across ALL points, at current (slope, intercept)
  slopeGradient: number; // ∂MSE/∂m, computed across all points
  interceptGradient: number; // ∂MSE/∂b, computed across all points
  newSlope: number;
  newIntercept: number;
  learningRate: number;
  description: string;
};
