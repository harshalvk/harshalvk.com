import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { SiGithub } from 'react-icons/si';
import Link from 'next/link';
import SectionBorders from '@/components/shared/SectionBorders';
import { inter } from '@/lib/fonts';
import { Title } from '@/components/Typography';

const AboutMe = () => {
  return (
    <section className="border-border relative border border-t-0 border-b-0">
      <SectionBorders />
      <div className="bg-hatching screen-line-top screen-line-bottom h-4 w-full" />
      <Title text="About Me." className="px-4 py-1" />
      <div className="bg-hatching screen-line-top screen-line-bottom h-4 w-full" />

      <div className="space-y-4 p-4">
        <ul
          className={`list-disc space-y-2 pl-6 text-lg text-zinc-600 dark:text-zinc-400 ${inter.style.fontFamily} marker:text-zinc-600 dark:marker:text-zinc-400`}
        >
          <li>
            I&apos;ve been coding for the past 3 years, mainly focusing on web development and
            building scalable backend systems.
          </li>
          <li>
            In this time, I&apos;ve worked with various technologies to create fast, responsive
            applications, from backend architecture to frontend development and deployment.
          </li>
          <li>
            I enjoy solving real-world problems with code and constantly aim to improve while
            staying current with tech trends.
          </li>
        </ul>

        <div className="flex flex-wrap items-center gap-5">
          <Button
            variant={'secondary'}
            className="group flex items-center justify-center rounded-sm border"
          >
            <Link
              href={'https://github.com/harshalvk/'}
              target="_blank"
              className="flex items-center gap-1"
            >
              <SiGithub size={5} />
              View my GitHub
              <ArrowRight
                size={5}
                className="-translate-x-0 transition duration-200 group-hover:translate-x-0.5"
              />
            </Link>
          </Button>
          <Button variant={'outline'} className="group rounded-sm">
            Contact me
            <ArrowRight
              size={5}
              className="-translate-x-0 transition duration-200 group-hover:translate-x-0.5"
            />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
