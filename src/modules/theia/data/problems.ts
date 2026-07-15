import type { ProblemMeta, ProblemVisualization } from '@/modules/theia/types/problem';
import { twoSumSteps } from '@/modules/theia/lib/problems/two-sum';
import { binarySearchSteps } from '@/modules/theia/lib/problems/binary-search';
import { validParenthesesSteps } from '@/modules/theia/lib/problems/valid-parentheses';
import { reverseLinkedListSteps } from '@/modules/theia/lib/problems/reverse-linked-list';
import { detectCycleSteps } from '@/modules/theia/lib/problems/detect-cycle';

export const PROBLEMS: ProblemMeta[] = [
  {
    slug: 'two-sum',
    title: 'Two Sum',
    difficulty: 'easy',
    tags: ['array', 'hash-map'],
    summary: 'Find two numbers in an array that add up to a given target.',
  },
  {
    slug: 'binary-search',
    title: 'Binary Search',
    difficulty: 'easy',
    tags: ['array', 'binary-search'],
    summary: 'Find the index of a target value in a sorted array in logarithmic time.',
  },
  {
    slug: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'easy',
    tags: ['string', 'stack'],
    summary:
      'Check whether every opening bracket has a matching, correctly-ordered closing bracket.',
  },
  {
    slug: 'reverse-linked-list',
    title: 'Reverse Linked List',
    difficulty: 'easy',
    tags: ['linked-list', 'pointers'],
    summary: 'Reverse a singly linked list in-place.',
  },
  {
    slug: 'linked-list-cycle',
    title: 'Linked List Cycle Detection',
    difficulty: 'medium',
    tags: ['linked-list', 'two-pointers'],
    summary:
      "Detect whether a linked list contains a cycle, using Floyd's tortoise and hare algorithm.",
  },
];

export function getProblem(slug: string) {
  return PROBLEMS.find((p) => p.slug === slug);
}

export const ProblemsVisualizationGenerator: Record<string, () => ProblemVisualization> = {
  'two-sum': () => ({ kind: 'array', steps: twoSumSteps() }),
  'binary-search': () => ({ kind: 'array', steps: binarySearchSteps() }),
  'valid-parentheses': () => ({ kind: 'stack', steps: validParenthesesSteps() }),
  'reverse-linked-list': () => ({ kind: 'linked-list', steps: reverseLinkedListSteps() }),
  'linked-list-cycle': () => ({ kind: 'linked-list', steps: detectCycleSteps() }),
};
