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
    docs: `## Problem

Given an array of integers \`nums\` and an integer \`target\`, return the indices of the two numbers that add up to \`target\`.

You may assume each input has exactly one solution, and you may not use the same element twice.

## Example

\`\`\`
Input: nums = [2, 7, 11, 15], target = 9
Output: [0, 1]
Explanation: nums[0] + nums[1] = 2 + 7 = 9
\`\`\`

## Approach

A brute-force check of every pair costs **O(n²)**. Instead, walk the array once, and for each number, check whether its *complement* (\`target - nums[i]\`) has already been seen.

A hash map gives **O(1)** average lookup, so the whole scan finishes in **O(n)** time and **O(n)** space — store each number's index as you go, and check the map before inserting.

## Complexity

- **Time:** O(n)
- **Space:** O(n)`,
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
    docs: `## Problem

Given a **sorted** array of integers and a target value, return its index, or \`-1\` if it isn't present.

## Approach

Since the array is sorted, you don't need to check every element. Keep a \`lo\`/\`hi\` window over the search space. Look at the middle element:

- If it equals the target, you're done.
- If it's smaller, the target must be to the right — move \`lo\` past the middle.
- If it's larger, the target must be to the left — move \`hi\` before the middle.

Each step halves the search space, so it terminates in **O(log n)** steps instead of scanning all n elements.

## Complexity

- **Time:** O(log n)
- **Space:** O(1)`,
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
    docs: `## Problem

Given a string containing only \`(\`, \`)\`, \`{\`, \`}\`, \`[\`, and \`]\`, determine if the string is valid.

A string is valid if every opening bracket is closed by the same type, and brackets close in the correct order.

## Example

\`\`\`
Input: "{[()()]}"
Output: true

Input: "([)]"
Output: false  — brackets close out of order
\`\`\`

## Approach

A **stack** is a natural fit: push every opener. When a closer arrives, it must match whatever is currently on *top* of the stack — the most recently opened bracket needs to close first.

- Push on any opener.
- On a closer, pop the top and check it matches. If it doesn't (or the stack is empty), the string is invalid.
- At the end, the string is valid only if the stack is empty — every opener found its match.

## Complexity

- **Time:** O(n)
- **Space:** O(n)`,
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
    docs: `## Problem

Given the head of a singly linked list, reverse it and return the new head.

## Approach

Walk the list once, keeping track of two pointers: \`prev\` (initially \`null\`) and \`curr\` (starting at the head).

At each node:
1. Save \`curr.next\` before overwriting it.
2. Point \`curr.next\` back to \`prev\` — this is the actual reversal.
3. Advance both pointers forward.

After the loop, \`prev\` is the new head — the last node you visited.

## Complexity

- **Time:** O(n)
- **Space:** O(1) — done entirely in-place, no extra list needed`,
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
    docs: `## Problem

Given the head of a linked list, determine if it contains a cycle — a node whose \`next\` pointer eventually loops back to a previous node.

## Approach

Use two pointers moving at different speeds:

- **Slow** advances one node per step.
- **Fast** advances two nodes per step.

If there's no cycle, fast reaches the end (\`null\`) first. If there **is** a cycle, fast will eventually lap slow and they'll land on the same node — proving a loop exists, without needing any extra memory to track visited nodes.

This is known as **Floyd's Cycle Detection Algorithm** (or the "tortoise and hare").

## Complexity

- **Time:** O(n)
- **Space:** O(1) — no hash set required, unlike a naive visited-node approach`,
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
