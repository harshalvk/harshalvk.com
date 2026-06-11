'use client';

import React from 'react';
import { projects } from '@/components/constants';
import { Check, ChevronsUpDown, Link } from 'lucide-react';
import { Title } from '@/components/Typography';
import SectionBorders from '@/components/shared/SectionBorders';
import { inter } from '@/lib/fonts';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { AnimatePresence, motion } from 'motion/react';

const Projects = () => {
  return (
    <section className="border-border relative border border-t-0 border-b-0">
      <SectionBorders />
      <div className="bg-hatching screen-line-top screen-line-bottom h-4 w-full" />
      <Title text="Projects." className="px-4 py-1" />
      <div className="bg-hatching screen-line-top screen-line-bottom h-4 w-full" />

      <div className={` ${inter.style.fontFamily}`}>
        <div className="overflow-hidden">
          {projects.map((project) => (
            <ProjectBlock
              key={project.title}
              title={project.title}
              description={project.description}
              imageSrc={project.imageSrc}
              techBadge={project.techBadge}
              link={project.link}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

function ProjectBlock({
  title,
  description,
  imageSrc,
  techBadge,
  link,
  icon,
}: {
  title: string;
  description: string;
  imageSrc: string;
  techBadge: {
    name: string;
    item: React.ReactNode;
  }[];
  link: string;
  icon?: string;
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <div className="flex h-16 w-full items-center border-b select-none">
          <div className="flex h-full items-center border-r border-dashed p-4">
            <Check />
          </div>
          <div className="flex h-full w-full items-center justify-between gap-1 px-3">
            <div>
              <h1 className="text-xl font-medium">{title}</h1>
              <p className="text-muted-foreground text-sm font-medium">Date</p>
            </div>
            <div className="flex">
              <Link className="text-muted-foreground h-4 w-4" />
              <ChevronsUpDown className="text-muted-foreground h-4 w-4" />
            </div>
          </div>
        </div>
      </CollapsibleTrigger>
      <AnimatePresence initial={false} mode="wait">
        {isOpen && (
          <CollapsibleContent forceMount asChild>
            <motion.div
              initial={{
                height: 0,
                opacity: 0,
              }}
              animate={{
                height: 'auto',
                opacity: 1,
              }}
              exit={{
                height: 0,
                opacity: 0,
              }}
              transition={{
                height: {
                  duration: 0.35,
                  ease: [0.22, 1, 0.36, 1], // smooth ease-out
                },
                opacity: {
                  duration: 0.2,
                  delay: 0.05,
                },
              }}
              className="overflow-hidden border-b"
            >
              <motion.div
                initial={{ y: -8 }}
                animate={{ y: 0 }}
                exit={{ y: -8 }}
                transition={{
                  duration: 0.3,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex flex-col gap-2"
              >
                <div className="px-4 py-2 text-sm">
                  <p className="font-medium">Shipping address</p>
                  <p className="text-muted-foreground">100 Market St, San Francisco</p>
                </div>

                <div className="px-4 py-2 text-sm">
                  <p className="font-medium">Items</p>
                  <p className="text-muted-foreground">2x Studio Headphones</p>
                </div>
              </motion.div>
            </motion.div>
          </CollapsibleContent>
        )}
      </AnimatePresence>
    </Collapsible>
  );
}

export default Projects;
