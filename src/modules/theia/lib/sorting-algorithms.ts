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

function rangeHighlight(lo: number, hi: number, status: StepStatus): Record<number, StepStatus> {
  const highlights: Record<number, StepStatus> = {};
  for (let i = lo; i <= hi; i++) {
    highlights[i] = status;
  }
  return highlights;
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

// src/modules/theia/lib/sorting-algorithms.ts — append these to existing file

// ── Insertion Sort (update existing) ───────────────────────────────────────

export function insertionSortSteps(input: number[]): ArrayStep[] {
  const arr = [...input];
  const steps: ArrayStep[] = [];
  let comparisons = 0;
  let swaps = 0;

  steps.push(snap(arr, {}, 'Start: unsorted array.', 0, 0, 2));

  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    steps.push(
      snap(
        arr,
        { [i]: 'active' },
        `Key at index ${i} is ${key}. Inserting into sorted portion [0..${i - 1}].`,
        comparisons,
        swaps,
        4
      )
    );

    let j = i - 1;
    while (j >= 0) {
      comparisons++;
      steps.push(
        snap(
          arr,
          { [j]: 'comparing', [i]: 'active' },
          `Comparing ${key} with ${arr[j]} at index ${j}.`,
          comparisons,
          swaps,
          6
        )
      );

      if (arr[j] > key) {
        arr[j + 1] = arr[j];
        swaps++;
        steps.push(
          snap(
            arr,
            { [j]: 'swapping', [j + 1]: 'swapping' },
            `${arr[j]} > ${key}, shift ${arr[j]} right.`,
            comparisons,
            swaps,
            7
          )
        );
        j--;
      } else {
        break;
      }
    }
    arr[j + 1] = key;
    steps.push(
      snap(arr, { [j + 1]: 'sorted' }, `${key} inserted at index ${j + 1}.`, comparisons, swaps, 12)
    );
  }

  const sortedAll: Record<number, StepStatus> = {};
  arr.forEach((_, idx) => (sortedAll[idx] = 'sorted'));
  steps.push(snap(arr, sortedAll, 'Array fully sorted.', comparisons, swaps, 15));

  return steps;
}

// ── Merge Sort ─────────────────────────────────────────────────────────────

export function mergeSortSteps(input: number[]): ArrayStep[] {
  const arr = [...input];
  const steps: ArrayStep[] = [];
  let comparisons = 0;

  steps.push(snap(arr, {}, 'Start: will divide and conquer via merge sort.', 0, 0, 2));

  function merge(lo: number, mid: number, hi: number) {
    const left = arr.slice(lo, mid + 1);
    const right = arr.slice(mid + 1, hi + 1);
    let i = 0,
      j = 0,
      k = lo;

    steps.push(
      snap(
        arr,
        rangeHighlight(lo, hi, 'active'),
        `Merging [${lo}..${mid}] and [${mid + 1}..${hi}].`,
        comparisons,
        0,
        8
      )
    );

    while (i < left.length && j < right.length) {
      comparisons++;
      if (left[i] <= right[j]) {
        arr[k++] = left[i++];
      } else {
        arr[k++] = right[j++];
      }
    }
    while (i < left.length) arr[k++] = left[i++];
    while (j < right.length) arr[k++] = right[j++];

    steps.push(
      snap(arr, rangeHighlight(lo, hi, 'sorted'), `Merged [${lo}..${hi}].`, comparisons, 0, 19)
    );
  }

  function sort(lo: number, hi: number) {
    if (lo >= hi) return;
    const mid = Math.floor((lo + hi) / 2);
    sort(lo, mid);
    sort(mid + 1, hi);
    merge(lo, mid, hi);
  }

  sort(0, arr.length - 1);

  const sortedAll: Record<number, StepStatus> = {};
  arr.forEach((_, idx) => (sortedAll[idx] = 'sorted'));
  steps.push(snap(arr, sortedAll, 'Array fully sorted.', comparisons, 0, 24));

  return steps;
}

// ── Quick Sort (update existing) ──────────────────────────────────────────

export function quickSortSteps(input: number[]): ArrayStep[] {
  const arr = [...input];
  const steps: ArrayStep[] = [];
  let comparisons = 0;
  let swaps = 0;

  steps.push(snap(arr, {}, 'Start: quicksort via divide and conquer.', 0, 0, 2));

  function partition(lo: number, hi: number) {
    const pivot = arr[hi];
    steps.push(
      snap(arr, { [hi]: 'pivot' }, `Pivot: index ${hi} (${pivot}).`, comparisons, swaps, 7)
    );
    let i = lo - 1;

    for (let j = lo; j < hi; j++) {
      comparisons++;
      steps.push(
        snap(
          arr,
          { [j]: 'comparing', [hi]: 'pivot' },
          `Comparing ${arr[j]} with pivot ${pivot}.`,
          comparisons,
          swaps,
          10
        )
      );
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        swaps++;
        steps.push(
          snap(
            arr,
            { [i]: 'swapping', [j]: 'swapping' },
            `${arr[j]} < pivot, swap into place.`,
            comparisons,
            swaps,
            12
          )
        );
      }
    }
    [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]];
    swaps++;
    steps.push(
      snap(arr, { [i + 1]: 'sorted' }, `Pivot placed at index ${i + 1}.`, comparisons, swaps, 15)
    );
    return i + 1;
  }

  function sort(lo: number, hi: number) {
    if (lo < hi) {
      const p = partition(lo, hi);
      sort(lo, p - 1);
      sort(p + 1, hi);
    }
  }

  sort(0, arr.length - 1);

  const sortedAll: Record<number, StepStatus> = {};
  arr.forEach((_, idx) => (sortedAll[idx] = 'sorted'));
  steps.push(snap(arr, sortedAll, 'Array fully sorted.', comparisons, swaps, 28));

  return steps;
}

// ── Heap Sort (update existing with lines) ────────────────────────────────

export function heapSortSteps(input: number[]): ArrayStep[] {
  const arr = [...input];
  const steps: ArrayStep[] = [];
  let comparisons = 0;
  let swaps = 0;
  const n = arr.length;

  steps.push(snap(arr, {}, 'Start: building max heap.', 0, 0, 2));

  function heapify(size: number, i: number) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < size) {
      comparisons++;
      steps.push(
        snap(
          arr,
          { [largest]: 'pivot', [left]: 'comparing' },
          `Comparing ${arr[largest]} with left child ${arr[left]}.`,
          comparisons,
          swaps,
          7
        )
      );
      if (arr[left] > arr[largest]) largest = left;
    }
    if (right < size) {
      comparisons++;
      steps.push(
        snap(
          arr,
          { [largest]: 'pivot', [right]: 'comparing' },
          `Comparing ${arr[largest]} with right child ${arr[right]}.`,
          comparisons,
          swaps,
          11
        )
      );
      if (arr[right] > arr[largest]) largest = right;
    }

    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      swaps++;
      steps.push(
        snap(
          arr,
          { [i]: 'swapping', [largest]: 'swapping' },
          `Swapped to maintain heap.`,
          comparisons,
          swaps,
          16
        )
      );
      heapify(size, largest);
    }
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i);
  }
  steps.push(snap(arr, {}, 'Max heap built.', comparisons, swaps, 21));

  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    swaps++;
    steps.push(
      snap(
        arr,
        { 0: 'swapping', [i]: 'sorted' },
        `Largest element moved to end (index ${i}).`,
        comparisons,
        swaps,
        25
      )
    );
    heapify(i, 0);
  }

  const sortedAll: Record<number, StepStatus> = {};
  arr.forEach((_, idx) => (sortedAll[idx] = 'sorted'));
  steps.push(snap(arr, sortedAll, 'Array fully sorted.', comparisons, swaps, 29));

  return steps;
}

// ── Counting Sort (update with lines) ──────────────────────────────────────

export function countingSortSteps(input: number[]): ArrayStep[] {
  const arr = [...input];
  const steps: ArrayStep[] = [];
  const n = arr.length;
  const max = Math.max(...arr);
  const min = Math.min(...arr);
  const range = max - min + 1;
  const count = new Array(range).fill(0);

  steps.push(snap(arr, {}, `Start: counting frequencies (range ${min}..${max}).`, 0, 0, 3));

  for (let i = 0; i < n; i++) {
    count[arr[i] - min]++;
    steps.push(snap(arr, { [i]: 'comparing' }, `Counting ${arr[i]}.`, 0, 0, 6));
  }

  for (let i = 1; i < range; i++) {
    count[i] += count[i - 1];
  }
  steps.push(snap(arr, {}, 'Cumulative counts computed.', 0, 0, 11));

  const output = new Array(n);
  for (let i = n - 1; i >= 0; i--) {
    output[count[arr[i] - min] - 1] = arr[i];
    count[arr[i] - min]--;
  }

  for (let i = 0; i < n; i++) {
    arr[i] = output[i];
    const placed: Record<number, StepStatus> = {};
    for (let k = 0; k <= i; k++) placed[k] = 'sorted';
    steps.push(snap(arr, placed, `Placing ${arr[i]} at index ${i}.`, 0, 0, 19));
  }

  return steps;
}

// ── Radix Sort (update with lines) ────────────────────────────────────────

export function radixSortSteps(input: number[]): ArrayStep[] {
  const arr = [...input];
  const steps: ArrayStep[] = [];
  const max = Math.max(...arr);

  steps.push(snap(arr, {}, 'Start: sorting by digits, least to most significant.', 0, 0, 2));

  function countingSortByDigit(exp: number) {
    const n = arr.length;
    const output = new Array(n).fill(0);
    const count = new Array(10).fill(0);

    for (let i = 0; i < n; i++) {
      count[Math.floor(arr[i] / exp) % 10]++;
    }
    for (let i = 1; i < 10; i++) count[i] += count[i - 1];

    for (let i = n - 1; i >= 0; i--) {
      output[count[Math.floor(arr[i] / exp) % 10] - 1] = arr[i];
      count[Math.floor(arr[i] / exp) % 10]--;
    }

    for (let i = 0; i < n; i++) arr[i] = output[i];

    const place = exp === 1 ? 'ones' : `10^${Math.log10(exp)}`;
    steps.push(snap(arr, {}, `Sorted by ${place} place.`, 0, 0, 17));
  }

  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    countingSortByDigit(exp);
  }

  const sortedAll: Record<number, StepStatus> = {};
  arr.forEach((_, idx) => (sortedAll[idx] = 'sorted'));
  steps.push(snap(arr, sortedAll, 'Array fully sorted.', 0, 0, 23));

  return steps;
}

// ── Shell Sort (update with lines) ────────────────────────────────────────

export function shellSortSteps(input: number[]): ArrayStep[] {
  const arr = [...input];
  const steps: ArrayStep[] = [];
  let comparisons = 0;
  let swaps = 0;
  const n = arr.length;

  steps.push(snap(arr, {}, 'Start: shell sort with shrinking gap.', 0, 0, 2));

  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    steps.push(
      snap(arr, {}, `Gap: ${gap}. Comparing elements ${gap} apart.`, comparisons, swaps, 5)
    );

    for (let i = gap; i < n; i++) {
      const temp = arr[i];
      let j = i;

      while (j >= gap) {
        comparisons++;
        steps.push(
          snap(
            arr,
            { [j - gap]: 'comparing', [j]: 'comparing' },
            `Compare ${arr[j - gap]} with ${temp}.`,
            comparisons,
            swaps,
            9
          )
        );

        if (arr[j - gap] > temp) {
          arr[j] = arr[j - gap];
          swaps++;
          steps.push(
            snap(
              arr,
              { [j]: 'swapping' },
              `Shift ${arr[j]} right by ${gap}.`,
              comparisons,
              swaps,
              12
            )
          );
          j -= gap;
        } else {
          break;
        }
      }
      arr[j] = temp;
    }
  }

  const sortedAll: Record<number, StepStatus> = {};
  arr.forEach((_, idx) => (sortedAll[idx] = 'sorted'));
  steps.push(snap(arr, sortedAll, 'Array fully sorted.', comparisons, swaps, 24));

  return steps;
}

// ── Bucket Sort (update with lines) ────────────────────────────────────────

export function bucketSortSteps(input: number[]): ArrayStep[] {
  const arr = [...input];
  const steps: ArrayStep[] = [];
  const n = arr.length;
  const max = Math.max(...arr);
  const min = Math.min(...arr);
  const bucketCount = Math.max(1, Math.floor(Math.sqrt(n)));
  const bucketSize = (max - min + 1) / bucketCount;
  const buckets: number[][] = Array.from({ length: bucketCount }, () => []);

  steps.push(snap(arr, {}, `Start: distribute into ${bucketCount} buckets.`, 0, 0, 3));

  for (let i = 0; i < n; i++) {
    const idx = Math.min(bucketCount - 1, Math.floor((arr[i] - min) / bucketSize));
    buckets[idx].push(arr[i]);
    steps.push(snap(arr, { [i]: 'comparing' }, `Place ${arr[i]} into bucket ${idx}.`, 0, 0, 8));
  }

  buckets.forEach((bucket) => bucket.sort((a, b) => a - b));
  steps.push(snap(arr, {}, 'Each bucket sorted.', 0, 0, 12));

  let k = 0;
  for (const bucket of buckets) {
    for (const val of bucket) {
      arr[k] = val;
      const placed: Record<number, StepStatus> = {};
      for (let i = 0; i <= k; i++) placed[i] = 'sorted';
      steps.push(snap(arr, placed, `Place ${val} at final index ${k}.`, 0, 0, 18));
      k++;
    }
  }

  return steps;
}

// ── Tim Sort (update with lines) ──────────────────────────────────────────

export function timSortSteps(input: number[]): ArrayStep[] {
  const arr = [...input];
  const steps: ArrayStep[] = [];
  const n = arr.length;
  const RUN = 8;

  steps.push(snap(arr, {}, `Start: divide into runs of ${RUN}, sort each.`, 0, 0, 2));

  function insertionSortRange(lo: number, hi: number) {
    for (let i = lo + 1; i <= hi; i++) {
      const key = arr[i];
      let j = i - 1;
      while (j >= lo && arr[j] > key) {
        arr[j + 1] = arr[j];
        j--;
      }
      arr[j + 1] = key;
    }
    steps.push(snap(arr, rangeHighlight(lo, hi, 'sorted'), `Run [${lo}..${hi}] sorted.`, 0, 0, 13));
  }

  for (let i = 0; i < n; i += RUN) {
    insertionSortRange(i, Math.min(i + RUN - 1, n - 1));
  }

  function merge(lo: number, mid: number, hi: number) {
    const left = arr.slice(lo, mid + 1);
    const right = arr.slice(mid + 1, hi + 1);
    let i = 0,
      j = 0,
      k = lo;

    steps.push(
      snap(
        arr,
        rangeHighlight(lo, hi, 'active'),
        `Merging [${lo}..${mid}] & [${mid + 1}..${hi}].`,
        0,
        0,
        18
      )
    );

    while (i < left.length && j < right.length) {
      arr[k++] = left[i] <= right[j] ? left[i++] : right[j++];
    }
    while (i < left.length) arr[k++] = left[i++];
    while (j < right.length) arr[k++] = right[j++];

    steps.push(snap(arr, rangeHighlight(lo, hi, 'sorted'), `Merged [${lo}..${hi}].`, 0, 0, 25));
  }

  let size = RUN;
  while (size < n) {
    for (let lo = 0; lo < n; lo += 2 * size) {
      const mid = Math.min(lo + size - 1, n - 1);
      const hi = Math.min(lo + 2 * size - 1, n - 1);
      if (mid < hi) merge(lo, mid, hi);
    }
    size *= 2;
  }

  return steps;
}

// ── Intro Sort (update with lines) ────────────────────────────────────────

export function introSortSteps(input: number[]): ArrayStep[] {
  const arr = [...input];
  const steps: ArrayStep[] = [];
  let comparisons = 0;
  let swaps = 0;
  const SIZE_THRESHOLD = 8;

  steps.push(snap(arr, {}, 'Start: intro sort (quicksort + insertion fallback).', 0, 0, 2));

  function insertionSortRange(lo: number, hi: number) {
    for (let i = lo + 1; i <= hi; i++) {
      const key = arr[i];
      let j = i - 1;
      while (j >= lo && arr[j] > key) {
        comparisons++;
        arr[j + 1] = arr[j];
        swaps++;
        j--;
      }
      arr[j + 1] = key;
    }
    steps.push(
      snap(
        arr,
        rangeHighlight(lo, hi, 'sorted'),
        `Small range [${lo}..${hi}] sorted.`,
        comparisons,
        swaps,
        14
      )
    );
  }

  function partition(lo: number, hi: number) {
    const pivot = arr[hi];
    steps.push(snap(arr, { [hi]: 'pivot' }, `Pivot: ${pivot}.`, comparisons, swaps, 18));
    let i = lo - 1;

    for (let j = lo; j < hi; j++) {
      comparisons++;
      steps.push(
        snap(
          arr,
          { [j]: 'comparing', [hi]: 'pivot' },
          `Compare ${arr[j]} with ${pivot}.`,
          comparisons,
          swaps,
          23
        )
      );
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        swaps++;
        steps.push(
          snap(
            arr,
            { [i]: 'swapping', [j]: 'swapping' },
            `Swap into place.`,
            comparisons,
            swaps,
            27
          )
        );
      }
    }
    [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]];
    swaps++;
    steps.push(snap(arr, { [i + 1]: 'sorted' }, `Pivot at ${i + 1}.`, comparisons, swaps, 31));
    return i + 1;
  }

  function sort(lo: number, hi: number) {
    if (lo >= hi) return;
    if (hi - lo + 1 <= SIZE_THRESHOLD) {
      insertionSortRange(lo, hi);
      return;
    }
    const p = partition(lo, hi);
    sort(lo, p - 1);
    sort(p + 1, hi);
  }

  sort(0, arr.length - 1);

  const sortedAll: Record<number, StepStatus> = {};
  arr.forEach((_, idx) => (sortedAll[idx] = 'sorted'));
  steps.push(snap(arr, sortedAll, 'Array fully sorted.', comparisons, swaps, 46));

  return steps;
}

// ── Bitonic Sort (update with lines) ──────────────────────────────────────

export function bitonicSortSteps(input: number[]): ArrayStep[] {
  let arr = [...input];
  const steps: ArrayStep[] = [];
  const originalLength = arr.length;

  let n = 1;
  while (n < arr.length) n *= 2;
  const padded = n !== arr.length;
  while (arr.length < n) arr.push(Infinity);

  steps.push(
    snap(
      arr.map((v) => (v === Infinity ? 0 : v)),
      {},
      padded ? `Start: padding to power-of-2 (${n}).` : 'Start: bitonic sort.',
      0,
      0,
      2
    )
  );

  function compareAndSwap(i: number, j: number, dir: boolean) {
    const shouldSwap = dir ? arr[i] > arr[j] : arr[i] < arr[j];
    steps.push(
      snap(
        arr.map((v) => (v === Infinity ? 0 : v)),
        { [i]: 'comparing', [j]: 'comparing' },
        `Compare [${i}] & [${j}] (dir: ${dir ? 'asc' : 'desc'}).`,
        0,
        0,
        6
      )
    );

    if (shouldSwap) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      steps.push(
        snap(
          arr.map((v) => (v === Infinity ? 0 : v)),
          { [i]: 'swapping', [j]: 'swapping' },
          `Swapped.`,
          0,
          0,
          10
        )
      );
    }
  }

  function merge(lo: number, cnt: number, dir: boolean) {
    if (cnt > 1) {
      const k = Math.floor(cnt / 2);
      for (let i = lo; i < lo + k; i++) {
        compareAndSwap(i, i + k, dir);
      }
      merge(lo, k, dir);
      merge(lo + k, k, dir);
    }
  }

  function bitonicSort(lo: number, cnt: number, dir: boolean) {
    if (cnt > 1) {
      const k = Math.floor(cnt / 2);
      bitonicSort(lo, k, true);
      bitonicSort(lo + k, k, false);
      merge(lo, cnt, dir);
      steps.push(
        snap(
          arr.map((v) => (v === Infinity ? 0 : v)),
          rangeHighlight(lo, lo + cnt - 1, 'active'),
          `Bitonic block [${lo}..${lo + cnt - 1}] merged.`,
          0,
          0,
          23
        )
      );
    }
  }

  bitonicSort(0, n, true);

  const finalArr = arr.slice(0, originalLength);
  const sortedAll: Record<number, StepStatus> = {};
  finalArr.forEach((_, idx) => (sortedAll[idx] = 'sorted'));
  steps.push(snap(finalArr, sortedAll, 'Sorted (padding removed).', 0, 0, 27));

  return steps;
}

export const generators = {
  'bubble-sort': bubbleSortSteps,
  'selection-sort': selectionSortSteps,
  'insertion-sort': insertionSortSteps,
  'merge-sort': mergeSortSteps,
  'quick-sort': quickSortSteps,
  'heap-sort': heapSortSteps,
  'counting-sort': countingSortSteps,
  'radix-sort': radixSortSteps,
  'shell-sort': shellSortSteps,
  'bucket-sort': bucketSortSteps,
  'tim-sort': timSortSteps,
  'intro-sort': introSortSteps,
  'bitonic-sort': bitonicSortSteps,
};
