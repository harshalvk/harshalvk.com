'use client';

import { motion, AnimatePresence } from 'motion/react';
import { Badge } from '@/components/ui/badge';
import { MorphingNumber } from './morphing-number';
import type { GradientStep } from '@/modules/theia/types/regression-v2';

const WIDTH = 600;
const HEIGHT = 380;
const PAD = 40;

const PHASE_LABEL: Record<GradientStep['phase'], string> = {
  predict: 'Predict',
  error: 'Measure Error',
  gradient: 'Compute Gradient',
  update: 'Update Parameters',
};

export function RegressionCanvas({ step }: { step: GradientStep }) {
  const { points, slope, intercept, focusIndex, phase } = step;

  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const xMin = Math.min(...xs),
    xMax = Math.max(...xs);
  const yMin = 0,
    yMax = Math.max(...ys) * 1.15;

  const toSvgX = (x: number) => PAD + ((x - xMin) / (xMax - xMin || 1)) * (WIDTH - PAD * 2);
  const toSvgY = (y: number) =>
    HEIGHT - PAD - ((y - yMin) / (yMax - yMin || 1)) * (HEIGHT - PAD * 2);

  const lineY1 = slope * xMin + intercept;
  const lineY2 = slope * xMax + intercept;

  const focusPoint = points[focusIndex];
  const focusPredictedY = slope * focusPoint.x + intercept;

  return (
    <div className="bg-surface inset-ring-border/64 relative flex h-[620px] w-full flex-col overflow-hidden rounded-xl inset-ring-1">
      {/* ── Graph ─────────────────────────────────────────────────────── */}
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full flex-1">
        <line
          x1={PAD}
          y1={HEIGHT - PAD}
          x2={WIDTH - PAD}
          y2={HEIGHT - PAD}
          stroke="var(--border)"
          strokeWidth={1}
        />
        <line x1={PAD} y1={PAD} x2={PAD} y2={HEIGHT - PAD} stroke="var(--border)" strokeWidth={1} />

        {points.map((p, idx) => {
          const predY = slope * p.x + intercept;
          return (
            <motion.line
              key={idx}
              x1={toSvgX(p.x)}
              y1={toSvgY(p.y)}
              x2={toSvgX(p.x)}
              animate={{ y2: toSvgY(predY) }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              stroke={idx === focusIndex && phase === 'error' ? '#f59e0b' : 'var(--border)'}
              strokeWidth={idx === focusIndex && phase === 'error' ? 2 : 1}
              strokeDasharray={idx === focusIndex ? undefined : '3 3'}
            />
          );
        })}

        <motion.line
          animate={{ x1: toSvgX(xMin), y1: toSvgY(lineY1), x2: toSvgX(xMax), y2: toSvgY(lineY2) }}
          transition={{ type: 'spring', stiffness: 90, damping: 18 }}
          stroke="var(--primary)"
          strokeWidth={2.5}
        />

        {points.map((p, idx) => (
          <motion.circle
            key={idx}
            cx={toSvgX(p.x)}
            cy={toSvgY(p.y)}
            r={idx === focusIndex ? 6 : 4}
            fill={idx === focusIndex ? '#0ea5e9' : 'var(--muted-foreground)'}
            animate={{ scale: idx === focusIndex ? 1.15 : 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          />
        ))}

        {(phase === 'predict' || phase === 'error') && (
          <motion.circle
            cx={toSvgX(focusPoint.x)}
            animate={{ cy: toSvgY(focusPredictedY) }}
            transition={{ type: 'spring', stiffness: 200, damping: 22 }}
            r={5}
            fill="none"
            stroke="#a855f7"
            strokeWidth={2}
          />
        )}
      </svg>

      {/* ── Equation overlay — part of the same canvas surface ────────── */}
      <div className="bg-background/95 border-t backdrop-blur">
        <EquationPanel step={step} />
      </div>
    </div>
  );
}

function EquationPanel({ step }: { step: GradientStep }) {
  const focusPoint = step.points[step.focusIndex];

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="text-xs">
          Iteration {step.iteration}
        </Badge>
        <Badge variant="secondary" className="text-xs">
          {PHASE_LABEL[step.phase]}
        </Badge>
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={`${step.iteration}-${step.phase}-desc`}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
          className="text-sm leading-relaxed"
        >
          {step.description}
        </motion.p>
      </AnimatePresence>

      <div className="bg-code text-code-foreground flex flex-col gap-2 rounded-lg border p-3 font-mono text-sm">
        {step.phase === 'predict' && (
          <>
            <div className="flex flex-wrap items-center gap-1.5">
              <span>ŷ =</span>
              <MorphingNumber value={step.slope} />
              <span>× {focusPoint.x} +</span>
              <MorphingNumber value={step.intercept} />
            </div>
            <div className="text-primary flex items-center gap-1.5">
              <span>ŷ =</span>
              <MorphingNumber value={step.predicted} />
            </div>
          </>
        )}

        {step.phase === 'error' && (
          <>
            <div className="flex flex-wrap items-center gap-1.5">
              <span>error = {focusPoint.y} −</span>
              <MorphingNumber value={step.predicted} />
              <span>=</span>
              <MorphingNumber value={step.error} className="text-primary" />
            </div>
            <div className="flex items-center gap-1.5">
              <span>MSE (all points) =</span>
              <MorphingNumber value={step.loss} className="text-primary" />
            </div>
          </>
        )}

        {step.phase === 'gradient' && (
          <>
            <div className="flex items-center gap-1.5">
              <span>∂Loss/∂slope =</span>
              <MorphingNumber value={step.slopeGradient} className="text-primary" />
            </div>
            <div className="flex items-center gap-1.5">
              <span>∂Loss/∂intercept =</span>
              <MorphingNumber value={step.interceptGradient} className="text-primary" />
            </div>
          </>
        )}

        {step.phase === 'update' && (
          <>
            <div className="flex flex-wrap items-center gap-1.5">
              <span>slope_new =</span>
              <MorphingNumber value={step.slope} />
              <span>− {step.learningRate} ×</span>
              <MorphingNumber value={step.slopeGradient} />
              <span>=</span>
              <MorphingNumber value={step.newSlope} className="text-primary" />
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span>intercept_new =</span>
              <MorphingNumber value={step.intercept} />
              <span>− {step.learningRate} ×</span>
              <MorphingNumber value={step.interceptGradient} />
              <span>=</span>
              <MorphingNumber value={step.newIntercept} className="text-primary" />
            </div>
          </>
        )}
      </div>

      <div className="text-muted-foreground flex gap-4 font-mono text-xs">
        <span className="flex items-center gap-1">
          slope: <MorphingNumber value={step.slope} decimals={3} />
        </span>
        <span className="flex items-center gap-1">
          intercept: <MorphingNumber value={step.intercept} decimals={3} />
        </span>
        <span className="flex items-center gap-1">
          loss: <MorphingNumber value={step.loss} decimals={3} />
        </span>
      </div>
    </div>
  );
}
