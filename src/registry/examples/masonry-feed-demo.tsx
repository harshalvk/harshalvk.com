import { MasonryFeed } from '@/registry/components/masonry-feed';

const images = [
  {
    src: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=500&fit=crop',
    alt: 'retro acrade machine',
  },
  {
    src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=600&fit=crop',
    alt: 'circuit board macro green traces',
  },
  {
    src: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=700&h=400&fit=crop',
    alt: 'dark minimal mobile reflection',
  },
  {
    src: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=350&h=700&fit=crop',
    alt: 'cybersecuity digital',
  },
  {
    src: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=900&h=350&fit=crop',
    alt: 'team working',
  },
  {
    src: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=500&h=800&fit=crop',
    alt: 'macbook pro dark desk minimal',
  },
  {
    src: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=450&fit=crop',
    alt: 'earth from space',
  },
  {
    src: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=450&h=650&fit=crop',
    alt: 'code matrix',
  },
  {
    src: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=750&h=500&fit=crop',
    alt: 'laptop on desk',
  },
  {
    src: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=550&fit=crop',
    alt: 'server room',
  },
];

const MasonryFeedDemo = () => {
  return (
    <>
      <MasonryFeed images={images} lightbox carousel />
    </>
  );
};

export default MasonryFeedDemo;
