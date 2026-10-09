'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { useUI } from '@/components/ui/UIProvider';
import { CONTACT } from '@/data/company';
import { MENU, activeMenuId } from './menu';

export interface MegaColumn {
  id: string;
  name: string;
  icon: string;
  items: { id: string; name: string }[];
}

export function Header({ megaCols }: { megaCols: MegaColumn[] }) {
  const pathname = usePathname();
  const active = activeMenuId(pathname);
  const { openEnquiry } = useUI();
  const [scrolled, setScrolled] = useState(false);
  const [mega, setMega] = useState(false);
  const [mm, setMm] = useState(false);
  const megaTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Sticky sub-navs read the live header height from this variable.
  useEffect(() => {
    document.documentElement.style.setProperty('--hdr-h', scrolled ? '72px' : '88px');
  }, [scrolled]);

  // Close menus on navigation.
  useEffect(() => { setMega(false); setMm(false); }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMm(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const megaOpen = () => { clearTimeout(megaTimer.current); setMega(true); };
  const megaClose = (delay: number) => { clearTimeout(megaTimer.current); megaTimer.current = setTimeout(() => setMega(false), delay); };

  return (
    <>
      <header className={'site-header' + (scrolled ? ' scrolled' : '')}>
        <div className="container hdr-row">
          <Link href="/" className="hdr-logo" aria-label="InMedica Devices — Home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo.png" alt="InMedica Devices" />
          </Link>
          <nav className="hdr-nav" aria-label="Main">
            {MENU.map(m => (
              <div
                key={m.id}
                className="hdr-nav-item"
                onMouseEnter={m.mega ? megaOpen : () => { clearTimeout(megaTimer.current); setMega(false); }}
                onMouseLeave={m.mega ? () => megaClose(180) : undefined}
              >
                <Link href={m.href} className={'nav-link' + (active === m.id ? ' active' : '')} aria-current={active === m.id ? 'page' : undefined}>
                  {m.label}
                  {m.mega && <Icon name="expand_more" size={18} />}
                </Link>
              </div>
            ))}
          </nav>
          <button className="hdr-cta" onClick={() => openEnquiry('quote')}>
            <Icon name="event_note" size={20} />Enquiry Now
          </button>
          <div className="hdr-mob">
            <button className="hdr-mob-enq" onClick={() => { setMm(false); openEnquiry('quote'); }}>Enquiry</button>
            <button className="hdr-burger" aria-label="Menu" aria-expanded={mm} onClick={() => setMm(v => !v)}>
              <Icon name={mm ? 'close' : 'menu'} />
            </button>
          </div>
        </div>

        <div className={'mega' + (mega ? ' open' : '')} onMouseEnter={() => clearTimeout(megaTimer.current)} onMouseLeave={() => megaClose(150)}>
          <div className="container mega-grid">
            {megaCols.map(c => (
              <div key={c.id} className="mega-col">
                <Link href={`/products/${c.id}`} className="mega-head"><Icon name={c.icon} />{c.name}</Link>
                {c.items.map(it => (
                  <Link key={it.id} href={`/product/${it.id}`} className="mega-item">{it.name}</Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className={'mobile-menu' + (mm ? ' open' : '')} aria-hidden={!mm}>
        <div className="mm-list">
          {MENU.map(m => (
            <Link key={m.id} href={m.href} className={'mm-link' + (active === m.id ? ' active' : '')} onClick={() => setMm(false)} tabIndex={mm ? 0 : -1}>
              {m.label}<Icon name="chevron_right" />
            </Link>
          ))}
        </div>
        <div className="mm-contact">
          <a href={CONTACT.phoneHref} tabIndex={mm ? 0 : -1}><Icon name="call" />{CONTACT.phone}</a>
          <a href={`mailto:${CONTACT.email}`} tabIndex={mm ? 0 : -1}><Icon name="mail" />{CONTACT.email}</a>
        </div>
      </div>
    </>
  );
}
