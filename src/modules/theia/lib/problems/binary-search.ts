import type { ArrayStep, StepStatus } from '@/modules/theia/types/algorithm';

function snap(
  arr: number[],
  highlights: Record<number, StepStatus>,
  description: string,
  line?: number
): ArrayStep {
  return { array: [...arr], highlights: { ...highlights }, description, line };
}

export function binarySearchSteps(
  nums: number[] = [2, 5, 8, 12, 16, 23, 38, 45, 56, 72],
  target = 23
): ArrayStep[] {
  const steps: ArrayStep[] = [];
  let lo = 0,
    hi = nums.length - 1;

  steps.push(snap(nums, {}, `Searching for ${target} in a sorted array using binary search.`, 2));

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const range: Record<number, StepStatus> = {};
    for (let i = lo; i <= hi; i++) range[i] = 'active';
    range[mid] = 'pivot';

    steps.push(
      snap(nums, range, `Search space [${lo}..${hi}]. Middle is index ${mid} (${nums[mid]}).`, 5)
    );

    if (nums[mid] === target) {
      steps.push(
        snap(nums, { [mid]: 'found' }, `${nums[mid]} === ${target}. Found at index ${mid}!`, 6)
      );
      return steps;
    } else if (nums[mid] < target) {
      steps.push(
        snap(
          nums,
          { [mid]: 'comparing' },
          `${nums[mid]} < ${target} — target must be in the right half.`,
          8
        )
      );
      lo = mid + 1;
    } else {
      steps.push(
        snap(
          nums,
          { [mid]: 'comparing' },
          `${nums[mid]} > ${target} — target must be in the left half.`,
          10
        )
      );
      hi = mid - 1;
    }
  }

  steps.push(snap(nums, {}, `Search space exhausted — ${target} is not in the array.`, 13));
  return steps;
}
