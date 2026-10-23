import type { Metadata } from 'next';
import { PageHero } from '@/components/layout/PageHero';
import { ResourceTabs } from '@/components/resources/ResourceTabs';
import { notFound } from 'next/navigation';
import { getContent, isHidden } from '@/lib/cms';
import { pageMeta } from '@/lib/seo';

export const generateMetadata = (): Promise<Metadata> => pageMeta('/resources', { title: 'Resources', description: 'Product brochures, catalogues, videos and FAQs from InMedica Devices.' });

export default async function ResourcesPage() {
  if (await isHidden('resources')) notFound();
  const c = await getContent('resources');
  return (
    <>
      <PageHero title="Resources" sub={c.heroSub} />
      <div className="container listing">
        <ResourceTabs brochures={c.brochures} catalogues={c.catalogues} faqs={c.faqs} videos={c.videos} brochuresIntro={c.brochuresIntro} cataloguesIntro={c.cataloguesIntro} />
      </div>
    </>
  );
}
