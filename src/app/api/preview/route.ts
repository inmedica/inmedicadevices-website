import { createHmac, timingSafeEqual } from 'crypto';
import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export const runtime = 'nodejs';

/**
 * Entry point for the admin's "Preview draft" button. The link carries a
 * 10-minute HMAC signature (made with REVALIDATE_SECRET) over the path and expiry.
 */
export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const path = sp.get('path') || '/';
  const exp = Number(sp.get('exp'));
  const sig = sp.get('sig') || '';
  const secret = process.env.REVALIDATE_SECRET || '';
  // Only same-site paths (no protocol-relative or absolute URLs).
  if (!secret || !path.startsWith('/') || path.startsWith('//') || path.includes('\\')) return new Response('Invalid link', { status: 400 });
  if (!(exp > Date.now() / 1000)) return new Response('This preview link has expired. Click Preview again in the admin.', { status: 401 });
  const expected = createHmac('sha256', secret).update(`${path}|${exp}`).digest('base64url');
  if (sig.length !== expected.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return new Response('Invalid link', { status: 401 });
  (await draftMode()).enable();
  redirect(path);
}
