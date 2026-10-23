import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { contactFrom, getSite } from '@/lib/cms';
import { MENU } from './menu';

const SOCIAL_PATHS: Record<string, string> = {
  linkedin: 'M6.9 8.7H3.6V20h3.3V8.7zM5.3 3.5a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8zM20.4 13.5c0-3-1.6-5-4.4-5-1.4 0-2.4.8-2.8 1.5V8.7H10V20h3.3v-5.6c0-1.5.3-2.9 2.1-2.9s1.8 1.7 1.8 3V20h3.3l-.1-6.5z',
  youtube: 'M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3L10 15z',
  x: 'M17.8 3h3.1l-6.8 7.8L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.3-8.3L1.8 3h6.4l4.4 5.8L17.8 3zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5z',
};

export async function Footer() {
  const site = await getSite();
  const CONTACT = contactFrom(site.settings);
  const { company } = site.settings;
  const extraSocials = (['linkedin', 'youtube', 'x'] as const).filter(k => CONTACT[k]);
  return (
    <footer className="site-footer">
      <div className="container foot-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={company.logoWhite || '/assets/logo-white.png'} alt={company.name} style={{ height: 56, width: 'auto', alignSelf: 'flex-start', borderRadius: 4 }} />
          <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--on-navy)' }}>
            {company.footerText}
          </div>
          <div className="foot-social">
            {CONTACT.facebook && <a href={CONTACT.facebook} target="_blank" rel="noopener" aria-label="InMedica Devices on Facebook">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8v3h2.6V21h2.9z" /></svg>
            </a>}
            {CONTACT.instagram && <a href={CONTACT.instagram} target="_blank" rel="noopener" aria-label="InMedica Devices on Instagram">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 7.3A4.7 4.7 0 1 0 12 16.7 4.7 4.7 0 0 0 12 7.3zm0 7.8a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2zm6-8a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0zM21 8.1c-.1-1.5-.4-2.8-1.5-3.9S17.1 2.7 15.6 2.6C14 2.5 10 2.5 8.4 2.6 6.9 2.7 5.6 3 4.5 4.1S2.9 6.6 2.8 8.1C2.7 9.7 2.7 14.3 2.8 15.9c.1 1.5.4 2.8 1.5 3.9s2.4 1.4 3.9 1.5c1.6.1 5.6.1 7.2 0 1.5-.1 2.8-.4 3.9-1.5s1.4-2.4 1.5-3.9c.1-1.6.1-6.2.2-7.8zm-2 9.9a3.1 3.1 0 0 1-1.8 1.8c-1.2.5-4.1.4-5.2.4s-4 .1-5.2-.4A3.1 3.1 0 0 1 5 18c-.5-1.2-.4-4.1-.4-5.4s-.1-4.2.4-5.4A3.1 3.1 0 0 1 6.8 5.4c1.2-.5 4.1-.4 5.2-.4s4-.1 5.2.4A3.1 3.1 0 0 1 19 7.2c.5 1.2.4 4.1.4 5.4s.1 4.2-.4 5.4z" /></svg>
            </a>}
            {extraSocials.map(k => (
              <a key={k} href={CONTACT[k]} target="_blank" rel="noopener" aria-label={`InMedica Devices on ${k === 'x' ? 'X' : k[0].toUpperCase() + k.slice(1)}`}>
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d={SOCIAL_PATHS[k]} /></svg>
              </a>
            ))}
          </div>
        </div>
        <div className="foot-col">
          <h4>Products</h4>
          {site.cats.map(c => <Link key={c.id} href={`/products/${c.id}`} className="foot-link">{c.name}</Link>)}
        </div>
        <div className="foot-col">
          <h4>Main Menu</h4>
          {MENU.map(m => <Link key={m.id} href={m.href} className="foot-link">{m.label}</Link>)}
        </div>
        <div className="quick">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 18 }}>Quick Contacts</div>
            <div style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-2)' }}>If you have any questions or need help, feel free to contact with our team.</div>
            <a href={CONTACT.phoneHref} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, fontWeight: 700, color: 'var(--navy)' }}>
              <Icon name="call" style={{ color: 'var(--navy-3)' }} />{CONTACT.phone}
            </a>
            <a href={`mailto:${CONTACT.email}`} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 500, color: 'var(--navy-3)', overflowWrap: 'anywhere' }}>
              <Icon name="mail" />{CONTACT.email}
            </a>
            <div style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--muted)' }}>{CONTACT.address}</div>
          </div>
          <iframe title="Map" src={CONTACT.mapEmbed(14)} loading="lazy" />
        </div>
      </div>
      <div className="foot-bar">
        <div className="container foot-bar-row">
          <span>© {new Date().getFullYear()} {company.name}. All Rights Reserved.</span>
          <span style={{ display: 'flex', gap: 20 }}>
            {!site.hidden.includes('legal') && <><Link href="/terms" className="foot-link">Terms &amp; Conditions</Link><Link href="/privacy" className="foot-link">Privacy Policy</Link></>}
          </span>
        </div>
      </div>
    </footer>
  );
}
