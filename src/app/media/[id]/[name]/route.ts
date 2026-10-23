import { GridFSBucket, ObjectId } from 'mongodb';
import { Readable } from 'stream';
import { connectDb, isDbConfigured } from '@/lib/db';

export const runtime = 'nodejs';

/**
 * Files uploaded in the admin portal (MongoDB GridFS bucket "media").
 * URLs are /media/<id>/<filename>; the id never changes, so responses are cached for a year.
 */
export async function GET(req: Request, { params }: { params: Promise<{ id: string; name: string }> }) {
  const { id } = await params;
  if (!isDbConfigured() || !ObjectId.isValid(id)) return new Response('Not found', { status: 404 });
  const db = (await connectDb()).connection.db!;
  const oid = new ObjectId(id);
  const f = await db.collection('media.files').findOne({ _id: oid });
  if (!f) return new Response('Not found', { status: 404 });

  const type = String(f.metadata?.contentType || 'application/octet-stream');
  const etag = `"${id}"`;
  const headers: Record<string, string> = {
    'Content-Type': type,
    'Cache-Control': 'public, max-age=31536000, immutable',
    ETag: etag,
    'X-Content-Type-Options': 'nosniff',
    'Content-Disposition': `inline; filename="${String(f.filename).replace(/[^\w.-]/g, '_')}"`,
    'Accept-Ranges': 'bytes',
  };
  if (req.headers.get('if-none-match') === etag) return new Response(null, { status: 304, headers });

  const bucket = new GridFSBucket(db, { bucketName: 'media' });
  const size = Number(f.length);
  // Range requests let browsers open large PDFs page by page.
  const range = req.headers.get('range')?.match(/^bytes=(\d*)-(\d*)$/);
  if (range && size > 0) {
    const start = range[1] ? Number(range[1]) : Math.max(0, size - Number(range[2]));
    const end = range[1] && range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
    if (start >= size || start > end) return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${size}` } });
    const stream = bucket.openDownloadStream(oid, { start, end: end + 1 });
    return new Response(Readable.toWeb(stream) as ReadableStream, {
      status: 206,
      headers: { ...headers, 'Content-Range': `bytes ${start}-${end}/${size}`, 'Content-Length': String(end - start + 1) },
    });
  }
  return new Response(Readable.toWeb(bucket.openDownloadStream(oid)) as ReadableStream, { headers: { ...headers, 'Content-Length': String(size) } });
}
