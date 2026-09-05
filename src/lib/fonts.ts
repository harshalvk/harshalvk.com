import { Geist, Inter } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
});

export const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist',
  preload: true,
});
