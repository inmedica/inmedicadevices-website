import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/layout/PageHero';
import { EnquiryButton } from '@/components/ui/EnquiryButton';
import { Icon } from '@/components/ui/Icon';
import { getProjects } from '@/lib/catalog';

/* eslint-disable @next/next/no-img-element */

export const metadata: Metadata = { title: 'Hospital Projects', description: 'End-to-end solutions for every department and every stage of your hospital project.' };

export default function ProjectsPage() {
  return (
    <>
      <PageHero title="Hospital Projects" sub="End-to-end solutions for every department and every stage of your hospital project." />
      <section className="container projects-grid">
        {getProjects().map(p => (
          <Link key={p.id} data-reveal href={`/project/${p.id}`} className="proj-card card-lift">
            <div className="proj-card-img"><img src={p.img} alt={p.name} loading="lazy" /></div>
            <div className="proj-card-body">
              <div className="proj-card-title"><Icon name={p.icon} className="arrow-red" /><b>{p.name}</b></div>
              <span className="proj-card-sub">{p.sub}</span>
              <span className="link-more">Explore<Icon name="arrow_forward" size={18} /></span>
            </div>
          </Link>
        ))}
      </section>
      <section className="container" style={{ paddingBottom: 'clamp(48px,6vw,80px)' }}>
        <div data-reveal className="cta-band" style={{ background: 'var(--red)', color: '#fff' }}>
          <div style={{ maxWidth: 640 }}>
            <div className="cta-band-title" style={{ fontSize: 'clamp(22px,2.52vw,31px)' }}>Planning a new hospital?</div>
            <div className="cta-band-txt" style={{ color: '#ffe3e1' }}>We can support your equipment requirements from individual departments to complete hospital setup.</div>
          </div>
          <EnquiryButton type="quote" product="" message="Hospital project: New Hospital Solutions" className="btn btn-white-lift h56" style={{ color: 'var(--red)' }}>Discuss Your Hospital Project</EnquiryButton>
        </div>
      </section>
    </>
  );
}
