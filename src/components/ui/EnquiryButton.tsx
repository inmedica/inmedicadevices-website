'use client';

import type { CSSProperties, ReactNode } from 'react';
import type { EnquiryType } from '@/lib/enquiry';
import { useUI } from './UIProvider';

/** A button that opens the global enquiry modal — lets server components trigger it. */
export function EnquiryButton({ type = 'quote', product, message, className, style, children }: {
  type?: EnquiryType; product?: string; message?: string; className?: string; style?: CSSProperties; children: ReactNode;
}) {
  const { openEnquiry } = useUI();
  return (
    <button type="button" className={className} style={style} onClick={() => openEnquiry(type, product, message)}>
      {children}
    </button>
  );
}

/** A button that shows a toast message. */
export function ToastButton({ message, className, style, ariaLabel, children }: { message: string; className?: string; style?: CSSProperties; ariaLabel?: string; children: ReactNode }) {
  const { showToast } = useUI();
  return (
    <button type="button" className={className} style={style} aria-label={ariaLabel} onClick={() => showToast(message)}>
      {children}
    </button>
  );
}
