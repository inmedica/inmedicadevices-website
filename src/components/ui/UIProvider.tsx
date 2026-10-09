'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ENQUIRY_TYPES, type EnquiryType } from '@/lib/enquiry';
import { EnquiryForm, useEnquiryForm } from '@/components/forms/EnquiryForm';
import type { ProductOptionGroup } from '@/components/forms/ProductPicker';
import { Icon } from './Icon';

interface LightboxState { list: string[]; i: number; name: string }

interface UIContextValue {
  openEnquiry: (type?: EnquiryType, product?: string, message?: string) => void;
  showToast: (msg: string) => void;
  openLightbox: (list: string[], i: number, name: string) => void;
}

const UIContext = createContext<UIContextValue | null>(null);

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used inside <UIProvider>');
  return ctx;
}

export function UIProvider({ productGroups, children }: { productGroups: ProductOptionGroup[]; children: ReactNode }) {
  const [sheet, setSheet] = useState(false);
  const enquiry = useEnquiryForm();
  const [toast, setToast] = useState({ msg: '', on: false });
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [lb, setLb] = useState<LightboxState | null>(null);
  const [showTop, setShowTop] = useState(false);

  const { setType, patchForm, reopen } = enquiry;
  const openEnquiry = useCallback<UIContextValue['openEnquiry']>((type = 'quote', product, message) => {
    reopen();
    setType(type);
    // Keep anything the visitor already typed; only override what the caller pre-fills.
    patchForm({ ...(product !== undefined && { product }), ...(message !== undefined && { message }) });
    setSheet(true);
  }, [reopen, setType, patchForm]);

  const showToast = useCallback((msg: string) => {
    clearTimeout(toastTimer.current);
    setToast({ msg, on: true });
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, on: false })), 2600);
  }, []);

  const openLightbox = useCallback((list: string[], i: number, name: string) => setLb({ list, i, name }), []);
  const lbStep = useCallback((d: number) => setLb(s => (s ? { ...s, i: (s.i + d + s.list.length) % s.list.length } : s)), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setSheet(false); setLb(null); }
      if (e.key === 'ArrowRight') lbStep(1);
      if (e.key === 'ArrowLeft') lbStep(-1);
    };
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('scroll', onScroll); };
  }, [lbStep]);

  const value = useMemo(() => ({ openEnquiry, showToast, openLightbox }), [openEnquiry, showToast, openLightbox]);
  const meta = ENQUIRY_TYPES[enquiry.type];
  const close = () => setSheet(false);

  return (
    <UIContext.Provider value={value}>
      {children}

      <button className={'to-top' + (showTop ? ' on' : '')} aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <Icon name="arrow_upward" />
      </button>

      <div className="toast-wrap" aria-live="polite">
        <div className={'toast' + (toast.on ? ' on' : '')}>{toast.msg}</div>
      </div>

      <div className={'scrim' + (sheet ? ' on' : '')} onClick={close} />
      <div className={'modal' + (sheet ? ' on' : '')} role="dialog" aria-modal="true" aria-labelledby="enq-title" aria-hidden={!sheet}>
        <div className="modal-head">
          <div style={{ flex: 1 }}>
            <div id="enq-title" className="modal-title">{meta.title}</div>
            <div className="modal-sub">{meta.sub}</div>
          </div>
          <button className="icon-btn" aria-label="Close" onClick={close}><Icon name="close" /></button>
        </div>
        <EnquiryForm variant="modal" state={enquiry} productGroups={productGroups} onDone={close} />
      </div>

      <div className={'lightbox' + (lb ? ' on' : '')} aria-hidden={!lb}>
        <button className="lb-btn lb-close" aria-label="Close" onClick={() => setLb(null)}><Icon name="close" /></button>
        <button className="lb-btn lb-prev" aria-label="Previous" onClick={() => lbStep(-1)}><Icon name="chevron_left" /></button>
        <div className="lb-body">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {lb && <img src={lb.list[lb.i]} alt={lb.name} />}
          <div className="lb-cap">{lb ? `${lb.name} · ${lb.i + 1} / ${lb.list.length}` : ''}</div>
        </div>
        <button className="lb-btn lb-next" aria-label="Next" onClick={() => lbStep(1)}><Icon name="chevron_right" /></button>
      </div>
    </UIContext.Provider>
  );
}

