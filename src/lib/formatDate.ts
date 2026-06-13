export function formatDate(date: string): string {
  const parts = date.split('.');

  // DD.MM.YYYY -> 1 Jan 2024
  if (parts.length === 3) {
    const [day, month, year] = parts;

    return new Date(Number(year), Number(month) - 1, Number(day)).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  // MM.YYYY -> Jan 2024
  if (parts.length === 2) {
    const [month, year] = parts;

    return new Date(Number(year), Number(month) - 1).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  }

  // YYYY -> 2024
  return date;
}
