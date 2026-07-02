export type TopologyType = 'bus' | 'star' | 'ring' | 'mesh' | 'tree';

export type NetworkNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  role?: 'host' | 'hub' | 'switch' | 'router';
};

export type NetworkLink = {
  id: string;
  from: string;
  to: string;
};

export type PacketStatus = 'traveling' | 'delivered' | 'collided' | 'dropped' | 'broadcasting';

export type PacketEvent = {
  id: string;
  from: string;
  to: string; // 'broadcast' for bus/hub broadcasts
  path: string[]; // node ids the packet visits, in order
  status: PacketStatus;
};

export type NetworkStep = {
  nodes: NetworkNode[];
  links: NetworkLink[];
  activeLinkIds: string[];
  packets: PacketEvent[];
  description: string;
};

export type TopologyMeta = {
  slug: TopologyType;
  title: string;
  description: string;
  characteristics: { label: string; value: string }[];
  pros: string[];
  cons: string[];
};
