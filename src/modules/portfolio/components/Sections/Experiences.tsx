import React from 'react';
import { Panel, PanelHeader, PanelTitle } from '@/modules/portfolio/components/panel';
import SectionBorders from '@/components/shared/SectionBorders';
import { CollapsibleList } from '@/components/collapsible-list';
import { EXPERIENCES } from '../../data/experiences';

const ID = 'experiences';

const Experiences = () => {
  return (
    <Panel id={ID}>
      <SectionBorders />
      <PanelHeader>
        <PanelTitle>
          <a href={`#${ID}`}>Experiences.</a>
        </PanelTitle>
      </PanelHeader>
      <CollapsibleList variant="experiences" items={EXPERIENCES} />
    </Panel>
  );
};

export default Experiences;
