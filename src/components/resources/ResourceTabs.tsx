'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import type { Faq, Video } from '@/data/content-types';
import type { BrochureGroup, DownloadLink } from '@/data/types';

const ALL_TABS = [['brochures', 'Product Brochures', 'picture_as_pdf'], ['catalogues', 'Product Catalogues', 'menu_book'], ['videos', 'Videos', 'play_circle'], ['faqs', 'FAQs', 'help']] as const;
type Tab = (typeof ALL_TABS)[number][0];

/** YouTube watch / share / embed URL → embed URL (other links are not embedded). */
const embed = (url: string) => {
  const m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  return m ? `https://www.youtube-nocookie.com/embed/${m[1]}` : null;
};

export function ResourceTabs({ brochures, catalogues, faqs, videos = [], brochuresIntro, cataloguesIntro }: {
  brochures: BrochureGroup[]; catalogues: DownloadLink[]; faqs: Faq[]; videos?: Video[]; brochuresIntro: string; cataloguesIntro: string;
}) {
  const vids = videos.map(v => ({ ...v, src: embed(v.url) })).filter(v => v.src);
  const TABS = ALL_TABS.filter(t => t[0] !== 'videos' || vids.length);
  const [tab, setTab] = useState<Tab>('brochures');
  const [faqOpen, setFaqOpen] = useState(0);

  return (
    <>
      <div className="seg" role="tablist">
        {TABS.map(([id, name, icon]) => (
          <button key={id} role="tab" aria-selected={tab === id} className={'seg-btn' + (tab === id ? ' on' : '')} onClick={() => setTab(id)}><Icon name={icon} />{name}</button>
        ))}
      </div>

      {tab === 'brochures' && (
        <>
          <p className="res-intro">{brochuresIntro}</p>
          {brochures.map(g => (
            <div key={g.name} style={{ marginBottom: 32 }}>
              <div className="kicker" style={{ marginBottom: 14 }}>{g.name}</div>
              <div className="dl-grid">
                {g.items.map(b => (
                  <a key={b.href} data-reveal href={b.href} target="_blank" rel="noopener" className="dl-card">
                    <span className="icon-tile icon-tile-46"><Icon name="picture_as_pdf" /></span>
                    <span className="n">{b.name}</span>
                    <Icon name="download" style={{ color: 'var(--teal)' }} />
                  </a>
                ))}
              </div>
            </div>
          ))}
        </>
      )}

      {tab === 'catalogues' && (
        <>
          <p className="res-intro">{cataloguesIntro}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,360px),1fr))', gap: 18 }}>
            {catalogues.map(b => (
              <a key={b.href} data-reveal href={b.href} target="_blank" rel="noopener" className="cata-card">
                <Icon name="menu_book" size={40} style={{ color: 'var(--accent-on-navy)' }} />
                <span style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 20 }}>{b.name}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500, color: 'var(--on-navy)' }}><Icon name="download" size={20} />Download Catalogue</span>
              </a>
            ))}
          </div>
        </>
      )}

      {tab === 'videos' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,420px),1fr))', gap: 22 }}>
          {vids.map(v => (
            <div key={v.src} data-reveal style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ position: 'relative', paddingTop: '56.25%', borderRadius: 4, overflow: 'hidden', background: '#000' }}>
                <iframe src={v.src!} title={v.title} loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }} />
              </div>
              <b style={{ fontFamily: 'var(--font-head)' }}>{v.title}</b>
            </div>
          ))}
        </div>
      )}

      {tab === 'faqs' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,320px),1fr))', gap: 28, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {faqs.map(({ q, a }, i) => {
              const open = faqOpen === i;
              return (
                <div key={q} className={'faq' + (open ? ' open' : '')}>
                  <button className="faq-q" aria-expanded={open} onClick={() => setFaqOpen(open ? -1 : i)}>
                    <span className="q">Q.</span><span className="t">{q}</span><Icon name="expand_more" />
                  </button>
                  <div className="faq-a"><div><p>{a}</p></div></div>
                </div>
              );
            })}
          </div>
          <div style={{ borderRadius: 4, background: 'var(--cyan-tint)', padding: 28, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Icon name="support_agent" size={40} style={{ color: 'var(--teal)' }} />
            <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 20 }}>Need more information?</div>
            <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-2)' }}>Our team is here to help with product information, technical details and support.</div>
            <Link href="/contact" className="btn btn-navy h50" style={{ alignSelf: 'flex-start', padding: '0 22px', fontSize: 14 }}>Contact Us<Icon name="arrow_forward" size={20} /></Link>
          </div>
        </div>
      )}
    </>
  );
}
