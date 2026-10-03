const siteUrl = 'https://www.harshalvk.com';

const person = {
  '@type': 'Person',
  '@id': `${siteUrl}/#person`,
  name: 'Harshal Khobragade',
  url: siteUrl,
  jobTitle: 'Software Engineer',
  description:
    'Software engineer focused on backend systems, distributed infrastructure, and developer tools.',
  sameAs: [
    'https://github.com/harshalvk',
    'https://www.linkedin.com/in/harshalvk/',
    'https://x.com/harshalvk_',
  ],
};

const website = {
  '@type': 'WebSite',
  '@id': `${siteUrl}/#website`,
  url: siteUrl,
  name: 'Harshal Khobragade',
  description: 'Portfolio, software projects, and technical writing by Harshal Khobragade.',
  publisher: {
    '@id': `${siteUrl}/#person`,
  },
  inLanguage: 'en',
};

export function PersonJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      person,
      website,
      {
        '@type': 'WebPage',
        '@id': `${siteUrl}/#webpage`,
        url: siteUrl,
        name: 'Harshal Khobragade | Software Engineer',
        description: 'Software engineering portfolio, projects, and technical articles.',
        isPartOf: {
          '@id': `${siteUrl}/#website`,
        },
        about: {
          '@id': `${siteUrl}/#person`,
        },
        inLanguage: 'en',
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
