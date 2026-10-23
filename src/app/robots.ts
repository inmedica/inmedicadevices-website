import type { MetadataRoute } from 'next';
import { getSite } from '@/lib/cms';
import { SITE_URL } from '@/lib/site';

export const revalidate = 3600;

/** Standard rules plus any extra lines added in the admin (SEO → Sitemap & robots). */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const extra = (await getSite()).settings.seo.robotsExtra || '';
  const rules: { userAgent: string; allow?: string[]; disallow?: string[]; crawlDelay?: number }[] = [{ userAgent: '*', allow: ['/'], disallow: ['/api/'] }];
  const sitemaps = [`${SITE_URL}/sitemap.xml`];
  let cur = rules[0];
  for (const raw of extra.split('\n')) {
    const line = raw.trim();
    const m = line.match(/^(user-agent|allow|disallow|sitemap|crawl-delay)\s*:\s*(.*)$/i);
    if (!m) continue;
    const [, k, v] = m;
    const key = k.toLowerCase();
    if (key === 'user-agent') { cur = rules.find(r => r.userAgent === v) ?? (rules.push({ userAgent: v }), rules[rules.length - 1]); }
    else if (key === 'allow') (cur.allow ??= []).push(v);
    else if (key === 'disallow') (cur.disallow ??= []).push(v);
    else if (key === 'sitemap' && /^https:\/\//.test(v)) sitemaps.push(v);
    else if (key === 'crawl-delay' && Number(v) > 0) cur.crawlDelay = Number(v);
  }
  return { rules, sitemap: sitemaps };
}
