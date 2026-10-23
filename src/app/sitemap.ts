import type { MetadataRoute } from 'next';
import { getSite } from '@/lib/cms';
import { SITE_URL } from '@/lib/site';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = await getSite();
  const hide = (path: string) => site.seo[path]?.noindex;
  const pages: [string, string | null][] = [['', null], ['/about', null], ['/projects', 'solutions'], ['/resources', 'resources'], ['/clients', 'clients'], ['/contact', null], ['/privacy', 'legal'], ['/terms', 'legal']];
  const entries: MetadataRoute.Sitemap = [
    ...pages.filter(([p, key]) => !(key && site.hidden.includes(key as never)) && !hide(p || '/')).map(([p]) => ({ url: SITE_URL + p, changeFrequency: 'monthly' as const, priority: p === '' ? 1 : p === '/privacy' || p === '/terms' ? 0.3 : 0.7 })),
    ...site.cats.filter(c => !hide(`/products/${c.id}`)).map(c => ({ url: `${SITE_URL}/products/${c.id}`, changeFrequency: 'monthly' as const, priority: 0.8 })),
    ...site.products.filter(p => !hide(`/product/${p.id}`)).map(p => ({ url: `${SITE_URL}/product/${p.id}`, changeFrequency: 'monthly' as const, priority: 0.8 })),
  ];
  if (!site.hidden.includes('solutions')) {
    entries.push(...site.content.solutions.projects.filter(p => !hide(`/project/${p.id}`)).map(p => ({ url: `${SITE_URL}/project/${p.id}`, changeFrequency: 'yearly' as const, priority: 0.6 })));
  }
  return entries;
}
