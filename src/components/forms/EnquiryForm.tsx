'use client';

import { useCallback, useEffect, useState } from 'react';
import { EMPTY_FORM, ENQUIRY_TYPES, validateEnquiry, type EnquiryErrors, type EnquiryType } from '@/lib/enquiry';
import { Icon } from '@/components/ui/Icon';
import { ProductPicker, type ProductOptionGroup } from './ProductPicker';

type FormValues = typeof EMPTY_FORM;

export function useEnquiryForm(initialType: EnquiryType = 'quote') {
  const [type, setType] = useState<EnquiryType>(initialType);
  const [form, setForm] = useState<FormValues>({ ...EMPTY_FORM });
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [checkIn, setCheckIn] = useState(false);
  const [failure, setFailure] = useState('');

  const setField = useCallback((k: keyof FormValues, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: undefined }));
  }, []);
  const patchForm = useCallback((patch: Partial<FormValues>) => setForm(f => ({ ...f, ...patch })), []);

  /** Back to the form view. After a successful send the fields are cleared too. */
  const reopen = useCallback(() => {
    setSent(wasSent => {
      if (wasSent) setForm({ ...EMPTY_FORM });
      return false;
    });
    setSending(false);
    setCheckIn(false);
    setErrors({});
    setFailure('');
  }, []);

  const submit = useCallback(async () => {
    const e = validateEnquiry(form);
    if (Object.keys(e).length) { setErrors(e); return; }
    setSending(true);
    setFailure('');
    try {
      const res = await fetch('/api/enquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type, ...form }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        if (data.errors) setErrors(data.errors);
        setFailure(data.error || 'Something went wrong. Please call or WhatsApp us.');
        return;
      }
      setSent(true);
    } catch {
      setFailure('Network error. Please check your connection and try again.');
    } finally {
      setSending(false);
    }
  }, [form, type]);

  useEffect(() => {
    if (!sent) return;
    const t = setTimeout(() => setCheckIn(true), 40);
    return () => clearTimeout(t);
  }, [sent]);

  return { type, setType, form, setField, patchForm, errors, sending, sent, checkIn, failure, submit, reopen };
}

export type EnquiryFormState = ReturnType<typeof useEnquiryForm>;

const FIELDS: { k: keyof FormValues; label: string; icon: string; ph: string; type: string; autoComplete: string }[] = [
  { k: 'name', label: 'Name *', icon: 'person', ph: 'Your full name', type: 'text', autoComplete: 'name' },
  { k: 'org', label: 'Hospital / Organization', icon: 'apartment', ph: 'Hospital or organization', type: 'text', autoComplete: 'organization' },
  { k: 'mobile', label: 'Mobile Number *', icon: 'call', ph: '10-digit mobile number', type: 'tel', autoComplete: 'tel' },
  { k: 'email', label: 'Email', icon: 'mail', ph: 'you@hospital.com', type: 'email', autoComplete: 'email' },
];

export function EnquiryForm({ variant, state, productGroups, onDone }: { variant: 'modal' | 'page'; state: EnquiryFormState; productGroups: ProductOptionGroup[]; onDone?: () => void }) {
  const { type, setType, form, setField, errors, sending, sent, checkIn, failure, submit, reopen } = state;
  const meta = ENQUIRY_TYPES[type];
  const page = variant === 'page';
  // Skip a leading title so "Dr. Priya Mohanty" reads "Thank you, Priya".
  const firstName = form.name.trim().replace(/^(dr|mr|mrs|ms|miss|prof|sri|shri|smt)\.?\s+/i, '').split(/\s+/)[0] || 'you';

  const typeChips = (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {(Object.keys(ENQUIRY_TYPES) as EnquiryType[]).map(id => (
        <button key={id} type="button" className={'type-chip' + (id === type ? ' on' : '')} onClick={() => setType(id)}>{ENQUIRY_TYPES[id].name}</button>
      ))}
    </div>
  );

  if (sent) {
    return (
      <>
        {page && typeChips}
        <div className="success">
          <div className={'success-check' + (checkIn ? ' in' : '')}><Icon name="check_circle" /></div>
          <div className="success-title">Thank you, {firstName}</div>
          <div style={{ fontSize: 14, color: 'var(--text-2)' }}>Your {meta.noun} has been received. Our team will be in touch soon.</div>
          {page ? (
            <button type="button" className="btn btn-outline-soft" style={{ marginTop: 8, height: 50, padding: '0 24px' }} onClick={reopen}>Send another enquiry</button>
          ) : (
            <button type="button" className="btn" style={{ marginTop: 8, height: 50, padding: '0 28px', background: 'var(--red)', color: '#fff' }} onClick={onDone}>Done</button>
          )}
        </div>
      </>
    );
  }

  const productSelect = <ProductPicker value={form.product} onChange={v => setField('product', v)} groups={productGroups} />;
  const message = (
    <textarea className="field-ta" aria-label="Message" rows={page ? 4 : 3} placeholder={page ? 'Tell us about your requirement' : 'Message'} value={form.message} onChange={e => setField('message', e.target.value)} />
  );

  return (
    <form
      noValidate
      style={{ display: 'contents' }}
      onSubmit={e => { e.preventDefault(); if (!sending) submit(); }}
    >
      {typeChips}
      <div className="form-fields">
        {FIELDS.map(f => (
          <label key={f.k} className="field">
            <span className="field-label">{f.label}</span>
            <div className={'field-box' + (errors[f.k] ? ' err' : '')}>
              <Icon name={f.icon} />
              <input type={f.type} placeholder={f.ph} autoComplete={f.autoComplete} value={form[f.k]} onChange={e => setField(f.k, e.target.value)} aria-invalid={!!errors[f.k]} />
            </div>
            {errors[f.k] && <span className="field-err">{errors[f.k]}</span>}
          </label>
        ))}
      </div>
      {page ? (
        <>
          <div className="field"><span className="field-label">Product Required</span>{productSelect}</div>
          <label className="field"><span className="field-label">Message</span>{message}</label>
        </>
      ) : (
        <>{productSelect}{message}</>
      )}
      {failure && <div role="alert" style={{ fontSize: 13, color: 'var(--red)' }}>{failure}</div>}
      <button type="submit" className="submit-btn" disabled={sending}>
        {sending && <span className="spinner" />}
        {meta.cta}
        <Icon name="arrow_forward" size={20} />
      </button>
    </form>
  );
}
