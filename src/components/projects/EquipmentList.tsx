'use client';

import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { useUI } from '@/components/ui/UIProvider';

/** Numbered equipment list: links to the product/category, or opens a pre-filled quote. */
export function EquipmentList({ projectName, items }: { projectName: string; items: [string, string | null][] }) {
  const router = useRouter();
  const { openEnquiry } = useUI();
  const go = (t: string, target: string | null) => {
    if (!target) openEnquiry('quote', '', `${projectName}: ${t}`);
    else if (target.startsWith('cat:')) router.push('/products/' + target.slice(4));
    else router.push('/product/' + target);
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {items.map(([t, target], i) => (
        <button key={t} className="eq-item" onClick={() => go(t, target)}>
          <span className="eq-num">{i + 1}</span>
          <span className="eq-t">{t}</span>
          <Icon name="chevron_right" style={{ color: '#b3bccd' }} />
        </button>
      ))}
    </div>
  );
}
