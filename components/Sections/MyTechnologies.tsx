'use client';

import React from 'react';
import {
  frameworksAndLibraries,
  backendAndDatabases,
  devopsAndCloud,
  programmingLanguagesAndOthers,
} from '@/components/constants';
import { Title } from '../Typography';
import MotionBadge from '../MotionBadge';
import SectionBorders from '../shared/SectionBorders';

const MyTechnologies = () => {
  return (
    <section className="border-border relative border border-t-0 border-b-0">
      <SectionBorders />
      <div className="bg-hatching screen-line-top screen-line-bottom h-4 w-full" />
      <Title text="Technologies I Use." className="px-4 py-1" />
      <div className="bg-hatching screen-line-top screen-line-bottom h-4 w-full" />
      <div className="p-4">
        <p className="text-muted-foreground font-mono leading-5">
          Over the years, I have worked with a variety of technologies. Here are some of the
          technologies I have experience with:
        </p>
        <MotionBadge badges={frameworksAndLibraries} />
        <MotionBadge badges={backendAndDatabases} reverse={true} />
        <MotionBadge badges={devopsAndCloud} />
        <MotionBadge badges={programmingLanguagesAndOthers} reverse={true} />
        <p className="text-muted-foreground mt-1 text-center font-mono">...and many more!</p>
      </div>
    </section>
  );
};

export default MyTechnologies;
