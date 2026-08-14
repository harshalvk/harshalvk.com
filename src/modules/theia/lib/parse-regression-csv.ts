import Papa from 'papaparse';
import type { RegressionPoint } from '@/modules/theia/types/regression-v2';

const MAX_POINTS = 60;

export async function parseRegressionCSV(file: File): Promise<RegressionPoint[]> {
  const parsed = await new Promise<Papa.ParseResult<Record<string, string>>>((resolve, reject) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: resolve,
      error: reject,
    });
  });

  const columns = parsed.meta.fields ?? [];
  if (columns.length < 2) throw new Error('CSV needs at least two columns (x and y).');

  const [xCol, yCol] = columns;

  const points = parsed.data
    .map((row) => ({ x: Number(row[xCol]), y: Number(row[yCol]) }))
    .filter((p) => !Number.isNaN(p.x) && !Number.isNaN(p.y));

  if (points.length < 2) throw new Error('Not enough valid numeric rows found.');

  points.sort((a, b) => a.x - b.x);
  return points.length > MAX_POINTS ? points.slice(0, MAX_POINTS) : points;
}
