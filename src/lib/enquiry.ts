/** Shared between the client form and the API route so validation never drifts. */
export const ENQUIRY_TYPES = {
  quote: { name: 'Request a Quote', title: 'Request a Quote', sub: 'Tell us what equipment you need.', cta: 'Request a Quote', noun: 'quote request' },
  demo: { name: 'Product Demo', title: 'Request Product Demo', sub: 'Want to see the equipment before making a decision? Submit your details and our team will contact you regarding product demonstration availability.', cta: 'Request Demo', noun: 'demo request' },
  sales: { name: 'Sales Enquiry', title: 'Sales Enquiry', sub: 'Share your requirement with our sales team.', cta: 'Send Enquiry', noun: 'sales enquiry' },
  service: { name: 'Service Enquiry', title: 'Service Enquiry', sub: 'Installation, AMC and after-sales service requests.', cta: 'Send Enquiry', noun: 'service enquiry' },
} as const;

export type EnquiryType = keyof typeof ENQUIRY_TYPES;

export interface EnquiryInput {
  type: EnquiryType;
  name: string;
  org: string;
  mobile: string;
  email: string;
  product: string;
  message: string;
}

export const EMPTY_FORM: Omit<EnquiryInput, 'type'> = { name: '', org: '', mobile: '', email: '', product: '', message: '' };

export type EnquiryErrors = Partial<Record<keyof EnquiryInput, string>>;

export const normaliseMobile = (m: string) => m.replace(/\D/g, '').slice(-10);

export function validateEnquiry(f: Omit<EnquiryInput, 'type'>): EnquiryErrors {
  const e: EnquiryErrors = {};
  if (!f.name.trim()) e.name = 'Please enter your name';
  if (!/^[6-9]\d{9}$/.test(normaliseMobile(f.mobile))) e.mobile = 'Enter a valid 10-digit mobile number';
  if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) e.email = 'Enter a valid email address';
  return e;
}
