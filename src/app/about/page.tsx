import type { Metadata } from 'next';
import { PageHero } from '@/components/layout/PageHero';
import { Icon } from '@/components/ui/Icon';
import { getContent } from '@/lib/cms';
import { pageMeta } from '@/lib/seo';

/* eslint-disable @next/next/no-img-element */

export const generateMetadata = (): Promise<Metadata> => pageMeta('/about', { title: 'About Us', description: 'InMedica Devices — your trusted healthcare technology partner in Bhubaneswar, Odisha.' });

export default async function AboutPage() {
  const c = await getContent('about');
  return (
    <>
      <PageHero title="About Us" sub={c.heroSub} />

      <section className="container about-intro">
        <div data-reveal className="stack-16">
          <div className="kicker">Company Profile</div>
          <h2 className="h2" style={{ lineHeight: 'normal' }}>{c.overviewTitle}</h2>
          <p className="body-17">{c.overview}</p>
        </div>
        <div data-reveal className="media-43"><img src={c.overviewImg} alt="" style={{ objectPosition: '70% center' }} /></div>
      </section>

      <section className="container vm-big">
        <div data-reveal className="vm-big-card" style={{ background: 'var(--cyan-tint)' }}>
          <div className="vm-big-head" style={{ color: 'var(--teal)' }}><Icon name="visibility" /><b>Vision</b></div>
          <div style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--text-body)' }}>{c.vision}</div>
        </div>
        <div data-reveal className="vm-big-card" style={{ background: 'var(--navy)', color: '#fff' }}>
          <div className="vm-big-head"><Icon name="flag" style={{ color: 'var(--accent-on-navy)' }} /><b>Mission</b></div>
          {c.mission.map(t => (
            <div key={t} className="check-line" style={{ color: 'var(--on-navy-2)' }}><Icon name="check_circle" style={{ color: 'var(--accent-on-navy)' }} /><span>{t}</span></div>
          ))}
        </div>
      </section>

      <section style={{ background: 'rgba(255,255,255,.85)', borderTop: '1px solid var(--line-2)', borderBottom: '1px solid var(--line-2)' }}>
        <div className="container pad-y-80">
          <h2 data-reveal className="h2-sm" style={{ margin: '0 0 28px', textAlign: 'center' }}>Why Choose Us?</h2>
          <div className="why-grid">
            {c.why.map(w => (
              <div key={w.t} data-reveal className="why-row"><Icon name={w.icon} /><span>{w.t}</span></div>
            ))}
          </div>
        </div>
      </section>

      <section className="container pad-y-80">
        <h2 data-reveal className="h2-sm" style={{ margin: '0 0 28px', textAlign: 'center' }}>Our Team</h2>
        <div data-reveal className="founder">
          <div className="founder-photo"><img src={c.founderPhoto} alt={c.founderName} /></div>
          <div className="founder-body">
            <div className="kicker">Introduction · About the Founder</div>
            <div className="founder-name">{c.founderName}</div>
            <div style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--text-body)' }}>{c.founderIntro}</div>
            {c.founderPoints.map(t => (
              <div key={t} className="check-line" style={{ fontSize: 14, color: 'var(--text-body)' }}><Icon name="check_circle" style={{ color: 'var(--teal)' }} /><span>{t}</span></div>
            ))}
          </div>
        </div>
        <div className="team-label">Management Team</div>
        <div className="team-grid">
          {c.team.map(m => (
            <div key={m.name} data-reveal className="team-card">
              <img src={m.img} alt={m.name} loading="lazy" />
              <b>{m.name}</b>
              <div className="team-role">{m.role}</div>
              <div className="team-exp">{m.exp}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="band-navy" style={{ overflow: 'visible' }}>
        <div className="container pad-y-80">
          <h2 data-reveal className="h2-sm">Certifications / Authorizations</h2>
          <p style={{ margin: '10px 0 28px', color: 'var(--on-navy)', fontSize: 14 }}>{c.certsIntro}</p>
          <div className="cert-grid">
            {c.certs.map(({ name, href }) => href ? (
              <a key={name} data-reveal href={href} target="_blank" rel="noopener" className="cert cert-link">
                <Icon name="workspace_premium" style={{ color: 'var(--accent-on-navy)' }} /><span className="n">{name}</span><Icon name="open_in_new" style={{ color: 'var(--on-navy)' }} />
              </a>
            ) : (
              <div key={name} className="cert cert-pending">
                <Icon name="workspace_premium" /><span className="n">{name}</span><span className="mono-11">file needed</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
