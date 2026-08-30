import React from 'react';
import { Icons } from './icons/icons';
import { FlameIcon } from 'lucide-react';

const COMPONENT_ICON: Record<string, React.ReactNode> = {
  'ascii-dither': <Icons.asciiDither />,
  'component-playground': <Icons.componentPlayground />,
  'drag-to-confirm': <Icons.dragToConfirm />,
  'key-screen': <Icons.keyScreen />,
  'masonry-feed': <Icons.masonryFeed />,
  'scratch-card': <Icons.scratchCard />,
  'wallet-adapter': <Icons.walletAdapter />,
};

const ComponentsIcon = ({ slug }: { slug: string }) => {
  return COMPONENT_ICON[slug] ?? <FlameIcon />;
};

export default ComponentsIcon;
