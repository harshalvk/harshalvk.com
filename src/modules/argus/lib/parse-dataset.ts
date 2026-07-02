import Papa from 'papaparse';
import type { DataPoint, ParsedDataset } from '@/modules/argus/types/projector';

export const MAX_ROWS = 5000;
export const MAX_DIMENSIONS = 200;
export const MAX_FILE_SIZE_MB = 8;

function isNumeric(value: unknown): boolean {
  if (value === '' || value === null || value === undefined) return false;
  return !Number.isNaN(Number(value));
}

function downsample<T>(rows: T[], limit: number): { rows: T[]; downsampled: boolean } {
  if (rows.length <= limit) return { rows, downsampled: false };

  const shuffled = [...rows];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return { rows: shuffled.slice(0, limit), downsampled: true };
}

export async function parseDatasetFile(file: File): Promise<ParsedDataset> {
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    throw new Error(`File exceeds ${MAX_FILE_SIZE_MB}MB limit. Try a smaller sample.`);
  }

  const delimiter = file.name.endsWith('.tsv') ? '\t' : ',';

  const parsed = await new Promise<Papa.ParseResult<Record<string, string>>>((resolve, reject) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      delimiter,
      skipEmptyLines: true,
      worker: true, // parses off the main thread — no jank, still 100% client-side
      complete: resolve,
      error: reject,
    });
  });

  if (parsed.errors.length > 0 && parsed.data.length === 0) {
    throw new Error('Could not parse this file. Check it is valid CSV/TSV with a header row.');
  }

  const columns = parsed.meta.fields ?? [];
  if (columns.length === 0) throw new Error('No columns found in file.');

  const originalRowCount = parsed.data.length;
  const { rows, downsampled } = downsample(parsed.data, MAX_ROWS);

  // Determine which columns are numeric across a sample of rows — those become the feature vector.
  const sampleSize = Math.min(rows.length, 50);
  const featureColumns = columns.filter((col) =>
    rows.slice(0, sampleSize).every((row) => isNumeric(row[col]))
  );

  if (featureColumns.length === 0) {
    throw new Error(
      'No numeric columns found. The projector needs at least 2 numeric feature columns.'
    );
  }

  if (featureColumns.length > MAX_DIMENSIONS) {
    throw new Error(
      `Too many numeric columns (${featureColumns.length}). Limit is ${MAX_DIMENSIONS}.`
    );
  }

  const metadataColumns = columns.filter((col) => !featureColumns.includes(col));
  const labelColumn = metadataColumns[0] ?? featureColumns[0] ?? null;

  const points: DataPoint[] = rows.map((row, idx) => {
    const vector = featureColumns.map((col) => Number(row[col]) || 0);
    const metadata: Record<string, string | number> = {};
    metadataColumns.forEach((col) => {
      const val = row[col];
      metadata[col] = isNumeric(val) ? Number(val) : val;
    });

    return {
      id: `row-${idx}`,
      vector,
      label: labelColumn ? String(row[labelColumn] ?? `Row ${idx}`) : `Row ${idx}`,
      metadata,
    };
  });

  return { points, featureColumns, metadataColumns, labelColumn, downsampled, originalRowCount };
}

// ── Sample dataset — zero-cost demo, generated entirely client-side ────────

export function generateSampleDataset(): ParsedDataset {
  const DIMS = 24;
  const CLUSTERS = 6;
  const PER_CLUSTER = 60;
  const names = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta'];

  const featureColumns = Array.from({ length: DIMS }, (_, i) => `dim_${i}`);
  const points: DataPoint[] = [];

  for (let c = 0; c < CLUSTERS; c++) {
    const center = Array.from({ length: DIMS }, () => (Math.random() - 0.5) * 10);

    for (let i = 0; i < PER_CLUSTER; i++) {
      const vector = center.map((v) => v + (Math.random() - 0.5) * 2.2);
      points.push({
        id: `sample-${c}-${i}`,
        vector,
        label: `${names[c]}-${i}`,
        metadata: { cluster: names[c] },
      });
    }
  }

  return {
    points,
    featureColumns,
    metadataColumns: ['cluster'],
    labelColumn: 'cluster',
    downsampled: false,
    originalRowCount: points.length,
  };
}
