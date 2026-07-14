import type { StackStep } from '@/modules/theia/types/problem';

const PAIRS: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
const OPENERS = new Set(['(', '[', '{']);

export function validParenthesesSteps(input = '{[()()]}'): StackStep[] {
  const steps: StackStep[] = [];
  const stack: string[] = [];

  steps.push({
    input,
    frame: { stack: [], currentIndex: -1, highlight: 'default' },
    description: 'Start: empty stack. Will push openers, pop and match on closers.',
  });

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if (OPENERS.has(char)) {
      stack.push(char);
      steps.push({
        input,
        frame: { stack: [...stack], currentIndex: i, highlight: 'push' },
        description: `'${char}' is an opener — push it onto the stack.`,
      });
    } else {
      const top = stack[stack.length - 1];
      steps.push({
        input,
        frame: { stack: [...stack], currentIndex: i, highlight: 'compare' },
        description: `'${char}' is a closer — check if it matches the top of the stack ('${top ?? 'empty'}').`,
      });

      if (top === PAIRS[char]) {
        stack.pop();
        steps.push({
          input,
          frame: { stack: [...stack], currentIndex: i, highlight: 'pop' },
          description: `Match! '${top}' pairs with '${char}'. Popped from stack.`,
        });
      } else {
        steps.push({
          input,
          frame: { stack: [...stack], currentIndex: i, highlight: 'compare' },
          description: `Mismatch — '${char}' does not close '${top ?? 'nothing'}'. String is invalid.`,
        });
        return steps;
      }
    }
  }

  const isValid = stack.length === 0;
  steps.push({
    input,
    frame: { stack: [...stack], currentIndex: input.length, highlight: 'default' },
    description: isValid
      ? 'Stack is empty — every opener was matched. String is valid!'
      : `Stack still has ${stack.length} unmatched opener(s) — string is invalid.`,
  });

  return steps;
}
