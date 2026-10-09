'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Below-the-fold `[data-reveal]` elements start hidden (opacity 0, +28px) and reveal
 * as they enter the viewport, staggered 70ms in groups of 4. Content already in view
 * at scan time is never hidden. New elements (tab switches, filters) are picked up
 * by a MutationObserver.
 */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const show = (el: HTMLElement) => el.removeAttribute('data-rv-hidden');

    const io = new IntersectionObserver(entries => {
      for (const e of entries) if (e.isIntersecting) { show(e.target as HTMLElement); io.unobserve(e.target); }
    }, { rootMargin: '0px 0px -30px 0px' });

    const scan = () => {
      const H = window.innerHeight || 800;
      document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-rv])').forEach((el, i) => {
        el.setAttribute('data-rv', '1');
        if (el.getBoundingClientRect().top < H) return;
        const delay = (i % 4) * 70;
        // Keep the element's own (hover) transitions and append the reveal ones, as in the prototype.
        const own = getComputedStyle(el).transition;
        const keep = own && !/^all 0s ease 0s$/.test(own) ? own + ', ' : '';
        el.style.transition = `${keep}opacity .7s ease ${delay}ms, translate .8s cubic-bezier(.2,.8,.2,1) ${delay}ms`;
        el.setAttribute('data-rv-hidden', '1');
        io.observe(el);
      });
    };

    let t: ReturnType<typeof setTimeout>;
    const first = setTimeout(scan, 60);
    const mo = new MutationObserver(() => { clearTimeout(t); t = setTimeout(scan, 60); });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => { clearTimeout(first); clearTimeout(t); mo.disconnect(); io.disconnect(); };
  }, [pathname]);

  return null;
}
