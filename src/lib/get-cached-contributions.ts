import { unstable_cache } from 'next/cache';

export const getCachedContributions = unstable_cache(
  async (username: string) => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const res = await fetch(
        `${process.env.GITHUB_CONTRIBUTIONS_API_URL || `https://github-contributions-api.jogruber.de`}/v4/${username}?y=last`,
        { signal: controller.signal }
      );

      clearTimeout(timeout);

      if (!res.ok) return [];

      const data = await res.json();
      return data.contributions ?? [];
    } catch (e) {
      // On fetch failure (timeout, network error, etc.), return empty contributions to avoid build/prerender failure
      return [];
    }
  },
  ['github-contributions'],
  { revalidate: 86400 } // Cache for 1 day (86400 seconds)
);
