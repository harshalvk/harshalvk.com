export type DataPoint = {
  id: string;
  vector: number[]; // original high-dimensional feature vector
  label: string;
  metadata: Record<string, string | number>;
};

export type ParsedDataset = {
  points: DataPoint[];
  featureColumns: string[];
  metadataColumns: string[];
  labelColumn: string | null;
  downsampled: boolean;
  originalRowCount: number;
};

export type ProjectedPoint = {
  id: string;
  x: number;
  y: number;
  z: number;
};
