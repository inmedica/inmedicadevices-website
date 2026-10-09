import type { MetadataRoute } from 'next';
import { getCategories, getProducts, getProjects } from '@/lib/catalog';
import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', '/about', '/projects', '/resources', '/clients', '/contact'];
  return [
    ...pages.map(p => ({ url: SITE_URL + p, changeFrequency: 'monthly' as const, priority: p === '' ? 1 : 0.7 })),
    ...getCategories().map(c => ({ url: `${SITE_URL}/products/${c.id}`, changeFrequency: 'monthly' as const, priority: 0.8 })),
    ...getProducts().map(p => ({ url: `${SITE_URL}/product/${p.id}`, changeFrequency: 'monthly' as const, priority: 0.8 })),
    ...getProjects().map(p => ({ url: `${SITE_URL}/project/${p.id}`, changeFrequency: 'yearly' as const, priority: 0.6 })),
  ];
}
