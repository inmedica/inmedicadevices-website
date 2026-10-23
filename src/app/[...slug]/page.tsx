import { redirectOrNotFound } from '@/lib/seo';

/** Any path no other page handles: follow a redirect set in the admin, otherwise 404. */
export default async function CatchAll({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  return redirectOrNotFound('/' + slug.join('/'));
}
