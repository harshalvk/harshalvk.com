The naive way to detect a cycle is to remember every node I've visited (a hash set) and check if I ever land on one twice. That works, but it costs O(n) extra space — and there's a neat trick that avoids that entirely.

The idea: put two pointers on the list, moving at different speeds. One (\`slow\`) takes one step at a time. The other (\`fast\`) takes two.

If the list is a straight line with no cycle, \`fast\` just reaches the end first — simple, no cycle, done.

But if there _is_ a cycle, something interesting happens: \`fast\` enters the loop and starts lapping \`slow\` from behind. Since they're both stuck going around the same loop, \`fast\` is gaining one extra step on \`slow\` every iteration — eventually it has to catch up and land exactly on \`slow\`'s node. That meeting is proof a cycle exists — no bookkeeping of visited nodes needed, just watching whether the two pointers ever collide.

This is Floyd's Cycle Detection ("tortoise and hare") — and honestly, the first time I saw this technique, the "why does the fast pointer have to catch up" part is the bit that takes a second to click. It clicks once you picture the loop as a literal circular track: two runners at different speeds on a loop always eventually meet.

## Example

If node 18 secretly points back to node 7 instead of \`null\`, \`slow\` and \`fast\` will end up chasing each other around that loop until they land on the same node — confirming the cycle.

## Complexity

- **Time:** O(n)
- **Space:** O(1) — no extra hash set required, unlike the naive visited-node approach
