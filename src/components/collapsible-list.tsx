'use client';

import React from 'react';
import type { Experience } from '@/modules/portfolio/types/experiences';
import type { Project } from '@/modules/portfolio/types/projects';
import { ExperienceItem } from '@/modules/portfolio/components/experience-item';
import { ProjectItem } from '@/modules/portfolio/components/project-item';

type CollapsibleListProps =
  | {
      variant: 'experiences';
      items: Experience[];
    }
  | {
      variant: 'projects';
      items: Project[];
    };

export function CollapsibleList(props: CollapsibleListProps) {
  return (
    <div>
      {props.items.map((item) => (
        <div key={item.id}>
          {props.variant === 'experiences' ? (
            <ExperienceItem experience={item as Experience} />
          ) : (
            <ProjectItem project={item as Project} />
          )}
        </div>
      ))}
    </div>
  );
}
