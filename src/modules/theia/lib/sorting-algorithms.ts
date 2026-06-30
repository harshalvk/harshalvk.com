import { ArrayStep, StepStatus } from '../types/algorithm';

function snap(
  arr: number[],
  highlights: Record<number, StepStatus>,
  description: string,
  comparisons: number,
  swaps: number,
  line?: number
): ArrayStep {
  return { array: [...arr], highlights: { ...highlights }, description, comparisons, swaps, line };
}

export function bubbleSortSteps(input: number[]): ArrayStep[] {
  const arr = [...input];
  const steps: ArrayStep[] = [];
  let comparisons = 0;
  let swaps = 0;
  const n = arr.length;

  steps.push(snap(arr, {}, 'Start: unsorted array.', 0, 0, 2));

  for (let i = 0; i < n - 1; i++) {
    steps.push(snap(arr, {}, `Outer pass ${i + 1} of ${n - 1}.`, comparisons, swaps, 3));

    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      steps.push(
        snap(
          arr,
          { [j]: 'comparing', [j + 1]: 'comparing' },
          `Comparing index ${j} (${arr[j]}) with index ${j + 1} (${arr[j + 1]}).`,
          comparisons,
          swaps,
          5
        )
      );

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swaps++;
        steps.push(
          snap(
            arr,
            { [j]: 'swapping', [j + 1]: 'swapping' },
            `${arr[j + 1]} > ${arr[j]} is false now — swapped, since left was bigger.`,
            comparisons,
            swaps,
            6
          )
        );
      }
    }
    steps.push(
      snap(
        arr,
        { [n - 1 - i]: 'sorted' },
        `Index ${n - 1 - i} is now in its final sorted position.`,
        comparisons,
        swaps,
        9
      )
    );
  }

  const sortedAll: Record<number, StepStatus> = {};
  arr.forEach((_, idx) => (sortedAll[idx] = 'sorted'));
  steps.push(snap(arr, sortedAll, 'Array fully sorted.', comparisons, swaps, 11));

  return steps;
}

export function selectionSortSteps(input: number[]): ArrayStep[] {
  const arr = [...input];
  const steps: ArrayStep[] = [];
  let comparisons = 0;
  let swaps = 0;
  const n = arr.length;

  steps.push(snap(arr, {}, 'Start: unsorted array.', 0, 0, 2));

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    steps.push(
      snap(
        arr,
        { [i]: 'active' },
        `Assume index ${i} (${arr[i]}) is the smallest in the remaining unsorted part.`,
        comparisons,
        swaps,
        4
      )
    );

    for (let j = i + 1; j < n; j++) {
      comparisons++;
      steps.push(
        snap(
          arr,
          { [minIdx]: 'pivot', [j]: 'comparing' },
          `Comparing current minimum (${arr[minIdx]}) with index ${j} (${arr[j]}).`,
          comparisons,
          swaps,
          6
        )
      );

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        steps.push(
          snap(
            arr,
            { [minIdx]: 'pivot' },
            `New minimum found: index ${minIdx} (${arr[minIdx]}).`,
            comparisons,
            swaps,
            7
          )
        );
      }
    }

    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      swaps++;
      steps.push(
        snap(
          arr,
          { [i]: 'swapping', [minIdx]: 'swapping' },
          `Swapping index ${i} with index ${minIdx} to place smallest value.`,
          comparisons,
          swaps,
          11
        )
      );
    }

    steps.push(
      snap(arr, { [i]: 'sorted' }, `Index ${i} locked in as sorted.`, comparisons, swaps, 13)
    );
  }

  const sortedAll: Record<number, StepStatus> = {};
  arr.forEach((_, idx) => (sortedAll[idx] = 'sorted'));
  steps.push(snap(arr, sortedAll, 'Array fully sorted.', comparisons, swaps, 15));

  return steps;
}

export const generators = {
  'bubble-sort': bubbleSortSteps,
  'selection-sort': selectionSortSteps,
  // 'insertion-sort': insertionSortSteps,
  // 'merge-sort': mergeSortSteps,
  // 'quick-sort': quickSortSteps,
  // 'heap-sort': heapSortSteps,
  // 'counting-sort': countingSortSteps,
  // 'radix-sort': radixSortSteps,
  // 'shell-sort': shellSortSteps,
  // 'bucket-sort': bucketSortSteps,
  // 'tim-sort': timSortSteps,
  // 'intro-sort': introSortSteps,
  // 'bitonic-sort': bitonicSortSteps,
};
