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
    my_approach: `I'll solve this problem like this: first, what's the dumb way to do it?

Check every pair of numbers and see if they add up to the target. Two nested loops, O(n²). That works, but the moment I see "find a pair" in a problem, I want to ask — can I avoid checking every pair?

Here's the key realization: if I'm standing at some number \`x\`, I already know exactly what I need to find — its complement, \`target - x\`. I don't need to search the rest of the array for it. I just need to know: *have I already seen it?*

That "have I already seen it" question is exactly what a hash map is good at — O(1) lookup instead of scanning.

So the approach becomes:
1. Walk the array once.
2. At each number, compute what its partner would need to be.
3. Check the map — if that partner's already there, I'm done.
4. Otherwise, store the current number (and its index) in the map, and keep going.

The nice part is I never need a second pass. By the time I reach the actual pair, one of the two numbers has already been recorded from an earlier step — so the answer surfaces naturally as I scan forward.

## Example

\`\`\`
Input: nums = [2, 7, 11, 15], target = 9
Output: [0, 1]
\`\`\`

At index 0 (value 2), I need a 7 — haven't seen one yet, so I record "2 is at index 0."
At index 1 (value 7), I need a 2 — and yes, I've already got that stored. Done.

## Complexity

- **Time:** O(n) — one pass, O(1) map operations
- **Space:** O(n) — worst case, I store almost the whole array before finding the match`,
    code: {
      ts: `function twoSum(nums: number[], target: number): number[] {
  const seen = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) {
      return [seen.get(complement)!, i];
    }
    seen.set(nums[i], i);
  }
  return [];
}`,
      go: `func twoSum(nums []int, target int) []int {
  seen := make(map[int]int)
  for i, n := range nums {
    complement := target - n
    if idx, ok := seen[complement]; ok {
      return []int{idx, i}
    }
    seen[n] = i
  }
  return nil
}`,
      java: `int[] twoSum(int[] nums, int target) {
  Map<Integer, Integer> seen = new HashMap<>();
  for (int i = 0; i < nums.length; i++) {
    int complement = target - nums[i];
    if (seen.containsKey(complement)) {
      return new int[]{seen.get(complement), i};
    }
    seen.put(nums[i], i);
  }
  return new int[]{};
}`,
      cpp: `std::vector<int> twoSum(std::vector<int>& nums, int target) {
  std::unordered_map<int, int> seen;
  for (int i = 0; i < nums.size(); i++) {
    int complement = target - nums[i];
    if (seen.count(complement)) {
      return {seen[complement], i};
    }
    seen[nums[i]] = i;
  }
  return {};
}`,
    },
  },

  {
    slug: 'binary-search',
    title: 'Binary Search',
    difficulty: 'easy',
    tags: ['array', 'binary-search'],
    summary: 'Find the index of a target value in a sorted array in logarithmic time.',
    my_approach: `The array is sorted — that's the detail that changes everything here. If I ignore that fact, I'd just scan left to right, O(n). But sorted data means I can ask a much sharper question at every step: *is the middle element too big, too small, or exactly right?*

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

\`\`\`
nums = [2, 5, 8, 12, 16, 23, 38, 45, 56, 72], target = 23
\`\`\`

Middle starts at index 4 (16). 16 < 23, so I throw away the entire left half and everything up to and including index 4. Next middle lands right on 23. Found it in two comparisons instead of checking all ten values.

## Complexity

- **Time:** O(log n) — the search space halves every iteration
- **Space:** O(1) — just two pointers, no extra memory`,
    code: {
      ts: `function binarySearch(nums: number[], target: number): number {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
      go: `func binarySearch(nums []int, target int) int {
  lo, hi := 0, len(nums)-1
  for lo <= hi {
    mid := (lo + hi) / 2
    if nums[mid] == target {
      return mid
    } else if nums[mid] < target {
      lo = mid + 1
    } else {
      hi = mid - 1
    }
  }
  return -1
}`,
      java: `int binarySearch(int[] nums, int target) {
  int lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    int mid = (lo + hi) / 2;
    if (nums[mid] == target) return mid;
    else if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
      cpp: `int binarySearch(std::vector<int>& nums, int target) {
  int lo = 0, hi = nums.size() - 1;
  while (lo <= hi) {
    int mid = (lo + hi) / 2;
    if (nums[mid] == target) return mid;
    else if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
    },
  },

  {
    slug: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'easy',
    tags: ['string', 'stack'],
    summary:
      'Check whether every opening bracket has a matching, correctly-ordered closing bracket.',
    my_approach: `My first instinct with bracket-matching problems is always: what data structure naturally "remembers" what just happened, in the right order? A stack does exactly that — last in, first out — which maps perfectly onto how brackets actually nest. The most recently opened bracket has to be the next one closed.

So here's how I think through it:

- Every time I see an opening bracket, I don't know yet what it pairs with — I just push it and move on.
- Every time I see a closing bracket, it's making a claim: "I close whatever opened most recently." So I check the top of the stack. If it matches, great — pop it, that pair is resolved. If it doesn't match (or the stack's empty and there's nothing to match), the string is broken — I can stop right there.
- At the very end, if the stack isn't empty, that means some opener never got closed — also invalid.

The part that took me a second to get comfortable with: I don't need to know how deep the nesting goes, or track multiple bracket types separately. The stack handles all of that for free just by virtue of always exposing "the most recent unmatched opener" at the top.

## Example

\`\`\`
Input: "{[()()]}"  → valid
Input: "([)]"      → invalid — '(' opens, then '[' opens,
                      but ')' shows up and the top of the
                      stack is '[', not '(' — mismatch
\`\`\`

## Complexity

- **Time:** O(n) — one pass through the string
- **Space:** O(n) — worst case, every character is an opener sitting on the stack`,
    code: {
      ts: `function isValid(s: string): boolean {
  const pairs: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
  const stack: string[] = [];

  for (const char of s) {
    if (char === '(' || char === '[' || char === '{') {
      stack.push(char);
    } else {
      if (stack.pop() !== pairs[char]) return false;
    }
  }
  return stack.length === 0;
}`,
      go: `func isValid(s string) bool {
  pairs := map[byte]byte{')': '(', ']': '[', '}': '{'}
  stack := []byte{}

  for i := 0; i < len(s); i++ {
    c := s[i]
    if c == '(' || c == '[' || c == '{' {
      stack = append(stack, c)
    } else {
      if len(stack) == 0 || stack[len(stack)-1] != pairs[c] {
        return false
      }
      stack = stack[:len(stack)-1]
    }
  }
  return len(stack) == 0
}`,
      java: `boolean isValid(String s) {
  Map<Character, Character> pairs = Map.of(')', '(', ']', '[', '}', '{');
  Deque<Character> stack = new ArrayDeque<>();

  for (char c : s.toCharArray()) {
    if (c == '(' || c == '[' || c == '{') {
      stack.push(c);
    } else {
      if (stack.isEmpty() || stack.pop() != pairs.get(c)) return false;
    }
  }
  return stack.isEmpty();
}`,
      cpp: `bool isValid(std::string s) {
  std::unordered_map<char, char> pairs = {{')', '('}, {']', '['}, {'}', '{'}};
  std::stack<char> st;

  for (char c : s) {
    if (c == '(' || c == '[' || c == '{') {
      st.push(c);
    } else {
      if (st.empty() || st.top() != pairs[c]) return false;
      st.pop();
    }
  }
  return st.empty();
}`,
    },
  },

  {
    slug: 'reverse-linked-list',
    title: 'Reverse Linked List',
    difficulty: 'easy',
    tags: ['linked-list', 'pointers'],
    summary: 'Reverse a singly linked list in-place.',
    my_approach: `The tricky part with linked lists is that the moment I change a \`next\` pointer, I lose my only way of getting to whatever came after it — so I have to think carefully about *what I save before I overwrite anything*.

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

\`\`\`
10 -> 25 -> 7 -> 42 -> 18 -> null
\`\`\`

becomes

\`\`\`
18 -> 42 -> 7 -> 25 -> 10 -> null
\`\`\`

One pass, no extra list allocated — I'm just re-pointing existing nodes as I go.

## Complexity

- **Time:** O(n) — visit every node exactly once
- **Space:** O(1) — done entirely in-place`,
    code: {
      ts: `function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let curr = head;

  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}`,
      go: `func reverseList(head *ListNode) *ListNode {
  var prev *ListNode
  curr := head

  for curr != nil {
    next := curr.Next
    curr.Next = prev
    prev = curr
    curr = next
  }
  return prev
}`,
      java: `ListNode reverseList(ListNode head) {
  ListNode prev = null;
  ListNode curr = head;

  while (curr != null) {
    ListNode next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}`,
      cpp: `ListNode* reverseList(ListNode* head) {
  ListNode* prev = nullptr;
  ListNode* curr = head;

  while (curr != nullptr) {
    ListNode* next = curr->next;
    curr->next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}`,
    },
  },

  {
    slug: 'linked-list-cycle',
    title: 'Linked List Cycle Detection',
    difficulty: 'medium',
    tags: ['linked-list', 'two-pointers'],
    summary:
      "Detect whether a linked list contains a cycle, using Floyd's tortoise and hare algorithm.",
    my_approach: `The naive way to detect a cycle is to remember every node I've visited (a hash set) and check if I ever land on one twice. That works, but it costs O(n) extra space — and there's a neat trick that avoids that entirely.

The idea: put two pointers on the list, moving at different speeds. One (\`slow\`) takes one step at a time. The other (\`fast\`) takes two.

If the list is a straight line with no cycle, \`fast\` just reaches the end first — simple, no cycle, done.

But if there *is* a cycle, something interesting happens: \`fast\` enters the loop and starts lapping \`slow\` from behind. Since they're both stuck going around the same loop, \`fast\` is gaining one extra step on \`slow\` every iteration — eventually it has to catch up and land exactly on \`slow\`'s node. That meeting is proof a cycle exists — no bookkeeping of visited nodes needed, just watching whether the two pointers ever collide.

This is Floyd's Cycle Detection ("tortoise and hare") — and honestly, the first time I saw this technique, the "why does the fast pointer have to catch up" part is the bit that takes a second to click. It clicks once you picture the loop as a literal circular track: two runners at different speeds on a loop always eventually meet.

## Example

If node 18 secretly points back to node 7 instead of \`null\`, \`slow\` and \`fast\` will end up chasing each other around that loop until they land on the same node — confirming the cycle.

## Complexity

- **Time:** O(n)
- **Space:** O(1) — no extra hash set required, unlike the naive visited-node approach`,
    code: {
      ts: `function hasCycle(head: ListNode | null): boolean {
  let slow = head;
  let fast = head;

  while (fast && fast.next) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`,
      go: `func hasCycle(head *ListNode) bool {
  slow, fast := head, head
  for fast != nil && fast.Next != nil {
    slow = slow.Next
    fast = fast.Next.Next
    if slow == fast {
      return true
    }
  }
  return false
}`,
      java: `boolean hasCycle(ListNode head) {
  ListNode slow = head, fast = head;
  while (fast != null && fast.next != null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow == fast) return true;
  }
  return false;
}`,
      cpp: `bool hasCycle(ListNode *head) {
  ListNode *slow = head, *fast = head;
  while (fast != nullptr && fast->next != nullptr) {
    slow = slow->next;
    fast = fast->next->next;
    if (slow == fast) return true;
  }
  return false;
}`,
    },
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
