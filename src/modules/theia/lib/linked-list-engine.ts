import type {
  LinkedListNode,
  LinkedListNodeStatus,
  LinkedListStep,
} from '@/modules/theia/types/linked-list';

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return `node-${idCounter}-${Math.random().toString(36).slice(2, 7)}`;
}

function snap(
  nodes: LinkedListNode[],
  highlights: Record<string, LinkedListNodeStatus>,
  description: string,
  pointerLabel?: { nodeId: string; label: string }[]
): LinkedListStep {
  return { nodes: [...nodes], highlights: { ...highlights }, description, pointerLabel };
}

export function buildLinkedList(values: number[]): LinkedListNode[] {
  return values.map((value) => ({ id: nextId(), value }));
}

export function randomLinkedListValues(size: number) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
}

// ── Insert at head ───────────────────────────────────────────────────────────

export function insertAtHeadSteps(current: LinkedListNode[], value: number): LinkedListStep[] {
  const steps: LinkedListStep[] = [];
  steps.push(snap(current, {}, `Inserting ${value} at the head of the list.`));

  const newNode: LinkedListNode = { id: nextId(), value };
  const next = [newNode, ...current];

  steps.push(
    snap(next, { [newNode.id]: 'new' }, `New node (${value}) created.`, [
      { nodeId: newNode.id, label: 'new node' },
    ])
  );
  steps.push(
    snap(
      next,
      { [newNode.id]: 'new' },
      current.length > 0
        ? `New node points to old head (${current[0].value}).`
        : 'New node becomes the only node — head and tail.'
    )
  );
  steps.push(snap(next, {}, `Head updated. List now starts with ${value}.`));

  return steps;
}

// ── Insert at tail ───────────────────────────────────────────────────────────

export function insertAtTailSteps(current: LinkedListNode[], value: number): LinkedListStep[] {
  const steps: LinkedListStep[] = [];
  steps.push(snap(current, {}, `Inserting ${value} at the tail of the list.`));

  if (current.length === 0) {
    const newNode: LinkedListNode = { id: nextId(), value };
    steps.push(
      snap([newNode], { [newNode.id]: 'new' }, 'List was empty — new node becomes head and tail.')
    );
    return steps;
  }

  for (let i = 0; i < current.length; i++) {
    steps.push(
      snap(
        current,
        { [current[i].id]: 'active' },
        `Traversing to find tail — currently at node ${current[i].value}.`
      )
    );
  }

  const newNode: LinkedListNode = { id: nextId(), value };
  const next = [...current, newNode];

  steps.push(
    snap(
      next,
      { [current[current.length - 1].id]: 'active', [newNode.id]: 'new' },
      `Reached tail (${current[current.length - 1].value}). Linking it to new node ${value}.`
    )
  );
  steps.push(snap(next, { [newNode.id]: 'new' }, `New node ${value} is now the tail.`));

  return steps;
}

// ── Insert at index ──────────────────────────────────────────────────────────

export function insertAtIndexSteps(
  current: LinkedListNode[],
  value: number,
  index: number
): LinkedListStep[] {
  const steps: LinkedListStep[] = [];
  const clamped = Math.max(0, Math.min(index, current.length));

  steps.push(snap(current, {}, `Inserting ${value} at index ${clamped}.`));

  for (let i = 0; i < clamped; i++) {
    steps.push(
      snap(
        current,
        { [current[i].id]: 'active' },
        `Traversing — at index ${i} (value ${current[i].value}). Need to reach index ${clamped}.`
      )
    );
  }

  const newNode: LinkedListNode = { id: nextId(), value };
  const next = [...current.slice(0, clamped), newNode, ...current.slice(clamped)];

  const prevId = clamped > 0 ? current[clamped - 1].id : undefined;
  const nextNodeId = clamped < current.length ? current[clamped].id : undefined;

  steps.push(
    snap(
      next,
      {
        [newNode.id]: 'new',
        ...(prevId ? { [prevId]: 'comparing' } : {}),
        ...(nextNodeId ? { [nextNodeId]: 'comparing' } : {}),
      },
      `Linking new node ${value} between index ${clamped - 1 >= 0 ? clamped - 1 : 'head'} and index ${clamped}.`
    )
  );
  steps.push(snap(next, { [newNode.id]: 'new' }, `Node ${value} inserted at index ${clamped}.`));

  return steps;
}

// ── Delete by value ──────────────────────────────────────────────────────────

export function deleteByValueSteps(current: LinkedListNode[], value: number): LinkedListStep[] {
  const steps: LinkedListStep[] = [];
  steps.push(snap(current, {}, `Searching for value ${value} to remove.`));

  let foundIndex = -1;
  for (let i = 0; i < current.length; i++) {
    steps.push(
      snap(
        current,
        { [current[i].id]: 'comparing' },
        `Checking node at index ${i} (value ${current[i].value}).`
      )
    );
    if (current[i].value === value) {
      foundIndex = i;
      steps.push(snap(current, { [current[i].id]: 'found' }, `Found ${value} at index ${i}.`));
      break;
    }
  }

  if (foundIndex === -1) {
    steps.push(snap(current, {}, `Value ${value} not found in the list. Nothing removed.`));
    return steps;
  }

  steps.push(
    snap(
      current,
      { [current[foundIndex].id]: 'removing' },
      `Re-linking previous node to skip over ${value}.`
    )
  );

  const next = current.filter((_, idx) => idx !== foundIndex);
  steps.push(snap(next, {}, `Node ${value} removed. List re-linked.`));

  return steps;
}

// ── Delete by index ──────────────────────────────────────────────────────────

export function deleteByIndexSteps(current: LinkedListNode[], index: number): LinkedListStep[] {
  const steps: LinkedListStep[] = [];

  if (index < 0 || index >= current.length) {
    steps.push(snap(current, {}, `Index ${index} is out of bounds. Nothing removed.`));
    return steps;
  }

  steps.push(snap(current, {}, `Removing node at index ${index}.`));

  for (let i = 0; i <= index; i++) {
    steps.push(
      snap(
        current,
        { [current[i].id]: i === index ? 'found' : 'active' },
        i === index
          ? `Reached index ${index} (value ${current[i].value}).`
          : `Traversing — at index ${i}.`
      )
    );
  }

  steps.push(
    snap(
      current,
      { [current[index].id]: 'removing' },
      `Re-linking neighbors to bypass index ${index}.`
    )
  );

  const next = current.filter((_, idx) => idx !== index);
  steps.push(snap(next, {}, `Node at index ${index} removed. List re-linked.`));

  return steps;
}

// ── Traverse / search (reused later for search algorithms) ─────────────────

export function linearSearchSteps(current: LinkedListNode[], value: number): LinkedListStep[] {
  const steps: LinkedListStep[] = [];
  steps.push(snap(current, {}, `Searching for ${value} by traversing from head.`));

  for (let i = 0; i < current.length; i++) {
    steps.push(
      snap(
        current,
        { [current[i].id]: 'comparing' },
        `Checking index ${i} (value ${current[i].value}).`
      )
    );
    if (current[i].value === value) {
      steps.push(snap(current, { [current[i].id]: 'found' }, `Found ${value} at index ${i}.`));
      return steps;
    }
  }

  steps.push(snap(current, {}, `Reached end of list — ${value} not found.`));
  return steps;
}
