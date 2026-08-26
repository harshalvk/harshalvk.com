import { ImageResponse } from '@vercel/og';

export const runtime = 'nodejs';

export async function GET() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 60,
        color: 'black',
        background: 'white',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      Hello world
    </div>,
    {
      width: 600,
      height: 400,
    }
  );
}
