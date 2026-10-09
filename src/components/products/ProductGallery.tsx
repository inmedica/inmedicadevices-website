'use client';

import { useState } from 'react';

/* eslint-disable @next/next/no-img-element */

export function ProductGallery({ imgs, name }: { imgs: string[]; name: string }) {
  const [idx, setIdx] = useState(0);
  const main = imgs[Math.min(idx, imgs.length - 1)];
  return (
    <div data-reveal className="gallery">
      <div className="gallery-main">
        {main ? <img src={main} alt={name} /> : <div className="ph-stripes">{name} — product photo</div>}
      </div>
      {imgs.length > 1 && (
        <div className="thumbs">
          {imgs.map((src, i) => (
            <button key={src} className={'thumb' + (i === idx ? ' on' : '')} onClick={() => setIdx(i)} aria-label={`Show image ${i + 1}`} aria-pressed={i === idx}>
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
