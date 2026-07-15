I'll solve this problem like this: first, what's the dumb way to do it?

Check every pair of numbers and see if they add up to the target. Two nested loops, O(n²). That works, but the moment I see "find a pair" in a problem, I want to ask — can I avoid checking every pair?

Here's the key realization: if I'm standing at some number `x`, I already know exactly what I need to find — its complement, `target - x`. I don't need to search the rest of the array for it. I just need to know: _have I already seen it?_

That "have I already seen it" question is exactly what a hash map is good at — O(1) lookup instead of scanning.

So the approach becomes:

1. Walk the array once.
2. At each number, compute what its partner would need to be.
3. Check the map — if that partner's already there, I'm done.
4. Otherwise, store the current number (and its index) in the map, and keep going.

The nice part is I never need a second pass. By the time I reach the actual pair, one of the two numbers has already been recorded from an earlier step — so the answer surfaces naturally as I scan forward.

## Example

```
Input: nums = [2, 7, 11, 15], target = 9
Output: [0, 1]
```

At index 0 (value 2), I need a 7 — haven't seen one yet, so I record "2 is at index 0."
At index 1 (value 7), I need a 2 — and yes, I've already got that stored. Done.

## Complexity

- **Time:** O(n) — one pass, O(1) map operations
- **Space:** O(n) — worst case, I store almost the whole array before finding the match
