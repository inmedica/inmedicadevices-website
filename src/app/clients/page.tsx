import type { Metadata } from 'next';
import { ClientsView } from '@/components/clients/ClientsView';
import { PageHero } from '@/components/layout/PageHero';
import { CLIENTS, COMPLETED } from '@/data/company';

export const metadata: Metadata = { title: 'Projects / Clients', description: 'Delivering trusted medical equipment solutions across hospitals, clinics and healthcare institutions.' };

export default function ClientsPage() {
  return (
    <>
      <PageHero title="Projects / Clients" sub="Delivering trusted medical equipment solutions across hospitals, clinics and healthcare institutions." />
      <div className="container listing">
        <ClientsView clients={CLIENTS} completed={COMPLETED} />
      </div>
    </>
  );
}
