import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHero } from '@/components/layout/PageHero';
import { LegalText } from '@/components/layout/LegalText';
import { getContent, isHidden } from '@/lib/cms';
import { pageMeta } from '@/lib/seo';

export const generateMetadata = (): Promise<Metadata> => pageMeta('/terms', { title: 'Terms & Conditions', description: 'Terms & Conditions of InMedica Devices.' });

export default async function Page() {
  if (await isHidden('legal')) notFound();
  const c = await getContent('legal');
  return (
    <>
      <PageHero title="Terms & Conditions" sub="" />
      <section className="container legal">
        {c.updated && <p className="updated">Last updated: {new Date(c.updated).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>}
        <LegalText text={c.terms} />
      </section>
    </>
  );
}
