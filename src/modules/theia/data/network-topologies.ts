import type { TopologyMeta } from '@/modules/theia/types/network';

export const TOPOLOGIES: TopologyMeta[] = [
  {
    slug: 'bus',
    title: 'Bus Topology',
    description:
      'All devices share a single communication line. Only one device can transmit at a time.',
    characteristics: [
      { label: 'Medium', value: 'Shared cable' },
      { label: 'Collision handling', value: 'CSMA/CD' },
      { label: 'Failure impact', value: 'Single break disables entire bus' },
    ],
    pros: ['Cheap to install', 'Uses less cable than mesh or star'],
    cons: [
      'Collisions degrade performance as hosts grow',
      'One cable fault takes down the whole network',
      'Hard to troubleshoot',
    ],
  },
  {
    slug: 'star',
    title: 'Star Topology',
    description:
      'Every device connects to a central switch or hub, which manages all communication.',
    characteristics: [
      { label: 'Medium', value: 'Point-to-point links' },
      { label: 'Collision handling', value: 'None needed (switch)' },
      { label: 'Failure impact', value: 'Single host failure is isolated' },
    ],
    pros: [
      'Easy to add/remove hosts',
      'One cable failure only affects one host',
      'Centralized management',
    ],
    cons: ['Central switch is a single point of failure', 'More cabling than bus'],
  },
  {
    slug: 'ring',
    title: 'Ring Topology',
    description:
      'Devices form a closed loop, and data (or a token) passes from node to node in one direction.',
    characteristics: [
      { label: 'Medium', value: 'Point-to-point, circular' },
      { label: 'Collision handling', value: 'Token passing (no collisions)' },
      { label: 'Failure impact', value: 'One broken link can disrupt the ring' },
    ],
    pros: ['No collisions — deterministic access', 'Performs consistently even under heavy load'],
    cons: [
      'A single link/node failure can break the ring (unless dual-ring)',
      'Adding/removing nodes disrupts traffic',
    ],
  },
  {
    slug: 'mesh',
    title: 'Mesh Topology',
    description:
      'Every device connects directly to every other device, providing multiple redundant paths.',
    characteristics: [
      { label: 'Medium', value: 'Direct point-to-point links' },
      { label: 'Links needed', value: 'n(n-1)/2 for full mesh' },
      { label: 'Failure impact', value: 'Highly fault-tolerant' },
    ],
    pros: ['No single point of failure', 'High redundancy and reliability', 'No collisions'],
    cons: [
      'Very expensive to cable and maintain',
      'Impractical at scale (link count grows quadratically)',
    ],
  },
  {
    slug: 'tree',
    title: 'Tree Topology',
    description:
      'A hierarchical structure combining multiple star networks connected via a root switch.',
    characteristics: [
      { label: 'Medium', value: 'Hierarchical point-to-point' },
      { label: 'Collision handling', value: 'None needed (switched)' },
      { label: 'Failure impact', value: 'Depends on level — root failure is most severe' },
    ],
    pros: ['Scales well for large organizations', 'Easy to isolate and expand branches'],
    cons: [
      'Root switch failure affects entire subtree',
      'Cabling and planning complexity increases with depth',
    ],
  },
];

export function getTopology(slug: string) {
  return TOPOLOGIES.find((t) => t.slug === slug);
}
