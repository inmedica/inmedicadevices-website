import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHero } from '@/components/layout/PageHero';
import { EquipmentList } from '@/components/projects/EquipmentList';
import { EnquiryButton } from '@/components/ui/EnquiryButton';
import { Icon } from '@/components/ui/Icon';
import { getProject, getProjects } from '@/lib/catalog';

/* eslint-disable @next/next/no-img-element */

type Props = { params: Promise<{ id: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return getProjects().map(p => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProject((await params).id);
  return p ? { title: p.name, description: p.sub, openGraph: { images: [p.img] } } : {};
}

export default async function ProjectPage({ params }: Props) {
  const pj = getProject((await params).id);
  if (!pj) notFound();

  return (
    <>
      <PageHero title={pj.name} sub={pj.sub} crumbs={[{ label: 'Hospital Projects', href: '/projects' }]} />
      <section className="container proj-detail">
        <div data-reveal className="stack-16">
          <div className="media-43" style={{ background: '#fff' }}><img src={pj.img} alt={pj.name} /></div>
          {pj.intro.map(t => <div key={t} style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--text-body)' }}>{t}</div>)}
          <EnquiryButton type="quote" product="" message={`Hospital project: ${pj.name}`} className="btn btn-red-flat h56" style={{ alignSelf: 'flex-start' }}>
            Discuss Your Hospital Project<Icon name="arrow_forward" size={20} />
          </EnquiryButton>
        </div>
        <div data-reveal>
          {pj.groups && (
            <>
              <div className="title-24">Possible requirements</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {pj.groups.map(g => (
                  <Link key={g.name} href={`/products/${g.cat}`} className="req-card">
                    <span className="req-card-head">{g.name}<Icon name="arrow_forward" className="arrow-red" /></span>
                    <span style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{g.items.map(t => <span key={t} className="req-chip">{t}</span>)}</span>
                  </Link>
                ))}
              </div>
            </>
          )}
          {pj.items && (
            <>
              <div className="title-24">Equipment may include:</div>
              <EquipmentList projectName={pj.name} items={pj.items} />
            </>
          )}
          {pj.steps && (
            <>
              <div className="title-24" style={{ marginBottom: 18 }}>We support healthcare projects with:</div>
              {pj.steps.map(([t, icon], i) => (
                <div key={t} className="step">
                  <div className="step-rail">
                    <span className="step-dot" style={i % 2 ? { background: 'var(--cyan-tint)', color: 'var(--teal)' } : { background: 'var(--navy)', color: '#fff' }}><Icon name={icon} /></span>
                    {i < pj.steps!.length - 1 && <span className="step-line" />}
                  </div>
                  <div className="step-body"><small>Step {i + 1}</small><b>{t}</b></div>
                </div>
              ))}
            </>
          )}
        </div>
      </section>
    </>
  );
}
