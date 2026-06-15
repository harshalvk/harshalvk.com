import { SITE_INFO } from '@/config/site';
import { getDocsByCategory } from '@/modules/doc/data/document';

export const revalidate = false;
export const dynamic = 'force-static';

const FEED_URL = `${SITE_INFO.url}/rss.xml`;

export async function GET() {
  const blogs = getDocsByCategory('blogs');
  const components = getDocsByCategory('components');

  const allItems = [
    ...blogs.map((doc) => ({
      title: doc.metadata.title,
      link: `${SITE_INFO.url}/blog/${doc.slug}`,
      description: doc.metadata.description ?? '',
      date: doc.metadata.createdAt ? new Date(doc.metadata.createdAt) : new Date(),
      category: 'Blog',
    })),
    ...components.map((doc) => ({
      title: doc.metadata.title,
      link: `${SITE_INFO.url}/components/${doc.slug}`,
      description: doc.metadata.description ?? '',
      date: doc.metadata.createdAt ? new Date(doc.metadata.createdAt) : new Date(),
      category: 'Component',
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  const items = allItems
    .map(
      (item) => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${item.link}</link>
      <guid isPermaLink="true">${item.link}</guid>
      <description><![CDATA[${item.description}]]></description>
      <category>${item.category}</category>
      <pubDate>${item.date.toUTCString()}</pubDate>
    </item>`
    )
    .join('\n');

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${SITE_INFO.name}]]></title>
    <link>${SITE_INFO.url}</link>
    <atom:link href="${FEED_URL}" rel="self" type="application/rss+xml"/>
    <description><![CDATA[${SITE_INFO.description}]]></description>
    <language>en-us</language>
    <ttl>1440</ttl>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new Response(rssXml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200',
    },
  });
}
