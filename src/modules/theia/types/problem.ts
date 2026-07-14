import { CodeLang } from '../data/algorithm-code';
import type { ArrayStep } from './algorithm';
import type { LinkedListStep } from './linked-list';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type StackFrame = {
  stack: string[];
  currentIndex: number;
  highlight: 'push' | 'pop' | 'compare' | 'default';
};

export type StackStep = {
  input: string;
  frame: StackFrame;
  description: string;
};

export type ProblemVisualization =
  | { kind: 'array'; steps: ArrayStep[] }
  | { kind: 'linked-list'; steps: LinkedListStep[] }
  | { kind: 'stack'; steps: StackStep[] };

export type ProblemMeta = {
  slug: string;
  title: string;
  difficulty: Difficulty;
  tags: string[];
  summary: string;
  my_approach: string; // markdown
  code: Record<CodeLang, string>;
};
