import type { Metadata } from 'next';
import { PanelTitle } from '@/modules/portfolio/components/panel';
import { ProjectorLab } from '@/modules/argus/components/projector-lab';
import { ArgusBreakout } from '@/modules/argus/components/argus-breakout';

export const metadata: Metadata = {
  title: 'Lab — Embedding Projector',
  description:
    'Upload a dataset and explore it in an interactive 3D projection, computed entirely in your browser.',
  alternates: { canonical: 'lab' },
};

export default function LabPage() {
  return (
    <section className="flex-1 border-x">
      <div className="space-y-2 px-4 py-2">
        <PanelTitle>Argus</PanelTitle>
        <p className="text-muted-foreground text-sm md:text-base">
          An embedding projector, inspired by TensorFlow&apos;s. Upload a CSV, and PCA + a 3D
          scatter run entirely in your browser.
        </p>
      </div>
      <div className="screen-line-top screen-line-bottom bg-hatching h-4" />
      <ArgusBreakout>
        <ProjectorLab />
      </ArgusBreakout>
    </section>
  );
}
