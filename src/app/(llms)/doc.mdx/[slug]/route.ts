import { getLLMText } from '@/lib/get-llm-text';
import { getAllDocs } from '@/modules/doc/data/document';
import { notFound } from 'next/navigation';

export const revalidate = false;
export const dynamic = 'force-static';
export const dynamicParams = false;

export async function generateStaticParams() {
  const docs = await getAllDocs();

  return docs.map((doc) => ({
    slug: doc.slug,
  }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const allDocs = await getAllDocs();
  const post = allDocs.find((doc) => doc.slug === slug);

  if (!post) {
    notFound();
  }

  return new Response(await getLLMText(post), {
    headers: {
      'Content-Type': 'text/markdown;charset=utf-8',
    },
  });
}
