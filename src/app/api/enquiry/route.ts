import { NextResponse } from 'next/server';
import { connectDb, isDbConfigured } from '@/lib/db';
import { ENQUIRY_TYPES, normaliseMobile, validateEnquiry, type EnquiryInput, type EnquiryType } from '@/lib/enquiry';
import { isMailConfigured, sendCustomerConfirmation, sendEnquiryEmail } from '@/lib/mailer';
import { Enquiry } from '@/models/Enquiry';

export const runtime = 'nodejs';

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 });
  }

  const type = (typeof body.type === 'string' && body.type in ENQUIRY_TYPES ? body.type : 'quote') as EnquiryType;
  const input: EnquiryInput = {
    type,
    name: str(body.name, 120),
    org: str(body.org, 200),
    mobile: str(body.mobile, 30),
    email: str(body.email, 200),
    product: str(body.product, 1000),
    message: str(body.message, 4000),
  };
  const errors = validateEnquiry(input);
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, errors }, { status: 422 });
  input.mobile = normaliseMobile(input.mobile);

  const dbOn = isDbConfigured();
  const mailOn = isMailConfigured();
  if (!dbOn && !mailOn) {
    if (process.env.NODE_ENV === 'production') {
      console.error('[enquiry] Neither MONGODB_URI nor SMTP is configured — enquiry dropped');
      return NextResponse.json({ ok: false, error: 'Enquiries are temporarily unavailable' }, { status: 503 });
    }
    console.warn('[enquiry] dev mode, no MONGODB_URI/SMTP configured. Received:', input);
    return NextResponse.json({ ok: true });
  }

  let saved = false;
  let emailed = false;
  let docId: unknown = null;
  if (dbOn) {
    try {
      await connectDb();
      const doc = await Enquiry.create({ ...input, source: req.headers.get('referer') ?? undefined });
      docId = doc._id;
      saved = true;
    } catch (err) {
      console.error('[enquiry] DB save failed', err);
    }
  }
  if (mailOn) {
    try {
      await sendEnquiryEmail(input);
      emailed = true;
      if (docId) await Enquiry.updateOne({ _id: docId }, { emailed: true });
    } catch (err) {
      console.error('[enquiry] email failed', err);
    }
    // Acknowledge the customer. A failure here must not fail an enquiry that was already captured.
    if (saved || emailed) {
      try {
        await sendCustomerConfirmation(input);
      } catch (err) {
        console.error('[enquiry] customer confirmation failed', err);
      }
    }
  }

  if (!saved && !emailed) return NextResponse.json({ ok: false, error: 'Could not submit enquiry, please call us.' }, { status: 500 });
  return NextResponse.json({ ok: true });
}
