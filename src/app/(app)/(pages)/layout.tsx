'use client';

import { ArrowLeftIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

const PagesLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 lg:px-0">
      <div className="bg-hatching screen-line-bottom h-4 border-x" />
      <div className="w-full border-x">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-muted-foreground hover:text-primary flex w-fit cursor-pointer items-center gap-1 px-4 py-1 text-sm transition-colors select-none"
        >
          <ArrowLeftIcon className="size-3.5" />
          Back
        </button>
      </div>

      <div className="screen-line-top bg-hatching screen-line-bottom h-4 border-x" />
      {children}
    </section>
  );
};

export default PagesLayout;
