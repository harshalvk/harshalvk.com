import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import AppProvider from '@/components/Providers/AppProvider';
import Script from 'next/script';

import '@/styles/globals.css';

import { defaultWebsiteMetadata } from '@/config/metadata';
import { PersonJsonLd } from '@/components/seo/person-jsonld';

export const metadata: Metadata = {
  ...defaultWebsiteMetadata,
  other: {
    'google-site-verification': '',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://vercel.com" />
        <link rel="dns-prefetch" href="https://vercel.com" />
      </head>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} flex min-h-svh w-screen flex-col font-sans antialiased`}
      >
        <PersonJsonLd />
        <a
          href="#main-content"
          className="focus:bg-primary focus:text-primary-foreground sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded focus:px-4 focus:py-2"
        >
          Skip to main content
        </a>
        <Script
          src="https://vercel.com/analytics/script.js"
          strategy="lazyOnload"
          data-element
          data-domain="harshalvk.com"
        />
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
