import type { Metadata } from 'next';
import { ClientsView } from '@/components/clients/ClientsView';
import { PageHero } from '@/components/layout/PageHero';
import { notFound } from 'next/navigation';
import { getContent, isHidden } from '@/lib/cms';
import { pageMeta } from '@/lib/seo';

export const generateMetadata = (): Promise<Metadata> => pageMeta('/clients', { title: 'Projects / Clients', description: 'Delivering trusted medical equipment solutions across hospitals, clinics and healthcare institutions.' });

export default async function ClientsPage() {
  if (await isHidden('clients')) notFound();
  const c = await getContent('clients');
  return (
    <>
      <PageHero title="Projects / Clients" sub={c.heroSub} />
      <div className="container listing">
        <ClientsView clients={c.clients} completed={c.completed} />
      </div>
    </>
  );
}
