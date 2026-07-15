My first instinct with bracket-matching problems is always: what data structure naturally "remembers" what just happened, in the right order? A stack does exactly that — last in, first out — which maps perfectly onto how brackets actually nest. The most recently opened bracket has to be the next one closed.

So here's how I think through it:

- Every time I see an opening bracket, I don't know yet what it pairs with — I just push it and move on.
- Every time I see a closing bracket, it's making a claim: "I close whatever opened most recently." So I check the top of the stack. If it matches, great — pop it, that pair is resolved. If it doesn't match (or the stack's empty and there's nothing to match), the string is broken — I can stop right there.
- At the very end, if the stack isn't empty, that means some opener never got closed — also invalid.

The part that took me a second to get comfortable with: I don't need to know how deep the nesting goes, or track multiple bracket types separately. The stack handles all of that for free just by virtue of always exposing "the most recent unmatched opener" at the top.

## Example

```
Input: "{[()()]}"  → valid
Input: "([)]"      → invalid — '(' opens, then '[' opens,
                      but ')' shows up and the top of the
                      stack is '[', not '(' — mismatch
```

## Complexity

- **Time:** O(n) — one pass through the string
- **Space:** O(n) — worst case, every character is an opener sitting on the stack
