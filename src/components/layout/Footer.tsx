import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { CONTACT } from '@/data/company';
import { getCategories } from '@/lib/catalog';
import { MENU } from './menu';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container foot-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/logo-white.png" alt="InMedica Devices" style={{ height: 56, width: 'auto', alignSelf: 'flex-start', borderRadius: 4 }} />
          <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--on-navy)' }}>
            Our goal is to deliver quality of care in a courteous, respectful, and compassionate manner. We hope you will allow us to care for you and strive to be the first and best choice for your family healthcare.
          </div>
          <div className="foot-social">
            <a href={CONTACT.facebook} target="_blank" rel="noopener" aria-label="InMedica Devices on Facebook">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8v3h2.6V21h2.9z" /></svg>
            </a>
            <a href={CONTACT.instagram} target="_blank" rel="noopener" aria-label="InMedica Devices on Instagram">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 7.3A4.7 4.7 0 1 0 12 16.7 4.7 4.7 0 0 0 12 7.3zm0 7.8a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2zm6-8a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0zM21 8.1c-.1-1.5-.4-2.8-1.5-3.9S17.1 2.7 15.6 2.6C14 2.5 10 2.5 8.4 2.6 6.9 2.7 5.6 3 4.5 4.1S2.9 6.6 2.8 8.1C2.7 9.7 2.7 14.3 2.8 15.9c.1 1.5.4 2.8 1.5 3.9s2.4 1.4 3.9 1.5c1.6.1 5.6.1 7.2 0 1.5-.1 2.8-.4 3.9-1.5s1.4-2.4 1.5-3.9c.1-1.6.1-6.2.2-7.8zm-2 9.9a3.1 3.1 0 0 1-1.8 1.8c-1.2.5-4.1.4-5.2.4s-4 .1-5.2-.4A3.1 3.1 0 0 1 5 18c-.5-1.2-.4-4.1-.4-5.4s-.1-4.2.4-5.4A3.1 3.1 0 0 1 6.8 5.4c1.2-.5 4.1-.4 5.2-.4s4-.1 5.2.4A3.1 3.1 0 0 1 19 7.2c.5 1.2.4 4.1.4 5.4s.1 4.2-.4 5.4z" /></svg>
            </a>
          </div>
        </div>
        <div className="foot-col">
          <h4>Products</h4>
          {getCategories().map(c => <Link key={c.id} href={`/products/${c.id}`} className="foot-link">{c.name}</Link>)}
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
          <span>© {new Date().getFullYear()} InMedica Devices. All Rights Reserved.</span>
          <span style={{ display: 'flex', gap: 20 }}><span>Terms &amp; Conditions</span><span>Privacy Policy</span></span>
        </div>
      </div>
    </footer>
  );
}
