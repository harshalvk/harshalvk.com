import type { ArrayStep, StepStatus } from '@/modules/theia/types/algorithm';

function snap(
  arr: number[],
  highlights: Record<number, StepStatus>,
  description: string,
  line?: number
): ArrayStep {
  return { array: [...arr], highlights: { ...highlights }, description, line };
}

export function twoSumSteps(nums: number[] = [2, 7, 11, 15, 3, 6], target = 9): ArrayStep[] {
  const steps: ArrayStep[] = [];
  const seen = new Map<number, number>();

  steps.push(
    snap(
      nums,
      {},
      `Looking for two numbers that add up to ${target}, using a hash map for O(n) lookup.`,
      2
    )
  );

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    steps.push(
      snap(
        nums,
        { [i]: 'active' },
        `Checking index ${i} (${nums[i]}). Complement needed: ${target} - ${nums[i]} = ${complement}.`,
        5
      )
    );

    if (seen.has(complement)) {
      const matchIdx = seen.get(complement)!;
      steps.push(
        snap(
          nums,
          { [i]: 'found', [matchIdx]: 'found' },
          `${complement} was already seen at index ${matchIdx}! Found the pair: [${matchIdx}, ${i}].`,
          6
        )
      );
      return steps;
    }

    seen.set(nums[i], i);
    steps.push(
      snap(
        nums,
        { [i]: 'comparing' },
        `${nums[i]} not found yet — storing it in the map at index ${i}.`,
        9
      )
    );
  }

  steps.push(snap(nums, {}, 'No pair found that sums to the target.', 12));
  return steps;
}
