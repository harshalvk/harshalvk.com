'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { SectionCorners } from '../../../../components/shared/Navbar';
import { inter } from '@/lib/fonts';
import { Prose } from '../../../../components/Typography';
import { MarkdownClient } from '../../../../components/markdown';
import { USER } from '@/modules/portfolio/data/user';
import { AnimatePresence, motion } from 'motion/react';

const IMAGES = ['/profile.png', '/profile4.jpg'];

const Hero = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const handleClick = () => {
    setDirection(index === 0 ? 1 : -1);
    setIndex((prev) => (prev === 0 ? 1 : 0));
  };

  return (
    <section className="border-border relative border border-t-0 border-b-0 p-4 sm:p-6 md:p-8">
      <SectionCorners />

      <div className="flex w-full flex-col items-start gap-4 sm:flex-row sm:items-end sm:gap-6">
        <div
          className="relative h-32 w-32 shrink-0 cursor-pointer overflow-hidden rounded-sm sm:h-40 sm:w-40 md:h-48 md:w-48 lg:h-52 lg:w-52"
          onClick={handleClick}
        >
          <AnimatePresence initial={false}>
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="absolute inset-0"
            >
              <Image alt="Profile" src={IMAGES[index]} fill className="object-cover" />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex w-full items-center justify-between">
          <div>
            <h1
              className={`text-xl tracking-tight sm:text-2xl md:text-3xl lg:text-4xl ${inter.className}`}
            >
              Hey, I&apos;m Harshal
            </h1>
            <h3
              className={`text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl ${inter.className}`}
            >
              A Full Stack Developer
            </h3>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-4 sm:mt-6 sm:space-y-5">
        <div
          className={`text-base leading-6 text-zinc-600 sm:text-lg sm:leading-7 dark:text-zinc-400 ${inter.className}`}
        >
          <Prose>
            <MarkdownClient>{USER.bio}</MarkdownClient>
          </Prose>
        </div>
      </div>
    </section>
  );
};

export default Hero;
