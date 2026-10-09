'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import type { Client, CompletedProject } from '@/data/types';
import { CompletedMosaics } from './CompletedTiles';

const FILTERS = [['all', 'All', 'apps'], ['hosp', 'Hospitals', 'local_hospital'], ['clinic', 'Clinics', 'stethoscope'], ['diag', 'Diagnostic Centres', 'biotech'], ['gov', 'Government Projects', 'account_balance'], ['done', 'Completed Projects', 'task_alt']] as const;
const AVATAR_BG = ['#1f2b5b', '#0d5878', '#e52d27', '#3a4f8f'];

// Clients without a logo get an initials avatar.
const initials = (n: string) => n.replace(/[^A-Za-z ]/g, '').split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();

export function ClientsView({ clients, completed }: { clients: Client[]; completed: CompletedProject[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number][0]>('all');
  const list = clients.filter(c => filter === 'all' || c.t === filter);

  return (
    <>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
        {FILTERS.map(([id, name, icon]) => (
          <button key={id} className={'chip' + (filter === id ? ' active' : '')} aria-pressed={filter === id} onClick={() => setFilter(id)}><Icon name={icon} />{name}</button>
        ))}
      </div>
      {filter !== 'done' && (
        <>
          <div className="client-grid">
            {list.map((c, i) => (
              <div key={c.n} data-reveal className="client-tile">
                {c.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="client-logo" src={c.logo} alt={c.n + ' logo'} loading="lazy" />
                ) : (
                  <span className="client-ini" style={{ background: AVATAR_BG[i % 4] }}>{initials(c.n)}</span>
                )}
                <span className="client-name">{c.n}</span>
              </div>
            ))}
          </div>
          {list.length === 0 && (
            <div style={{ border: '2px dashed #cfd7e3', borderRadius: 4, padding: 36, textAlign: 'center', color: 'var(--text-3)', marginBottom: 40, background: 'rgba(255,255,255,.7)' }}>
              {filter === 'gov' ? <><b style={{ display: 'block', fontSize: 16, color: 'var(--navy)', marginBottom: 4 }}>Coming soon</b>Our government healthcare projects are underway and will be listed here once completed.</> : 'Project details for this category will be listed here.'}
            </div>
          )}
        </>
      )}
      <h2 className="h2-xs" style={{ margin: '0 0 20px', fontSize: 'clamp(22px,2.52vw,31px)' }}>Completed Projects</h2>
      <CompletedMosaics projects={completed} />
    </>
  );
}
