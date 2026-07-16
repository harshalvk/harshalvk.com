import { PageViewsResponse } from '@/modules/portfolio/components/pages-view';

export async function getPageViews(): Promise<PageViewsResponse | null> {
  const res = await fetch('/api/page-views');
  if (!res.ok) return null;
  return res.json();
}
