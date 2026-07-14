import type { Route } from 'next';

import { USER } from '@/modules/portfolio/data/user';

export type NavItem<T extends string = string> = {
  title: string;
  href: T;
};

export const SITE_INFO = {
  name: USER.firstName,
  url: process.env.NEXT_PUBLIC_APP_URL!,
  ogImage: USER.ogImage,
  description: USER.bio,
  keywords: USER.keywords,
  author: USER.firstName,
};

export const LICENSE = {
  name: 'MIT License',
  url: 'https://github.com/harshalvk/harshalvk.com/blob/main/LICENSE',
};

export const META_THEME_COLORS = {
  light: '#ffffff',
  dark: '#0B0B0D',
};

export const MAIN_NAV: NavItem<Route>[] = [
  {
    title: 'Components',
    href: '/components',
  },
  {
    title: 'Blog',
    href: '/blog',
  },
];

export const MOBILE_NAV: NavItem<Route>[] = [
  {
    title: 'Home',
    href: '/',
  },
  ...MAIN_NAV,
];

export const X_HANDLE = '@harshalvk_';
export const GITHUB_USERNAME = 'harshalvk';
export const SOURCE_CODE_GITHUB_REPO = 'harshalvk/harshalvk.com';
export const SOURCE_CODE_GITHUB_URL = 'https://github.com/harshalvk/harshalvk.com';

export const UTM_PARAMS = {
  utm_source: 'harshalvk.com',
};
