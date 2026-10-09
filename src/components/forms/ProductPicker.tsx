'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Icon } from '@/components/ui/Icon';

export interface ProductOptionGroup {
  label: string;
  items: string[];
}

const SEP = ', ';
export const joinProducts = (list: string[]) => list.join(SEP);
export const splitProducts = (value: string) => (value ? value.split(SEP).map(s => s.trim()).filter(Boolean) : []);

/**
 * Multi-select product picker. The whole field opens the list; options are grouped by
 * category with a search box. The value is a comma-separated string so it travels
 * through the form/API unchanged.
 */
export function ProductPicker({ value, onChange, groups }: { value: string; onChange: (v: string) => void; groups: ProductOptionGroup[] }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const selected = useMemo(() => splitProducts(value), [value]);

  useEffect(() => {
    if (!open) return;
    searchRef.current?.focus({ preventScroll: true });
    const onDown = (e: PointerEvent) => { if (!rootRef.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  const toggle = (item: string) => {
    const next = selected.includes(item) ? selected.filter(s => s !== item) : [...selected, item];
    onChange(joinProducts(next));
  };

  const needle = q.trim().toLowerCase();
  const visible = groups
    .map(g => ({ ...g, items: needle ? g.items.filter(i => i.toLowerCase().includes(needle) || g.label.toLowerCase().includes(needle)) : g.items }))
    .filter(g => g.items.length);

  const summary = selected.length === 0 ? 'Choose Products' : selected.length === 1 ? selected[0] : `${selected[0]} +${selected.length - 1} more`;

  return (
    <div
      ref={rootRef}
      className={'picker' + (open ? ' open' : '')}
      onKeyDown={e => { if (e.key === 'Escape' && open) { e.stopPropagation(); setOpen(false); } }}
    >
      <button
        type="button"
        className="field-box sel picker-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen(o => !o)}
      >
        <Icon name="extension" />
        <span className={'picker-summary' + (selected.length ? '' : ' placeholder')}>{summary}</span>
        <Icon name={open ? 'expand_less' : 'expand_more'} className="sel-caret" />
      </button>

      {selected.length > 0 && (
        <div className="picker-chips">
          {selected.map(s => (
            <button key={s} type="button" className="picker-chip" onClick={() => toggle(s)} aria-label={`Remove ${s}`}>
              {s}<Icon name="close" size={14} />
            </button>
          ))}
        </div>
      )}

      {open && (
        <div className="picker-panel">
          <div className="picker-search">
            <Icon name="search" size={18} />
            <input ref={searchRef} value={q} onChange={e => setQ(e.target.value)} placeholder="Search products…" aria-label="Search products" />
            {q && <button type="button" className="picker-clear" onClick={() => setQ('')} aria-label="Clear search"><Icon name="close" size={16} /></button>}
          </div>
          <div id={listId} className="picker-list" role="listbox" aria-multiselectable="true">
            {visible.length === 0 && <div className="picker-empty">No products match “{q}”. You can describe it in the message.</div>}
            {visible.map(g => (
              <div key={g.label} role="group" aria-label={g.label}>
                <div className="picker-group">{g.label}</div>
                {g.items.map(item => {
                  const on = selected.includes(item);
                  return (
                    <button key={item} type="button" role="option" aria-selected={on} className={'picker-opt' + (on ? ' on' : '')} onClick={() => toggle(item)}>
                      <Icon name={on ? 'check_box' : 'check_box_outline_blank'} size={20} />
                      <span>{item}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
          <div className="picker-foot">
            <span>{selected.length ? `${selected.length} selected` : 'Select one or more'}</span>
            <span style={{ display: 'flex', gap: 8 }}>
              {selected.length > 0 && <button type="button" className="picker-btn ghost" onClick={() => onChange('')}>Clear</button>}
              <button type="button" className="picker-btn" onClick={() => setOpen(false)}>Done</button>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
