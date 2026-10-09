'use client';

import { ENQUIRY_TYPES } from '@/lib/enquiry';
import { EnquiryForm, useEnquiryForm } from './EnquiryForm';
import type { ProductOptionGroup } from './ProductPicker';

export function ContactForm({ productGroups }: { productGroups: ProductOptionGroup[] }) {
  const state = useEnquiryForm();
  const meta = ENQUIRY_TYPES[state.type];
  return (
    <div data-reveal className="form-card">
      <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 'clamp(22px,2.34vw,29px)' }}>{meta.title}</div>
      <div style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--text-3)' }}>{meta.sub}</div>
      <EnquiryForm variant="page" state={state} productGroups={productGroups} />
    </div>
  );
}
