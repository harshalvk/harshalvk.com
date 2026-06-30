export type LinkedListNodeStatus =
  | 'default'
  | 'active'
  | 'comparing'
  | 'found'
  | 'new'
  | 'removing';

export type LinkedListNode = {
  id: string;
  value: number;
};

export type LinkedListStep = {
  nodes: LinkedListNode[];
  highlights: Record<string, LinkedListNodeStatus>;
  description: string;
  pointerLabel?: { nodeId: string; label: string }[];
};
