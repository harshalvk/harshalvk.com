import type { Metadata, Route } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { ExternalLinkIcon, GitCommitHorizontalIcon } from 'lucide-react';
import { Box } from 'lucide-react';

import { PROJECTS } from '@/modules/portfolio/data/projects';
import { PanelTitle } from '@/modules/portfolio/components/panel';
import { Button } from '@/components/ui/button';
import { MarkdownClient } from '@/components/markdown';
import { Prose } from '@/components/Typography';
import TechBadge from '@/components/TechBadge';
import { formatDate } from '@/lib/formatDate';
import { GITHUB_USERNAME } from '@/config/site';

function parseGitHubRepo(link: string): { owner: string; repo: string } | null {
  if (!link) return null;

  try {
    const url = new URL(link);
    if (!url.hostname.includes('github.com')) return null;

    const [owner, repo] = url.pathname.replace(/^\//, '').replace(/\/$/, '').split('/');
    if (!owner || !repo) return null;

    return { owner, repo };
  } catch {
    return null;
  }
}

type GitHubCommit = {
  sha: string;
  htmlUrl: string;
  message: string;
  authorName: string;
  date: string;
};

async function getRecentCommits(repo: string): Promise<GitHubCommit[]> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_USERNAME}/${repo}/commits?per_page=5`,
      {
        headers: { Accept: 'application/vnd.github+json' },
        next: { revalidate: 3600 }, // cache 1hr
      }
    );

    if (!res.ok) return [];

    const data = await res.json();
    if (!Array.isArray(data)) return [];

    return data.map((c) => ({
      sha: c.sha,
      htmlUrl: c.html_url,
      message: c.commit?.message?.split('\n')[0] ?? '',
      authorName: c.commit?.author?.name ?? c.author?.login ?? 'Unknown',
      date: c.commit?.author?.date ?? '',
    }));
  } catch {
    return [];
  }
}

function getProjectBySlug(slug: string) {
  return PROJECTS.find((p) => p.id === slug);
}

export async function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return notFound();

  return {
    title: project.title,
    description: project.description?.split('\n')[0] ?? project.title,
    alternates: { canonical: `projects/${slug}` },
  };
}

export default async function ProjectSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  const commits = await getRecentCommits(slug);

  return (
    <section className="flex-1 border-x">
      {/* Header */}
      <div className="flex items-start gap-4 p-4">
        <div className="bg-muted flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-md">
          {project.logo ? (
            <Image
              src={project.logo}
              alt={project.title}
              width={56}
              height={56}
              className="object-contain"
            />
          ) : (
            <Box className="text-muted-foreground size-6" />
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <PanelTitle>{project.title}</PanelTitle>

            {project.link && (
              <Button size="sm" variant="outline" className="gap-1.5" asChild>
                <a href={project.link} target="_blank" rel="noopener noreferrer">
                  <ExternalLinkIcon className="size-3.5" />
                  View
                </a>
              </Button>
            )}
          </div>

          <div className="text-muted-foreground mt-1 flex items-center gap-1 text-sm">
            <span>{formatDate(project.period.start)}</span>
            <span>—</span>
            {project.period.end ? (
              <span>{formatDate(project.period.end)}</span>
            ) : (
              <span>Present</span>
            )}
          </div>
        </div>
      </div>

      <div className="screen-line-top screen-line-bottom bg-hatching h-10" />

      {project.description && (
        <div className="p-4">
          <Prose>
            <MarkdownClient>{project.description}</MarkdownClient>
          </Prose>
        </div>
      )}

      <div className="screen-line-top screen-line-bottom bg-hatching h-4" />

      <div className="p-4">
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">Tech Stack</h3>
        <div className="flex flex-wrap gap-2">
          {project.skills.map((skill, index) => (
            <TechBadge key={index} name={skill} />
          ))}
        </div>
      </div>

      <div className="screen-line-top screen-line-bottom bg-hatching h-4" />

      <div className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-muted-foreground text-sm font-medium">Recent Commits</h3>

          {commits && (
            <Button
              className="text-muted-foreground hover:text-foreground h-7 gap-1.5 border-none !px-0 hover:no-underline"
              variant="link"
              size="sm"
              asChild
            >
              <a
                href={`https://github.com/${GITHUB_USERNAME}/${slug}/commits`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View all on GitHub
                <ExternalLinkIcon className="size-3.5" />
              </a>
            </Button>
          )}
        </div>

        {!commits && (
          <p className="text-muted-foreground text-sm">
            This project doesn&apos;t have a linked GitHub repository.
          </p>
        )}

        {commits.length === 0 && (
          <p className="text-muted-foreground text-sm">
            No commit history could be loaded right now.
          </p>
        )}

        {commits.length > 0 && (
          <div className="divide-y divide-dashed border-b border-dashed first:border-t-0 last:border-b-0">
            {commits.map((commit) => (
              <a
                key={commit.sha}
                href={commit.htmlUrl as Route}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 px-1 py-3 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/30"
              >
                <GitCommitHorizontalIcon className="text-muted-foreground mt-0.5 size-4 shrink-0" />

                <div className="flex-1">
                  <p className="line-clamp-1 text-sm">{commit.message}</p>
                  <div className="text-muted-foreground mt-0.5 flex items-center gap-2 text-xs">
                    <span>{commit.authorName}</span>
                    <span>·</span>
                    <span className="font-mono">{commit.sha.slice(0, 7)}</span>
                    {commit.date && (
                      <>
                        <span>·</span>
                        <span>
                          {new Date(commit.date).toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
