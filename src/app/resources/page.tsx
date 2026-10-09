import type { Metadata } from 'next';
import { PageHero } from '@/components/layout/PageHero';
import { ResourceTabs } from '@/components/resources/ResourceTabs';
import { BROCHURES, CATALOGUES, FAQS } from '@/data/company';

export const metadata: Metadata = { title: 'Resources', description: 'Product brochures, catalogues, videos and FAQs from InMedica Devices.' };

export default function ResourcesPage() {
  return (
    <>
      <PageHero title="Resources" sub="Access important information, downloads and support resources." />
      <div className="container listing">
        <ResourceTabs brochures={BROCHURES} catalogues={CATALOGUES} faqs={FAQS} />
      </div>
    </>
  );
}
