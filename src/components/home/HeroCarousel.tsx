'use client';

import { useEffect, useState } from 'react';

const SLIDES: [src: string, pos: string, caption: string][] = [
  ['/assets/team-1.jpg', 'center 30%', 'Our team at InMedica Devices'],
  ['/assets/team-3.jpg', 'center', 'Product demonstration & training on site'],
  ['/assets/team-2.jpg', 'center 30%', 'Partnering with healthcare institutions across Odisha'],
  ['/assets/proj/sum-1.jpg', 'center', 'Trusted by hospitals across Odisha'],
  ['/assets/proj/vivek-1.jpg', 'center', 'Installation & commissioning by our team'],
];

export function HeroCarousel() {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 5000);
    return () => clearInterval(iv);
  }, [slide]); // restart the 5s timer after a manual pick

  return (
    <div className="hero-frame">
      {SLIDES.map(([src, pos, alt], i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={src} src={src} alt={alt} className={'hero-slide' + (i === slide ? ' on' : '')} style={{ objectPosition: pos }} fetchPriority={i === 0 ? 'high' : 'auto'} />
      ))}
      <div className="hero-shade" />
      <div className="hero-caption-row">
        <div className="hero-caption" aria-live="polite">{SLIDES[slide][2]}</div>
        <div className="hero-dots">
          {SLIDES.map(([src], i) => (
            <button key={src} className={'hero-dot' + (i === slide ? ' on' : '')} aria-label={`Slide ${i + 1}`} onClick={() => setSlide(i)} />
          ))}
        </div>
      </div>
    </div>
  );
}
