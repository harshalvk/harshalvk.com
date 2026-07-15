The array is sorted — that's the detail that changes everything here. If I ignore that fact, I'd just scan left to right, O(n). But sorted data means I can ask a much sharper question at every step: _is the middle element too big, too small, or exactly right?_

That single comparison tells me which half of the array to throw away entirely. I don't need to look at it again.

So my approach:

1. Keep a window over the array — \`lo\` and \`hi\`.
2. Look at the middle of that window.
3. If it matches, I'm done.
4. If it's smaller than the target, the target must be somewhere to the right — so I move \`lo\` just past the middle.
5. If it's bigger, the target's to the left — move \`hi\` just before the middle.
6. Repeat until the window is empty (target isn't there) or I find it.

The thing I like about this one is how fast the search space shrinks — halving every step means even a huge array collapses to a handful of comparisons.

## Example

```
nums = [2, 5, 8, 12, 16, 23, 38, 45, 56, 72], target = 23
```

Middle starts at index 4 (16). 16 < 23, so I throw away the entire left half and everything up to and including index 4. Next middle lands right on 23. Found it in two comparisons instead of checking all ten values.

## Complexity

- **Time:** O(log n) — the search space halves every iteration
- **Space:** O(1) — just two pointers, no extra memory
