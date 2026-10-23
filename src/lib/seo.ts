import type { Metadata } from 'next';
import { notFound, permanentRedirect, redirect } from 'next/navigation';
import { getSite } from './cms';

/**
 * Page metadata with the admin's SEO overrides (SEO → Page titles & descriptions)
 * applied on top. Empty override fields keep the page's own values.
 */
export async function pageMeta(path: string, base: Metadata): Promise<Metadata> {
  const o = (await getSite()).seo[path];
  const meta: Metadata = { ...base, alternates: { canonical: path, ...base.alternates } };
  if (!o) return meta;
  if (o.title) meta.title = o.title;
  if (o.description) meta.description = o.description;
  if (o.canonical) meta.alternates = { ...meta.alternates, canonical: o.canonical };
  if (o.ogImage || o.title || o.description) {
    meta.openGraph = {
      ...base.openGraph,
      ...(o.title ? { title: o.title } : {}),
      ...(o.description ? { description: o.description } : {}),
      ...(o.ogImage ? { images: [o.ogImage] } : {}),
    };
  }
  if (o.noindex) meta.robots = { index: false, follow: true };
  return meta;
}

/** Follow an admin-defined redirect for this path, or show the 404 page. */
export async function redirectOrNotFound(path: string): Promise<never> {
  const clean = decodeURIComponent(path).replace(/\/+$/, '') || '/';
  const r = (await getSite()).redirects[clean];
  if (r && r.to !== clean) (r.permanent ? permanentRedirect : redirect)(r.to);
  notFound();
}
