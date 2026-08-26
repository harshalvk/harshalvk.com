import { ImageResponse } from '@vercel/og';
import fs from 'fs';
import path from 'path';
import React from 'react';

import { getDocBySlug } from '@/modules/doc/data/document';
import { ogPages } from '@/config/og';

export const runtime = 'nodejs';

type RouteParams = {
  params: Promise<{
    slug: string[];
  }>;
};

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;

    const { searchParams } = new URL(request.url);

    const customTitle = searchParams.get('title');
    const customDescription = searchParams.get('description');

    let title: string | null = null;
    let description: string | null = null;

    /*
     * /og/custom?title=Hello&description=World
     */
    if (slug.length === 1 && slug[0] === 'custom') {
      if (!customTitle || !customDescription) {
        return new Response('Missing title or description', {
          status: 400,
        });
      }

      title = customTitle;
      description = customDescription;
    } else if (slug.length === 1) {
      /*
       * /og/components
       * /og/blog
       * /og/theia
       */
      const pageSlug = slug[0];

      const page = ogPages[pageSlug as keyof typeof ogPages];

      if (!page) {
        return new Response('OG page not found', {
          status: 404,
        });
      }

      title = page.title;
      description = page.description;
    } else if (slug.length === 2) {
      /*
       * /og/blog/ttl
       * /og/components/infinite-canvas
       */
      const [type, documentSlug] = slug;

      if (!['blog', 'components'].includes(type)) {
        return new Response('Invalid OG type', {
          status: 400,
        });
      }

      const validCategories = {
        blog: 'blogs',
        components: 'components',
      } as const;

      const category = type as keyof typeof validCategories;

      const doc = await getDocBySlug(documentSlug);

      if (!doc) {
        return new Response('Document not found', {
          status: 404,
        });
      }

      if (doc.metadata.category !== validCategories[category]) {
        return new Response('Category mismatch', {
          status: 400,
        });
      }

      title = doc.metadata.title;
      description = doc.metadata.description;
    } else {
      return new Response('Invalid OG route', {
        status: 400,
      });
    }

    if (customTitle) {
      title = customTitle;
    }

    if (customDescription) {
      description = customDescription;
    }

    if (!title || !description) {
      return new Response('Missing OG title or description', {
        status: 400,
      });
    }

    return generateOGImage(title, description);
  } catch (error) {
    console.error('Error generating OG image:', error);

    return new Response('Internal Server Error', {
      status: 500,
    });
  }
}

type EdgePosition = {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  width?: string;
};

const CANVAS_WIDTH = 2400;

const TITLE_POSITION: EdgePosition = {
  bottom: '515px',
  left: '100px',
  right: '100px',
};

const DESCRIPTION_POSITION: EdgePosition = {
  bottom: '380px',
  left: '355px',
  right: '100px',
  width: '1700px',
};

function buildPositionStyle(position: EdgePosition) {
  const style: Record<string, string> = {};
  if (position.top !== undefined) style.top = position.top;
  if (position.bottom !== undefined) style.bottom = position.bottom;
  if (position.width !== undefined) {
    style.width = position.width;
    // auto-center horizontally when only width is given (no left/right)
    if (position.left === undefined && position.right === undefined) {
      const widthPx = parseFloat(position.width);
      style.left = `${(CANVAS_WIDTH - widthPx) / 2}px`;
    }
  }
  if (position.left !== undefined) style.left = position.left;
  if (position.right !== undefined) style.right = position.right;
  return style;
}

function generateOGImage(title: string, description: string) {
  const imagePath = path.join(process.cwd(), 'public', 'og', 'baseOG.png');

  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString('base64');

  const interRegularPath = path.join(process.cwd(), 'public', 'fonts', 'InterDisplay-Regular.ttf');

  const interBoldPath = path.join(process.cwd(), 'public', 'fonts', 'InterDisplay-Medium.ttf');

  const interRegular = fs.readFileSync(interRegularPath);

  const interBold = fs.readFileSync(interBoldPath);

  const element = React.createElement(
    'div',
    {
      style: {
        width: '2400px',
        height: '1260px',
        position: 'relative',
        display: 'flex',
        boxSizing: 'border-box',
        backgroundImage: `url(data:image/png;base64,${base64Image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily: 'Inter',
      },
    },

    React.createElement(
      'div',
      {
        style: {
          display: 'flex',
          position: 'absolute',
          ...buildPositionStyle(TITLE_POSITION),
          fontFamily: 'Inter',
          fontSize: '130px',
          fontWeight: 700,
          lineHeight: 1.1,
          color: '#ffffff',
          letterSpacing: '3px',
          textAlign: 'center',
          justifyContent: 'center',
        },
      },
      title
    ),

    React.createElement(
      'div',
      {
        style: {
          display: 'flex',
          position: 'absolute',
          ...buildPositionStyle(DESCRIPTION_POSITION),
          fontFamily: 'Inter',
          fontSize: '54px',
          fontWeight: 400,
          lineHeight: 1.2,
          color: 'rgba(255, 255, 255, 0.62)',
          letterSpacing: '2px',
          textAlign: 'center',
          justifyContent: 'center',
        },
      },
      description
    )
  );

  return new ImageResponse(element, {
    width: 2400,
    height: 1260,

    fonts: [
      {
        name: 'Inter',
        data: interRegular,
        weight: 400,
        style: 'normal',
      },
      {
        name: 'Inter',
        data: interBold,
        weight: 700,
        style: 'normal',
      },
    ],
  });
}
