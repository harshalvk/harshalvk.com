'use client';

import React from 'react';
import { motion } from 'motion/react';
import TechBadge from './TechBadge';

type myTechLogosType = {
  name: string;
  item: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const MotionBadge = ({ badges, reverse }: { badges: myTechLogosType[]; reverse?: boolean }) => {
  return (
    <div className="mt-2 flex overflow-hidden overflow-x-clip [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <motion.div
        initial={{
          x: reverse ? '-50%' : 0,
        }}
        animate={{
          x: reverse ? 0 : '-50%',
        }}
        transition={{
          duration: 60,
          ease: 'linear',
          repeat: Infinity,
        }}
        className="flex flex-none gap-2"
      >
        {Array.from({ length: 2 }).map((_, i) => (
          <React.Fragment key={i}>
            {badges.map((badge, idx) => (
              <TechBadge icon={badge.item} key={idx} name={badge.name} />
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};

export default MotionBadge;
