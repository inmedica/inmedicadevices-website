'use client';

import { useEffect, useState } from 'react';
import type { Slide } from '@/data/content-types';

export function HeroCarousel({ slides }: { slides: Slide[] }) {
  const SLIDES: [string, string, string][] = slides.filter(s => s.img).map(s => [s.img, s.pos || 'center', s.caption]);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setSlide(s => (s + 1) % Math.max(1, SLIDES.length)), 5000);
    return () => clearInterval(iv);
  }, [slide, SLIDES.length]); // restart the 5s timer after a manual pick

  if (!SLIDES.length) return <div className="hero-frame"><div className="hero-shade" /></div>;

  return (
    <div className="hero-frame">
      {SLIDES.map(([src, pos, alt], i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={i} src={src} alt={alt} className={'hero-slide' + (i === slide ? ' on' : '')} style={{ objectPosition: pos }} fetchPriority={i === 0 ? 'high' : 'auto'} />
      ))}
      <div className="hero-shade" />
      <div className="hero-caption-row">
        <div className="hero-caption" aria-live="polite">{SLIDES[Math.min(slide, SLIDES.length - 1)][2]}</div>
        <div className="hero-dots">
          {SLIDES.map((_, i) => (
            <button key={i} className={'hero-dot' + (i === slide ? ' on' : '')} aria-label={`Slide ${i + 1}`} onClick={() => setSlide(i)} />
          ))}
        </div>
      </div>
    </div>
  );
}
