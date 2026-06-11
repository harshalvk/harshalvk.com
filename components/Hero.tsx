'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { SectionCorners } from './shared/Navbar';
import { inter } from '@/lib/fonts';

const Hero = () => {
  return (
    <section className="border-border relative border border-t-0 border-b-0 p-4 sm:p-6 md:p-8">
      <SectionCorners />

      <div className="flex w-full flex-col items-start gap-4 sm:flex-row sm:items-end sm:gap-6">
        <Image
          alt="Profile"
          src="/profile.png"
          height={200}
          width={200}
          className="h-32 w-32 rounded-sm object-cover sm:h-40 sm:w-40 md:h-48 md:w-48 lg:h-52 lg:w-52"
        />
        <div className="flex w-full items-center justify-between">
          <div>
            <h1 className="text-xl tracking-tight sm:text-2xl md:text-3xl lg:text-4xl">
              Hey, I&apos;m Harshal
            </h1>
            <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
              A Full Stack Developer
            </h3>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-4 sm:mt-6 sm:space-y-5">
        <p
          className={cn(
            'text-base leading-6 text-zinc-600 sm:text-lg sm:leading-7 dark:text-zinc-400',
            inter.style.fontFamily
          )}
        >
          I create quick, scalable, and user-friendly web applications with a mix of tidy code and
          well-considered design.
        </p>
        {/* <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-5">
          <Button
            variant="secondary"
            className="flex items-center justify-center group rounded-sm border w-full sm:w-auto"
          >
            Contact Me
            <ArrowRight
              size={16}
              className="ml-2 -translate-x-0 group-hover:-rotate-45 transition duration-200"
            />
          </Button>
          <Button variant="outline" className="rounded-sm w-full sm:w-auto">
            Resume
          </Button>
        </div> */}
      </div>
    </section>
  );
};

export default Hero;
