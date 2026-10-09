import type { Metadata } from 'next';
import { PageHero } from '@/components/layout/PageHero';
import { Icon } from '@/components/ui/Icon';
import { CERTS, FOUNDER, MISSION, TEAM, WHY } from '@/data/company';

/* eslint-disable @next/next/no-img-element */

export const metadata: Metadata = { title: 'About Us', description: 'InMedica Devices — your trusted healthcare technology partner in Bhubaneswar, Odisha.' };

export default function AboutPage() {
  return (
    <>
      <PageHero title="About Us" sub="Your trusted healthcare technology partner." />

      <section className="container about-intro">
        <div data-reveal className="stack-16">
          <div className="kicker">Company Profile</div>
          <h2 className="h2" style={{ lineHeight: 'normal' }}>Corporate Overview</h2>
          <p className="body-17">Based in Bhubaneswar, Odisha, InMedica Devices is a premier medical equipment and healthcare solutions company. We specialize in providing a comprehensive, end-to-end range of state-of-the-art medical equipment specifically tailored for modern hospitals, clinics, diagnostic Centres, and leading healthcare institutions. Our institutional mission focuses on bridging the gap between cutting-edge global technology and local healthcare providers, enhancing clinical precision and operational efficiency across the healthcare spectrum.</p>
        </div>
        <div data-reveal className="media-43"><img src="/assets/hero-usg.jpg" alt="" style={{ objectPosition: '70% center' }} /></div>
      </section>

      <section className="container vm-big">
        <div data-reveal className="vm-big-card" style={{ background: 'var(--cyan-tint)' }}>
          <div className="vm-big-head" style={{ color: 'var(--teal)' }}><Icon name="visibility" /><b>Vision</b></div>
          <div style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--text-body)' }}>To become a trusted healthcare technology partner by providing quality medical equipment and dependable healthcare solutions.</div>
        </div>
        <div data-reveal className="vm-big-card" style={{ background: 'var(--navy)', color: '#fff' }}>
          <div className="vm-big-head"><Icon name="flag" style={{ color: 'var(--accent-on-navy)' }} /><b>Mission</b></div>
          {MISSION.map(t => (
            <div key={t} className="check-line" style={{ color: 'var(--on-navy-2)' }}><Icon name="check_circle" style={{ color: 'var(--accent-on-navy)' }} /><span>{t}</span></div>
          ))}
        </div>
      </section>

      <section style={{ background: 'rgba(255,255,255,.85)', borderTop: '1px solid var(--line-2)', borderBottom: '1px solid var(--line-2)' }}>
        <div className="container pad-y-80">
          <h2 data-reveal className="h2-sm" style={{ margin: '0 0 28px', textAlign: 'center' }}>Why Choose Us?</h2>
          <div className="why-grid">
            {WHY.map(w => (
              <div key={w.t} data-reveal className="why-row"><Icon name={w.icon} /><span>{w.t}</span></div>
            ))}
          </div>
        </div>
      </section>

      <section className="container pad-y-80">
        <h2 data-reveal className="h2-sm" style={{ margin: '0 0 28px', textAlign: 'center' }}>Our Team</h2>
        <div data-reveal className="founder">
          <div className="founder-photo"><img src="/assets/team/founder.jpg" alt="Mr. Sarthak Das" /></div>
          <div className="founder-body">
            <div className="kicker">Introduction · About the Founder</div>
            <div className="founder-name">Mr. Sarthak Das</div>
            <div style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--text-body)' }}>Mr. Sarthak Das drives the company&apos;s vision, combining elite business education with deep medical device industry expertise. An alumnus of St. Xavier&apos;s College, Kolkata (B.Com) and MDI Gurgaon (MBA), he previously managed the premium HNI portfolio at Yes Bank.</div>
            {FOUNDER.map(t => (
              <div key={t} className="check-line" style={{ fontSize: 14, color: 'var(--text-body)' }}><Icon name="check_circle" style={{ color: 'var(--teal)' }} /><span>{t}</span></div>
            ))}
          </div>
        </div>
        <div className="team-label">Management Team</div>
        <div className="team-grid">
          {TEAM.map(m => (
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
          <p style={{ margin: '10px 0 28px', color: 'var(--on-navy)', fontSize: 14 }}>We are authorized and certified to provide genuine and reliable medical equipment and solutions.</p>
          <div className="cert-grid">
            {CERTS.map(([name, href]) => href ? (
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
