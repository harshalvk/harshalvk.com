import type { Metadata } from 'next';

import { SITE_INFO, X_HANDLE } from './site';

export const defaultWebsiteMetadata: Metadata = {
  metadataBase: new URL(SITE_INFO.url),
  title: {
    default: `${SITE_INFO.name} \u2013 Engineer`,
    template: `%s — ${SITE_INFO.name}`,
  },
  description: SITE_INFO.description,
  keywords: SITE_INFO.keywords,
  authors: [
    {
      name: SITE_INFO.author,
      url: SITE_INFO.url,
    },
  ],
  creator: SITE_INFO.author,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_INFO.url,
    title: `${SITE_INFO.name} \u2013 Engineer`,
    description: SITE_INFO.description,
    siteName: SITE_INFO.name,
    images: [
      {
        url: SITE_INFO.ogImage,
        width: 1200,
        height: 630,
        alt: `${SITE_INFO.name} \u2013 Engineer`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_INFO.name} \u2013 Engineer`,
    description: SITE_INFO.description,
    images: [SITE_INFO.ogImage],
    creator: X_HANDLE,
  },
  icons: {
    icon: '/profile.png',
  },
};

interface GenerateMetadataParams {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  keywords?: string[];
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
}

export function generateWebsiteMetadata({
  title,
  description,
  image,
  url,
  keywords,
  type = 'website',
  publishedTime,
  modifiedTime,
}: GenerateMetadataParams = {}): Metadata {
  const finalTitle = title || `${SITE_INFO.name} \u2013 Engineer`;
  const finalDescription = description || SITE_INFO.description;
  const finalImage = image || SITE_INFO.ogImage;
  const finalKeywords = keywords
    ? [...new Set([...SITE_INFO.keywords, ...keywords])]
    : SITE_INFO.keywords;

  return {
    title: finalTitle,
    description: finalDescription,
    keywords: finalKeywords,
    alternates: url ? { canonical: url } : undefined,
    openGraph: {
      url,
      type,
      title: finalTitle,
      description: finalDescription,
      publishedTime,
      modifiedTime,
      images: [
        {
          url: finalImage,
          width: 1200,
          height: 630,
          alt: finalTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: finalTitle,
      description: finalDescription,
      images: [finalImage],
    },
  };
}
