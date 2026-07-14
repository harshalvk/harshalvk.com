import { Difficulty } from '../types/problem';

export const DIFFICULTY_CLASS: Record<Difficulty, string> = {
  easy: 'text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  medium: 'text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/10',
  hard: 'text-rose-600 dark:text-rose-400 border-rose-500/30 bg-rose-500/10',
};
