import { Suspense } from 'react';

import {
  GitHubContributions,
  GitHubContributionsFallback,
} from '@/components/ui/github-contributions';
import { getCachedContributions } from '@/lib/get-cached-contributions';
import SectionBorders from '@/components/shared/SectionBorders';

const GITHUB_USERNAME = 'Harshalvk';
const GITHUB_PROFILE_URL = 'https://github.com/Harshalvk';

export default function GitHubContri() {
  const contributions = getCachedContributions(GITHUB_USERNAME);

  return (
    <section className="border-border relative border border-t-0 border-b-0">
      <SectionBorders />

      <Suspense fallback={<GitHubContributionsFallback />}>
        <GitHubContributions
          contributions={contributions}
          githubProfileUrl={GITHUB_PROFILE_URL}
          className="w-full p-4"
        />
      </Suspense>
    </section>
  );
}
