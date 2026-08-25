export function formatDate(date: string | Date): string {
  if (date instanceof Date) {
    return date.toLocaleString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  }

  const parts = date.split('.');

  // DD.MM.YYYY
  if (parts.length === 3) {
    const [, month, year] = parts;
    return new Date(Number(year), Number(month) - 1).toLocaleString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  }

  // MM.YYYY
  if (parts.length === 2) {
    const [month, year] = parts;
    return new Date(Number(year), Number(month) - 1).toLocaleString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  }

  // YYYY
  return date;
}
