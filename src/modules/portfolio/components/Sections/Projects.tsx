import SectionBorders from '@/components/shared/SectionBorders';
import {
  Panel,
  PanelHeader,
  PanelTitle,
  PanelTitleSup,
} from '@/modules/portfolio/components/panel';
import { PROJECTS } from '@/modules/portfolio/data/projects';
import { CollapsibleList } from '../../../../components/collapsible-list';

const ID = 'projects';

const Projects = () => {
  return (
    <Panel id={ID}>
      <SectionBorders />
      <PanelHeader>
        <PanelTitle>
          <a href={`#${ID}`}>Projects.</a>
          <PanelTitleSup>({PROJECTS.length})</PanelTitleSup>
        </PanelTitle>
      </PanelHeader>

      <CollapsibleList variant="projects" items={PROJECTS} />
    </Panel>
  );
};

export default Projects;
