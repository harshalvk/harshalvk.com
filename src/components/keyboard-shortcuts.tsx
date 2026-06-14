'use client';

import { useRouter } from 'next/navigation';
import { useHotkeys } from 'react-hotkeys-hook';

export function KeyboardShortcuts() {
  const router = useRouter();

  const navigate = (path: string, keys: string) => {
    router.push(path);
  };

  useHotkeys('g>h', () => navigate('/', 'g>h'));
  useHotkeys('g>c', () => navigate('/components', 'g>c'));
  useHotkeys('g>l', () => navigate('/blog', 'g>l'));

  return null;
}
