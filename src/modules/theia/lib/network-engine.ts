import type {
  NetworkLink,
  NetworkNode,
  NetworkStep,
  PacketEvent,
  TopologyType,
} from '@/modules/theia/types/network';

function findPath(
  nodes: NetworkNode[],
  links: NetworkLink[],
  fromId: string,
  toId: string
): string[] {
  const adjacency = new Map<string, string[]>();
  nodes.forEach((n) => adjacency.set(n.id, []));
  links.forEach((l) => {
    adjacency.get(l.from)?.push(l.to);
    adjacency.get(l.to)?.push(l.from);
  });

  const visited = new Set<string>([fromId]);
  const queue: string[][] = [[fromId]];

  while (queue.length > 0) {
    const path = queue.shift()!;
    const last = path[path.length - 1];
    if (last === toId) return path;

    for (const neighbor of adjacency.get(last) ?? []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([...path, neighbor]);
      }
    }
  }

  return [fromId, toId]; // fallback, shouldn't happen on connected graphs
}

function linkIdsForPath(links: NetworkLink[], path: string[]): string[] {
  const ids: string[] = [];
  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i],
      b = path[i + 1];
    const link = links.find((l) => (l.from === a && l.to === b) || (l.from === b && l.to === a));
    if (link) ids.push(link.id);
  }
  return ids;
}

// ── Unicast transmission — star, tree, mesh (shortest path via switch/router) ──

export function sendUnicastSteps(
  nodes: NetworkNode[],
  links: NetworkLink[],
  topology: TopologyType,
  fromId: string,
  toId: string
): NetworkStep[] {
  const steps: NetworkStep[] = [];
  const path = findPath(nodes, links, fromId, toId);
  const activeLinks = linkIdsForPath(links, path);
  const fromLabel = nodes.find((n) => n.id === fromId)?.label;
  const toLabel = nodes.find((n) => n.id === toId)?.label;

  const packet: PacketEvent = { id: 'pkt-1', from: fromId, to: toId, path, status: 'traveling' };

  steps.push({
    nodes,
    links,
    activeLinkIds: [],
    packets: [],
    description: `${fromLabel} prepares a frame addressed to ${toLabel}.`,
  });

  steps.push({
    nodes,
    links,
    activeLinkIds: activeLinks,
    packets: [packet],
    description:
      topology === 'star'
        ? `Switch receives the frame and forwards it only on the port connected to ${toLabel} (unlike a hub, it doesn't broadcast).`
        : topology === 'mesh'
          ? `A direct link exists to ${toLabel} — the packet travels straight there with no intermediate hops.`
          : `Packet routed hop-by-hop through the network toward ${toLabel}.`,
  });

  steps.push({
    nodes,
    links,
    activeLinkIds: activeLinks,
    packets: [{ ...packet, status: 'delivered' }],
    description: `${toLabel} receives the frame. Transmission complete in ${path.length - 1} hop${path.length - 1 === 1 ? '' : 's'}.`,
  });

  return steps;
}

// ── Bus topology — broadcast medium, CSMA/CD collision simulation ──────────

export function sendBusSteps(
  nodes: NetworkNode[],
  links: NetworkLink[],
  fromId: string,
  toId: string,
  simulateCollision: boolean
): NetworkStep[] {
  const steps: NetworkStep[] = [];
  const allLinkIds = links.map((l) => l.id);
  const fromLabel = nodes.find((n) => n.id === fromId)?.label;
  const toLabel = nodes.find((n) => n.id === toId)?.label;

  steps.push({
    nodes,
    links,
    activeLinkIds: [],
    packets: [],
    description: `${fromLabel} listens to the shared bus (carrier sense) before transmitting.`,
  });

  if (simulateCollision) {
    const otherId = nodes.find((n) => n.id !== fromId && n.id !== toId)?.id ?? toId;
    const otherLabel = nodes.find((n) => n.id === otherId)?.label;

    steps.push({
      nodes,
      links,
      activeLinkIds: allLinkIds,
      packets: [
        {
          id: 'pkt-1',
          from: fromId,
          to: 'broadcast',
          path: nodes.map((n) => n.id),
          status: 'traveling',
        },
        {
          id: 'pkt-2',
          from: otherId,
          to: 'broadcast',
          path: nodes.map((n) => n.id),
          status: 'traveling',
        },
      ],
      description: `${otherLabel} also starts transmitting at nearly the same time — both signals hit the bus simultaneously.`,
    });

    steps.push({
      nodes,
      links,
      activeLinkIds: allLinkIds,
      packets: [
        {
          id: 'pkt-1',
          from: fromId,
          to: 'broadcast',
          path: nodes.map((n) => n.id),
          status: 'collided',
        },
        {
          id: 'pkt-2',
          from: otherId,
          to: 'broadcast',
          path: nodes.map((n) => n.id),
          status: 'collided',
        },
      ],
      description:
        'Collision detected (CSMA/CD). Both stations abort, wait a random backoff period, and retry.',
    });

    steps.push({
      nodes,
      links,
      activeLinkIds: allLinkIds,
      packets: [
        {
          id: 'pkt-1',
          from: fromId,
          to: 'broadcast',
          path: nodes.map((n) => n.id),
          status: 'broadcasting',
        },
      ],
      description: `After backoff, ${fromLabel} senses the bus is idle and retransmits successfully.`,
    });
  } else {
    steps.push({
      nodes,
      links,
      activeLinkIds: allLinkIds,
      packets: [
        {
          id: 'pkt-1',
          from: fromId,
          to: 'broadcast',
          path: nodes.map((n) => n.id),
          status: 'broadcasting',
        },
      ],
      description: `Bus is idle — ${fromLabel} broadcasts the frame. Every host on the bus receives the electrical signal.`,
    });
  }

  steps.push({
    nodes,
    links,
    activeLinkIds: allLinkIds,
    packets: [
      { id: 'pkt-1', from: fromId, to: toId, path: nodes.map((n) => n.id), status: 'delivered' },
    ],
    description: `All hosts inspect the destination address. Only ${toLabel} accepts it — the rest discard the frame.`,
  });

  return steps;
}

// ── Ring topology — token passing ───────────────────────────────────────────

export function sendRingSteps(
  nodes: NetworkNode[],
  links: NetworkLink[],
  fromId: string,
  toId: string
): NetworkStep[] {
  const steps: NetworkStep[] = [];
  const fromIdx = nodes.findIndex((n) => n.id === fromId);
  const toIdx = nodes.findIndex((n) => n.id === toId);
  const fromLabel = nodes[fromIdx]?.label;
  const toLabel = nodes[toIdx]?.label;
  const n = nodes.length;

  steps.push({
    nodes,
    links,
    activeLinkIds: [],
    packets: [],
    description: `${fromLabel} waits for the free token to circulate around the ring.`,
  });

  // token travels from fromIdx around until it reaches fromIdx again (simulate arrival)
  const tokenLink = links.find((l) => l.from === fromId || l.to === fromId);
  steps.push({
    nodes,
    links,
    activeLinkIds: tokenLink ? [tokenLink.id] : [],
    packets: [{ id: 'token', from: fromId, to: fromId, path: [fromId], status: 'traveling' }],
    description: `Token arrives at ${fromLabel} — it now has permission to transmit.`,
  });

  // Determine forward path direction (shorter way around)
  let hopPath: string[] = [];
  let dist = 0;
  let idx = fromIdx;
  while (nodes[idx].id !== toId && dist < n) {
    hopPath.push(nodes[idx].id);
    idx = (idx + 1) % n;
    dist++;
  }
  hopPath.push(toId);

  const activeLinks: string[] = [];
  for (let i = 0; i < hopPath.length - 1; i++) {
    const a = hopPath[i],
      b = hopPath[i + 1];
    const link = links.find((l) => (l.from === a && l.to === b) || (l.from === b && l.to === a));
    if (link) activeLinks.push(link.id);
  }

  steps.push({
    nodes,
    links,
    activeLinkIds: activeLinks,
    packets: [{ id: 'pkt-1', from: fromId, to: toId, path: hopPath, status: 'traveling' }],
    description: `Data frame attached to the token travels node-to-node around the ring toward ${toLabel}.`,
  });

  steps.push({
    nodes,
    links,
    activeLinkIds: activeLinks,
    packets: [{ id: 'pkt-1', from: fromId, to: toId, path: hopPath, status: 'delivered' }],
    description: `${toLabel} copies the frame, marks it as received, and the token continues circulating — releasing for the next host to use.`,
  });

  return steps;
}
