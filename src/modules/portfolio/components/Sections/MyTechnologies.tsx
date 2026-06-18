import { Icons } from '@/components/icons/icons';
import SectionBorders from '@/components/shared/SectionBorders';
import TechBadge from '@/components/TechBadge';
import { Panel, PanelContent, PanelHeader, PanelTitle } from '@/modules/portfolio/components/panel';
import {
  LayoutPanelTop,
  Boxes,
  Database,
  CloudCog,
  Binary,
  Hammer,
  LucideIcon,
} from 'lucide-react';

export type Tech = {
  name: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  url?: string;
};

type TechGroup = {
  label: string;
  techs: Tech[];
  categoryIcon: LucideIcon;
};

const TECH_GROUPS: TechGroup[] = [
  {
    label: 'Frontend',
    techs: [
      { name: 'Next.js', icon: Icons.nextjs, url: 'https://nextjs.org/' },
      { name: 'React', icon: Icons.react, url: 'https://react.dev/' },
      { name: 'TypeScript', icon: Icons.typescript, url: 'https://www.typescriptlang.org/' },
      { name: 'Tailwind CSS', icon: Icons.typescript, url: 'https://tailwindcss.com/' },
      { name: 'shadcn/ui', icon: Icons.shadcn, url: 'https://ui.shadcn.com/' },
    ],
    categoryIcon: LayoutPanelTop,
  },
  {
    label: 'Backend',
    techs: [
      { name: 'Hono', icon: Icons.hono, url: 'https://hono.dev/' },
      { name: 'Express', icon: Icons.expressjs, url: 'https://expressjs.com/' },
      { name: 'tRPC', icon: Icons.trpc, url: 'https://trpc.io/' },
      { name: 'GraphQL', icon: Icons.graphql, url: 'https://graphql.org/' },
      { name: 'Zod', icon: Icons.zod, url: 'https://zod.dev/' },
    ],
    categoryIcon: Boxes,
  },
  {
    label: 'Database',
    techs: [
      { name: 'PostgreSQL', icon: Icons.postgressql, url: 'https://www.postgresql.org/' },
      { name: 'MongoDB', icon: Icons.mongodb, url: 'https://www.mongodb.com/' },
      { name: 'Redis', icon: Icons.redis, url: 'https://redis.io/' },
      { name: 'Supabase', icon: Icons.supabase, url: 'https://supabase.com/' },
      { name: 'Drizzle ORM', icon: Icons.drizzleorm, url: 'https://orm.drizzle.team/' },
      { name: 'Prisma', icon: Icons.prisma, url: 'https://www.prisma.io/' },
    ],
    categoryIcon: Database,
  },
  {
    label: 'DevOps & Cloud',
    techs: [
      { name: 'Docker', icon: Icons.docker, url: 'https://www.docker.com/' },
      { name: 'Vercel', icon: Icons.vercel, url: 'https://vercel.com/' },
      { name: 'AWS', icon: Icons.aws, url: 'https://aws.amazon.com/' },
      { name: 'Cloudflare', icon: Icons.cloudflare, url: 'https://www.cloudflare.com/' },
      { name: 'Linux', icon: Icons.linux, url: 'https://www.linux.org/' },
    ],
    categoryIcon: CloudCog,
  },
  {
    label: 'Languages',
    techs: [
      {
        name: 'JavaScript',
        icon: Icons.javascript,
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
      },
      { name: 'TypeScript', icon: Icons.typescript, url: 'https://www.typescriptlang.org/' },
      { name: 'Rust', icon: Icons.rust, url: 'https://www.rust-lang.org/' },
      { name: 'Solidity', icon: Icons.solidity, url: 'https://soliditylang.org/' },
    ],
    categoryIcon: Binary,
  },
  {
    label: 'Tools',
    techs: [
      { name: 'GitHub', icon: Icons.github, url: 'https://github.com/' },
      { name: 'Ollama', icon: Icons.ollama, url: 'https://ollama.com/' },
      { name: 'Turborepo', icon: Icons.turborepo, url: 'https://turbo.build/' },
    ],
    categoryIcon: Hammer,
  },
];

const ID = 'technologies';

const MyTechnologies = () => {
  return (
    <Panel id={ID}>
      <SectionBorders />
      <PanelHeader>
        <PanelTitle>
          <a href={`#${ID}`}>Technologies I Use.</a>
        </PanelTitle>
      </PanelHeader>
      <PanelContent>
        <p className="text-muted-foreground p-4 leading-5">
          Over the years, I have worked with a variety of technologies. Here are some of the
          technologies I have experience with:
        </p>

        <div className="divide-y divide-dashed border-t border-dashed sm:divide-y">
          {TECH_GROUPS.map((group) => {
            const Icon = group.categoryIcon;

            return (
              <div
                key={group.label}
                className="grid grid-cols-1 divide-dashed sm:grid-cols-[180px_1fr] sm:divide-x"
              >
                <div className="flex items-center space-x-1 px-4 pt-3 pb-2 sm:p-4">
                  <Icon className="text-muted-foreground size-4" />
                  <span className="text-muted-foreground font-mono text-sm">{group.label}</span>
                </div>

                <div className="flex flex-wrap gap-2 px-4 pb-4 sm:p-4">
                  {group.techs.map((tech) => (
                    <TechBadge key={tech.name} {...tech} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </PanelContent>
    </Panel>
  );
};

export default MyTechnologies;
