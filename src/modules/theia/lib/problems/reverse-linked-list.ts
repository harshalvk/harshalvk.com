import type { LinkedListNode, LinkedListStep } from '@/modules/theia/types/linked-list';
import { buildLinkedList } from '@/modules/theia/lib/linked-list-engine';

function snap(
  nodes: LinkedListNode[],
  highlights: Record<string, LinkedListStep['highlights'][string]>,
  description: string,
  pointerLabel?: { nodeId: string; label: string }[]
): LinkedListStep {
  return { nodes: [...nodes], highlights: { ...highlights }, description, pointerLabel };
}

export function reverseLinkedListSteps(values: number[] = [10, 25, 7, 42, 18]): LinkedListStep[] {
  const nodes = buildLinkedList(values);
  const steps: LinkedListStep[] = [];

  steps.push(
    snap(
      nodes,
      {},
      'Start: will reverse links in-place using prev/curr pointers, one node at a time.'
    )
  );

  // Build a mutable next-pointer map (nodes array is just visitation order for the arena).
  const nextMap = new Map<string, string | null>();
  nodes.forEach((n, i) => nextMap.set(n.id, nodes[i + 1]?.id ?? null));

  let prevId: string | null = null;
  let currId: string | null = nodes[0]?.id ?? null;
  const order: LinkedListNode[] = [];

  while (currId) {
    const curr = nodes.find((n) => n.id === currId)!;
    const nextId: string = nextMap.get(currId) ?? (null as unknown as string);

    steps.push(
      snap(
        reconstructOrder(nodes, nextMap, order, curr.id),
        { [curr.id]: 'active', ...(prevId ? { [prevId]: 'comparing' } : {}) },
        `At node ${curr.value}. Point its "next" backward to ${prevId ? nodes.find((n) => n.id === prevId)!.value : 'null'} instead of forward.`,
        [{ nodeId: curr.id, label: 'curr' }, ...(prevId ? [{ nodeId: prevId, label: 'prev' }] : [])]
      )
    );

    nextMap.set(curr.id, prevId);
    prevId = curr.id;
    currId = nextId;
  }

  const finalOrder = buildReversedOrder(nodes, nextMap, prevId);
  steps.push(
    snap(
      finalOrder,
      {},
      `Reversal complete. New head is ${nodes.find((n) => n.id === prevId)?.value}.`,
      prevId ? [{ nodeId: prevId, label: 'new head' }] : undefined
    )
  );

  return steps;
}

function reconstructOrder(
  allNodes: LinkedListNode[],
  nextMap: Map<string, string | null>,
  reversedSoFar: LinkedListNode[],
  currId: string
): LinkedListNode[] {
  const remaining: LinkedListNode[] = [];
  let cursor: string | null = currId;
  const originalNext = new Map<string, string | null>();
  allNodes.forEach((n, i) => originalNext.set(n.id, allNodes[i + 1]?.id ?? null));

  while (cursor) {
    remaining.push(allNodes.find((n) => n.id === cursor)!);
    cursor = originalNext.get(cursor) ?? null;
  }

  return [...reversedSoFar, ...remaining];
}

function buildReversedOrder(
  allNodes: LinkedListNode[],
  nextMap: Map<string, string | null>,
  headId: string | null
): LinkedListNode[] {
  const order: LinkedListNode[] = [];
  let cursor = headId;
  const visited = new Set<string>();
  while (cursor && !visited.has(cursor)) {
    visited.add(cursor);
    order.push(allNodes.find((n) => n.id === cursor)!);
    cursor = nextMap.get(cursor) ?? null;
  }
  return order;
}
