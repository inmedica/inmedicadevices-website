import { timingSafeEqual } from 'crypto';
import { revalidatePath, revalidateTag } from 'next/cache';
import { SITE_TAG } from '@/lib/cms';

export const runtime = 'nodejs';

const same = (a: string, b: string) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));

/**
 * Called by the admin portal after every change (header x-revalidate-secret).
 * Drops the cached data snapshot and every pre-rendered page so the next visit shows the update.
 */
export async function POST(req: Request) {
  const secret = process.env.REVALIDATE_SECRET || '';
  const given = req.headers.get('x-revalidate-secret') || '';
  if (!secret || !same(given, secret)) return Response.json({ ok: false }, { status: 401 });
  revalidateTag(SITE_TAG, { expire: 0 });
  revalidatePath('/', 'layout');
  return Response.json({ ok: true, at: Date.now() });
}
