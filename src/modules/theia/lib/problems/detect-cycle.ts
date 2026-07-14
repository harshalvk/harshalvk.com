import type { LinkedListStep } from '@/modules/theia/types/linked-list';
import { buildLinkedList } from '@/modules/theia/lib/linked-list-engine';

export function detectCycleSteps(
  values: number[] = [10, 25, 7, 42, 18],
  cycleBackToIndex = 2
): LinkedListStep[] {
  const nodes = buildLinkedList(values);
  const steps: LinkedListStep[] = [];
  const n = nodes.length;

  steps.push({
    nodes,
    highlights: {},
    description: `Using Floyd's cycle detection (tortoise & hare): slow moves 1 step, fast moves 2 steps. This list has a cycle back to index ${cycleBackToIndex}.`,
  });

  const nextIdx = (i: number) => (i + 1 < n ? i + 1 : cycleBackToIndex);

  let slow = 0,
    fast = 0;
  let iteration = 0;
  const maxIterations = n * 3;

  while (iteration < maxIterations) {
    slow = nextIdx(slow);
    fast = nextIdx(nextIdx(fast));
    iteration++;

    steps.push({
      nodes,
      highlights: { [nodes[slow].id]: 'active', [nodes[fast].id]: 'comparing' },
      description: `Slow at ${nodes[slow].value} (index ${slow}), fast at ${nodes[fast].value} (index ${fast}).`,
      pointerLabel: [
        { nodeId: nodes[slow].id, label: 'slow' },
        { nodeId: nodes[fast].id, label: 'fast' },
      ],
    });

    if (slow === fast) {
      steps.push({
        nodes,
        highlights: { [nodes[slow].id]: 'found' },
        description: `Slow and fast met at node ${nodes[slow].value} — a cycle is confirmed!`,
        pointerLabel: [{ nodeId: nodes[slow].id, label: 'meeting point' }],
      });
      return steps;
    }
  }

  steps.push({
    nodes,
    highlights: {},
    description: 'Fast pointer reached the end without meeting slow — no cycle.',
  });
  return steps;
}
