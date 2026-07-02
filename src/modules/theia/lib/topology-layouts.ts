import type { NetworkNode, NetworkLink, TopologyType } from '@/modules/theia/types/network';

const CENTER_X = 300;
const CENTER_Y = 220;

export function generateTopology(
  type: TopologyType,
  hostCount = 6
): { nodes: NetworkNode[]; links: NetworkLink[] } {
  switch (type) {
    case 'star':
      return generateStar(hostCount);
    case 'bus':
      return generateBus(hostCount);
    case 'ring':
      return generateRing(hostCount);
    case 'mesh':
      return generateMesh(Math.min(hostCount, 6)); // full mesh gets unwieldy past 6
    case 'tree':
      return generateTree(hostCount);
  }
}

function generateStar(n: number) {
  const hub: NetworkNode = { id: 'hub', label: 'Switch', x: CENTER_X, y: CENTER_Y, role: 'switch' };
  const nodes: NetworkNode[] = [hub];
  const links: NetworkLink[] = [];
  const radius = 160;

  for (let i = 0; i < n; i++) {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    const id = `host-${i}`;
    nodes.push({
      id,
      label: `Host ${i + 1}`,
      x: CENTER_X + radius * Math.cos(angle),
      y: CENTER_Y + radius * Math.sin(angle),
      role: 'host',
    });
    links.push({ id: `link-${id}`, from: id, to: 'hub' });
  }

  return { nodes, links };
}

function generateBus(n: number) {
  const nodes: NetworkNode[] = [];
  const links: NetworkLink[] = [];
  const spacing = 480 / (n - 1 || 1);

  for (let i = 0; i < n; i++) {
    const id = `host-${i}`;
    nodes.push({ id, label: `Host ${i + 1}`, x: 60 + i * spacing, y: CENTER_Y, role: 'host' });
    if (i > 0) {
      links.push({ id: `link-${i}`, from: `host-${i - 1}`, to: id });
    }
  }

  return { nodes, links };
}

function generateRing(n: number) {
  const nodes: NetworkNode[] = [];
  const links: NetworkLink[] = [];
  const radius = 150;

  for (let i = 0; i < n; i++) {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    const id = `host-${i}`;
    nodes.push({
      id,
      label: `Host ${i + 1}`,
      x: CENTER_X + radius * Math.cos(angle),
      y: CENTER_Y + radius * Math.sin(angle),
      role: 'host',
    });
  }

  for (let i = 0; i < n; i++) {
    const from = `host-${i}`;
    const to = `host-${(i + 1) % n}`;
    links.push({ id: `link-${i}`, from, to });
  }

  return { nodes, links };
}

function generateMesh(n: number) {
  const nodes: NetworkNode[] = [];
  const links: NetworkLink[] = [];
  const radius = 150;

  for (let i = 0; i < n; i++) {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    nodes.push({
      id: `host-${i}`,
      label: `Host ${i + 1}`,
      x: CENTER_X + radius * Math.cos(angle),
      y: CENTER_Y + radius * Math.sin(angle),
      role: 'host',
    });
  }

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      links.push({ id: `link-${i}-${j}`, from: `host-${i}`, to: `host-${j}` });
    }
  }

  return { nodes, links };
}

function generateTree(n: number) {
  const nodes: NetworkNode[] = [
    { id: 'root', label: 'Root Switch', x: CENTER_X, y: 70, role: 'switch' },
  ];
  const links: NetworkLink[] = [];

  const branchCount = 2;
  const branches: NetworkNode[] = [];
  for (let b = 0; b < branchCount; b++) {
    const id = `branch-${b}`;
    const node: NetworkNode = {
      id,
      label: `Switch ${b + 1}`,
      x: CENTER_X + (b === 0 ? -140 : 140),
      y: 180,
      role: 'switch',
    };
    branches.push(node);
    nodes.push(node);
    links.push({ id: `link-root-${id}`, from: 'root', to: id });
  }

  const perBranch = Math.ceil(n / branchCount);
  let hostIdx = 0;
  branches.forEach((branch, bIdx) => {
    for (let i = 0; i < perBranch && hostIdx < n; i++, hostIdx++) {
      const id = `host-${hostIdx}`;
      const spread = perBranch > 1 ? (i / (perBranch - 1) - 0.5) * 140 : 0;
      nodes.push({
        id,
        label: `Host ${hostIdx + 1}`,
        x: branch.x + spread,
        y: 300,
        role: 'host',
      });
      links.push({ id: `link-${branch.id}-${id}`, from: branch.id, to: id });
    }
  });

  return { nodes, links };
}
