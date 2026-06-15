import Link from 'next/link';
import { ArrowLeft, FileQuestion } from 'lucide-react';
import { SectionCorners } from '@/components/shared/Navbar';

export default function NotFound() {
  return (
    <section className="border-border relative flex min-h-[70vh] items-center justify-center border-x">
      <div className="mx-auto max-w-2xl px-6">
        <div className="border-border bg-hatching relative flex flex-col items-start gap-6 border p-6 md:flex-row md:items-center md:p-8">
          <SectionCorners />

          <div className="border-border bg-background relative flex h-24 w-24 shrink-0 items-center justify-center border">
            <FileQuestion className="text-muted-foreground h-10 w-10" strokeWidth={1.5} />
          </div>

          <div>
            <p className="text-muted-foreground mb-2 font-mono text-sm">Hey, I&apos;m 404</p>
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Page Not Found</h1>
          </div>
        </div>

        <p className="text-muted-foreground mt-6 max-w-md">
          This route doesn&apos;t exist. It may have been moved or is still being built.
        </p>

        <Link
          href="/"
          className="border-border hover:bg-accent mt-8 inline-flex items-center gap-2 rounded-sm border px-4 py-2 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
      </div>
    </section>
  );
}
