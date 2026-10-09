'use client';

import { useUI } from '@/components/ui/UIProvider';
import { Icon } from '@/components/ui/Icon';
import type { CompletedProject } from '@/data/types';

/* eslint-disable @next/next/no-img-element */

/** Home page: single cover photo per project, opens the lightbox. */
export function CompletedTiles({ projects }: { projects: CompletedProject[] }) {
  const { openLightbox } = useUI();
  return (
    <div className="container photo-grid" style={{ marginTop: 32 }}>
      {projects.map(cp => (
        <button key={cp.name} data-reveal className="photo-tile" onClick={() => openLightbox(cp.photos, 0, cp.name)}>
          <img src={cp.photos[0]} alt={cp.name} loading="lazy" />
          <div className="photo-tile-shade" />
          <div className="photo-tile-txt"><small>{cp.type}</small><b>{cp.name}</b></div>
        </button>
      ))}
    </div>
  );
}

/** Clients page: 3-tile mosaic per project + photo count button. */
export function CompletedMosaics({ projects }: { projects: CompletedProject[] }) {
  const { openLightbox } = useUI();
  return (
    <div className="done-grid">
      {projects.map(cp => (
        <div key={cp.name} data-reveal className="done-card">
          <div className="mosaic">
            {cp.photos.slice(0, 3).map((src, i) => (
              <button key={src} className={i === 0 ? 'tall' : undefined} onClick={() => openLightbox(cp.photos, i, cp.name)} aria-label={`${cp.name} photo ${i + 1}`}>
                <img src={src} alt={cp.name} loading="lazy" />
              </button>
            ))}
          </div>
          <div className="done-foot">
            <div><b>{cp.name}</b><small>{cp.type}</small></div>
            <button className="btn-photos" onClick={() => openLightbox(cp.photos, 0, cp.name)}>
              <Icon name="photo_library" size={18} />{cp.photos.length} photos
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
