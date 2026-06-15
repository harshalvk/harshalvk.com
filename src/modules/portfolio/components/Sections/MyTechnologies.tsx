import {
  JavaScript,
  Nextjs,
  React,
  TypeScript,
  TailwindCSS,
  shadcnui,
  Hono,
  Expressjs,
  tRPC,
  GraphQL,
  Zod,
  PostgreSQL,
  MongoDB,
  Redis,
  Supabase,
  DrizzleORM,
  Prisma,
  Docker,
  Vercel,
  AmazonWebServices,
  Cloudflare,
  Linux,
  Rust,
  Solidity,
  GitHub,
  Ollama,
  Turborepo,
} from '@/components/icons';
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
      { name: 'Next.js', icon: Nextjs, url: 'https://nextjs.org/' },
      { name: 'React', icon: React, url: 'https://react.dev/' },
      { name: 'TypeScript', icon: TypeScript, url: 'https://www.typescriptlang.org/' },
      { name: 'Tailwind CSS', icon: TailwindCSS, url: 'https://tailwindcss.com/' },
      { name: 'shadcn/ui', icon: shadcnui, url: 'https://ui.shadcn.com/' },
    ],
    categoryIcon: LayoutPanelTop,
  },
  {
    label: 'Backend',
    techs: [
      { name: 'Hono', icon: Hono, url: 'https://hono.dev/' },
      { name: 'Express', icon: Expressjs, url: 'https://expressjs.com/' },
      { name: 'tRPC', icon: tRPC, url: 'https://trpc.io/' },
      { name: 'GraphQL', icon: GraphQL, url: 'https://graphql.org/' },
      { name: 'Zod', icon: Zod, url: 'https://zod.dev/' },
    ],
    categoryIcon: Boxes,
  },
  {
    label: 'Database',
    techs: [
      { name: 'PostgreSQL', icon: PostgreSQL, url: 'https://www.postgresql.org/' },
      { name: 'MongoDB', icon: MongoDB, url: 'https://www.mongodb.com/' },
      { name: 'Redis', icon: Redis, url: 'https://redis.io/' },
      { name: 'Supabase', icon: Supabase, url: 'https://supabase.com/' },
      { name: 'Drizzle ORM', icon: DrizzleORM, url: 'https://orm.drizzle.team/' },
      { name: 'Prisma', icon: Prisma, url: 'https://www.prisma.io/' },
    ],
    categoryIcon: Database,
  },
  {
    label: 'DevOps & Cloud',
    techs: [
      { name: 'Docker', icon: Docker, url: 'https://www.docker.com/' },
      { name: 'Vercel', icon: Vercel, url: 'https://vercel.com/' },
      { name: 'AWS', icon: AmazonWebServices, url: 'https://aws.amazon.com/' },
      { name: 'Cloudflare', icon: Cloudflare, url: 'https://www.cloudflare.com/' },
      { name: 'Linux', icon: Linux, url: 'https://www.linux.org/' },
    ],
    categoryIcon: CloudCog,
  },
  {
    label: 'Languages',
    techs: [
      {
        name: 'JavaScript',
        icon: JavaScript,
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
      },
      { name: 'TypeScript', icon: TypeScript, url: 'https://www.typescriptlang.org/' },
      { name: 'Rust', icon: Rust, url: 'https://www.rust-lang.org/' },
      { name: 'Solidity', icon: Solidity, url: 'https://soliditylang.org/' },
    ],
    categoryIcon: Binary,
  },
  {
    label: 'Tools',
    techs: [
      { name: 'GitHub', icon: GitHub, url: 'https://github.com/' },
      { name: 'Ollama', icon: Ollama, url: 'https://ollama.com/' },
      { name: 'Turborepo', icon: Turborepo, url: 'https://turbo.build/' },
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

        <div className="divide-dashedn md:divide-normal divide-y border-t border-dashed sm:divide-y">
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
