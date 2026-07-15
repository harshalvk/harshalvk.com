The tricky part with linked lists is that the moment I change a \`next\` pointer, I lose my only way of getting to whatever came after it — so I have to think carefully about _what I save before I overwrite anything_.

Here's how I reason through it: I want every node's \`next\` to eventually point backward instead of forward. So as I walk the list, at each node I need three things in hand at once:

- what came before (so I can point backward to it)
- the node I'm currently on
- what comes after (so I don't lose the rest of the list once I rewrite this node's pointer)

That's three pointers: \`prev\`, \`curr\`, and a temporary \`next\`.

The sequence at each step:

1. Save \`curr.next\` before touching anything — this is my lifeline to the rest of the list.
2. Rewire \`curr.next\` to point back at \`prev\`.
3. Slide everything forward: \`prev\` becomes \`curr\`, \`curr\` becomes the saved \`next\`.

I keep doing that until \`curr\` runs out. Whatever \`prev\` is pointing to at that point is the new head — it's simply the last node I visited.

## Example

```
10 -> 25 -> 7 -> 42 -> 18 -> null
```

becomes

```
18 -> 42 -> 7 -> 25 -> 10 -> null
```

One pass, no extra list allocated — I'm just re-pointing existing nodes as I go.

## Complexity

- **Time:** O(n) — visit every node exactly once
- **Space:** O(1) — done entirely in-place
