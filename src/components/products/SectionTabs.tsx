'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';

const MOBILE = '(max-width: 899.98px)';

/** Sticky vertical section list (horizontal strip on phones) with scroll-spy over `[data-sec]` blocks. */
export function SectionNav({ sections }: { sections: { key: string; label: string; icon: string }[] }) {
  const [active, setActive] = useState(sections[0]?.key ?? 'overview');

  useEffect(() => {
    const spy = () => {
      let cur: string | null = null;
      document.querySelectorAll<HTMLElement>('[data-sec]').forEach(el => {
        if (el.getBoundingClientRect().top < 220) cur = el.dataset.sec ?? null;
      });
      if (cur) setActive(cur);
    };
    window.addEventListener('scroll', spy, { passive: true });
    return () => window.removeEventListener('scroll', spy);
  }, []);

  const jump = (key: string) => {
    const el = document.querySelector<HTMLElement>(`[data-sec="${key}"]`);
    const offset = window.matchMedia(MOBILE).matches ? 150 : 110;
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    setActive(key);
  };

  return (
    <nav className="sec-nav" aria-label="Product sections">
      {sections.map(s => (
        <button key={s.key} className={'sec-nav-item' + (s.key === active ? ' on' : '')} aria-current={s.key === active ? 'true' : undefined} onClick={() => jump(s.key)}>
          <Icon name={s.icon} />{s.label}
        </button>
      ))}
    </nav>
  );
}
