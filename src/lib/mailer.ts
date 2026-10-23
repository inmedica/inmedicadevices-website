import nodemailer from 'nodemailer';
import { contactFrom, getSettings } from './cms';
import { ENQUIRY_TYPES, type EnquiryInput } from './enquiry';

export const isMailConfigured = () => !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

function transport() {
  const port = Number(process.env.SMTP_PORT || 465);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

/** Recipients set in the admin (Settings → Email notifications), else ENQUIRY_TO, else the company email. */
async function companyInbox() {
  const s = await getSettings();
  const list = s.notifications.enquiryRecipients.filter(Boolean);
  return list.length ? list.join(', ') : process.env.ENQUIRY_TO || s.contact.email;
}
const fromAddress = () => process.env.ENQUIRY_FROM || process.env.SMTP_USER;

/** Notification to InMedica with the full enquiry. */
export async function sendEnquiryEmail(e: EnquiryInput) {
  const kind = ENQUIRY_TYPES[e.type].name;
  const rows: [string, string][] = [['Type', kind], ['Name', e.name], ['Hospital / Organization', e.org], ['Mobile', e.mobile], ['Email', e.email], ['Product', e.product], ['Message', e.message]];
  await transport().sendMail({
    from: fromAddress(),
    to: await companyInbox(),
    replyTo: e.email || undefined,
    subject: `${kind}: ${e.name}${e.product ? ' — ' + e.product : ''}`,
    text: rows.map(([k, v]) => `${k}: ${v || '-'}`).join('\n'),
    html: `<table cellpadding="6" style="font-family:Arial,sans-serif;font-size:14px">${rows.map(([k, v]) => `<tr><td style="color:#5d6680">${k}</td><td><b>${esc(v || '-').replace(/\n/g, '<br>')}</b></td></tr>`).join('')}</table>`,
  });
}

/** Acknowledgement to the customer — only when they gave an email address. */
export async function sendCustomerConfirmation(e: EnquiryInput) {
  if (!e.email) return;
  const settings = await getSettings();
  if (!settings.notifications.customerConfirmation) return;
  const CONTACT = contactFrom(settings);
  const meta = ENQUIRY_TYPES[e.type];
  const first = e.name.trim().replace(/\s+/g, ' ') || 'Sir / Madam';
  const summary: [string, string][] = [['Request', meta.name], ['Product(s)', e.product], ['Hospital / Organization', e.org], ['Your message', e.message]].filter(([, v]) => v) as [string, string][];
  const lead = e.type === 'demo'
    ? 'Thank you for requesting a product demonstration. Our team will contact you shortly to arrange a convenient time.'
    : e.type === 'service'
      ? 'Thank you for your service request. Our service team will contact you shortly.'
      : `Thank you for your ${meta.noun}. Our team will review your requirement and contact you shortly.`;

  const text = [
    `Dear ${first},`, '', lead, '',
    ...summary.map(([k, v]) => `${k}: ${v}`), '',
    `For anything urgent, call ${CONTACT.phone} or WhatsApp us.`, '',
    'Regards,', 'InMedica Devices', CONTACT.address, CONTACT.email,
  ].join('\n');

  const html = `<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#1f2b5b;max-width:560px">
  <div style="background:#1f2b5b;color:#fff;padding:18px 22px;font-size:18px;font-weight:bold">InMedica Devices</div>
  <div style="padding:22px;border:1px solid #e3e8ef;border-top:0">
    <p>Dear ${esc(first)},</p>
    <p>${esc(lead)}</p>
    ${summary.length ? `<table cellpadding="6" style="border-collapse:collapse;font-size:14px;margin:12px 0">${summary.map(([k, v]) => `<tr><td style="color:#5d6680;border-bottom:1px solid #eef1f5">${k}</td><td style="border-bottom:1px solid #eef1f5"><b>${esc(v).replace(/\n/g, '<br>')}</b></td></tr>`).join('')}</table>` : ''}
    <p>For anything urgent, call <a href="${CONTACT.phoneHref}" style="color:#e52d27">${CONTACT.phone}</a> or <a href="${CONTACT.whatsapp}" style="color:#1f9d55">WhatsApp us</a>.</p>
    <p>Regards,<br><b>InMedica Devices</b><br><span style="color:#5d6680">${esc(CONTACT.address)}</span></p>
  </div>
  <div style="font-size:11px;color:#7a8499;padding:10px 2px">You are receiving this because you submitted an enquiry on our website.</div>
</div>`;

  await transport().sendMail({
    from: fromAddress(),
    to: e.email,
    replyTo: await companyInbox(),
    subject: `We received your ${meta.noun} — InMedica Devices`,
    text,
    html,
  });
}
