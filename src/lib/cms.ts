/**
 * Website data, managed from the InMedica admin portal (same MongoDB database).
 *
 * Everything is read in one cached snapshot (tag "site"). The admin calls
 * /api/revalidate after each change, which drops the snapshot so the next visit
 * rebuilds it. In preview (draft mode) the cache is bypassed and unpublished
 * drafts are shown. Whenever the database is not configured, empty or (at build
 * time) unreachable, the built-in content in /data is used instead.
 */
import { draftMode } from 'next/headers';
import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import { CATS, GROUP_INTRO, PRODUCTS } from '@/data/products';
import { CONTENT_DEFAULTS } from '@/data/content-defaults';
import { CONTENT_KEYS, type ContentKey, type ContentMap } from '@/data/content-types';
import { DEFAULT_SETTINGS, type SiteSettings } from '@/data/settings-defaults';
import type { Category, GroupIntro, Product } from '@/data/types';
import { connectDb, isDbConfigured } from './db';

export const SITE_TAG = 'site';

export interface SeoEntry { title?: string; description?: string; canonical?: string; ogImage?: string; noindex?: boolean }
export interface Brand { id: string; name: string; logo?: string; description?: string; website?: string }

export interface SiteData {
  fromDb: boolean;
  preview: boolean;
  cats: Category[];
  groupIntro: Record<string, GroupIntro>;
  products: Product[];
  brands: Brand[];
  content: ContentMap;
  /** Pages switched off in the admin. */
  hidden: ContentKey[];
  settings: SiteSettings;
  seo: Record<string, SeoEntry>;
  redirects: Record<string, { to: string; permanent: boolean }>;
}

const STATIC: SiteData = {
  fromDb: false,
  preview: false,
  cats: CATS,
  groupIntro: GROUP_INTRO,
  products: PRODUCTS,
  brands: [],
  content: CONTENT_DEFAULTS,
  hidden: [],
  settings: DEFAULT_SETTINGS,
  seo: {},
  redirects: {},
};

type Doc = Record<string, unknown>;

/** Drop null / empty values so optional sections stay hidden (pages test `if (p.hl)`). */
function compact<T>(o: Doc): T {
  const out: Doc = {};
  for (const [k, v] of Object.entries(o)) {
    if (v == null || v === '' || (Array.isArray(v) && v.length === 0)) continue;
    out[k] = v;
  }
  return out as T;
}

function deepMerge<T>(base: T, over: unknown): T {
  if (!over || typeof over !== 'object' || Array.isArray(over)) return base;
  const out = { ...(base as Doc) };
  for (const [k, v] of Object.entries(over as Doc)) {
    const b = out[k];
    out[k] = b && typeof b === 'object' && !Array.isArray(b) && v && typeof v === 'object' && !Array.isArray(v) ? deepMerge(b, v) : v ?? b;
  }
  return out as T;
}

async function load(preview: boolean): Promise<SiteData> {
  const m = await connectDb();
  const db = m.connection.db!;
  const col = (n: string) => db.collection(n);
  const [cats, products, brands, pages, settings, seo, redirects] = await Promise.all([
    col('categories').find({ active: { $ne: false } }).sort({ order: 1 }).toArray(),
    col('products').find(preview ? { status: { $ne: 'archived' } } : { status: 'published' }).sort({ order: 1 }).toArray(),
    col('brands').find().sort({ order: 1 }).toArray(),
    col('pages').find().toArray(),
    col('settings').findOne({ key: 'site' }),
    col('seo').find().toArray(),
    col('redirects').find().toArray(),
  ]);

  const data: SiteData = { ...STATIC, fromDb: true, preview };
  if (cats.length) {
    data.cats = cats.map(c => ({ id: String(c.id), name: String(c.name), icon: String(c.icon || 'medical_services'), img: String(c.img || '') }));
    data.groupIntro = {};
    for (const c of cats) for (const g of (c.groupIntros as Doc[] | undefined) ?? []) {
      data.groupIntro[String(g.group)] = compact<GroupIntro>({ title: g.title, paras: g.paras ?? [], label: g.label, chips: g.chips });
      data.groupIntro[String(g.group)].paras ??= [];
    }
  }
  // An empty products collection means the catalogue was never imported: keep the built-in list.
  if (products.length || (await col('products').estimatedDocumentCount()) > 0) {
    data.products = products.map(p => {
      const { _id, __v, createdAt, updatedAt, status, order, model, manuals, ...rest } = p as Doc;
      void _id; void __v; void createdAt; void updatedAt; void status; void order; void model; void manuals;
      const prod = compact<Product>(rest);
      prod.imgs ??= [];
      prod.short ??= '';
      prod.brochure ??= null;
      prod.kind ??= 'std';
      return prod;
    });
  }
  data.brands = brands.map(b => compact<Brand>({ id: b.id, name: b.name, logo: b.logo, description: b.description, website: b.website }));

  const content = { ...CONTENT_DEFAULTS } as Record<ContentKey, unknown>;
  const hidden: ContentKey[] = [];
  for (const key of CONTENT_KEYS) {
    const pg = pages.find(x => x.key === key);
    if (!pg) continue;
    const src = preview && pg.hasDraft && pg.draft ? pg.draft : pg.published;
    content[key] = { ...(CONTENT_DEFAULTS[key] as object), ...((src as object) ?? {}) };
    if (pg.isPublished === false) hidden.push(key);
  }
  data.content = content as unknown as ContentMap;
  data.hidden = hidden;
  data.settings = deepMerge(DEFAULT_SETTINGS, settings?.data);
  data.seo = Object.fromEntries(seo.map(s => [String(s.path), compact<SeoEntry>({ title: s.title, description: s.description, canonical: s.canonical, ogImage: s.ogImage, noindex: s.noindex || undefined })]));
  data.redirects = Object.fromEntries(redirects.map(r => [String(r.from), { to: String(r.to), permanent: r.permanent !== false }]));
  return JSON.parse(JSON.stringify(data));
}

const loadPublished = unstable_cache(() => load(false), ['inmedica-site-v1'], { tags: [SITE_TAG], revalidate: 3600 });

/** The whole site snapshot for this request (deduplicated per render). */
export const getSite = cache(async (): Promise<SiteData> => {
  if (!isDbConfigured()) return STATIC;
  let preview = false;
  try { preview = (await draftMode()).isEnabled; } catch { /* outside a request (build of sitemap etc.) */ }
  try {
    return preview ? await load(true) : await loadPublished();
  } catch (err) {
    // During a build, never fail the deployment because the database is unreachable.
    // At runtime, rethrow so Next keeps serving the last good page instead of caching fallback content.
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      console.warn('[cms] database unavailable during build — using built-in content:', (err as Error).message);
      return STATIC;
    }
    throw err;
  }
});

export async function getContent<K extends ContentKey>(key: K): Promise<ContentMap[K]> {
  return (await getSite()).content[key];
}

export async function isHidden(key: ContentKey) {
  return (await getSite()).hidden.includes(key);
}

export async function getSettings() {
  return (await getSite()).settings;
}

/** Contact details in the shape the components use. */
export async function getContact() {
  return contactFrom((await getSite()).settings);
}

export function contactFrom(s: SiteSettings) {
  const c = s.contact;
  const digits = c.phone.replace(/[^\d+]/g, '');
  const q = encodeURIComponent(c.mapQuery || c.address);
  return {
    phone: c.phone,
    phoneHref: `tel:${digits}`,
    altPhone: c.altPhone,
    whatsapp: `https://wa.me/${c.whatsapp.replace(/\D/g, '')}`,
    email: c.email,
    address: c.address,
    mapEmbed: (zoom: number) => `https://maps.google.com/maps?q=${q}&z=${zoom}&output=embed`,
    directions: `https://www.google.com/maps/search/?api=1&query=${q}`,
    facebook: s.socials.facebook,
    instagram: s.socials.instagram,
    linkedin: s.socials.linkedin,
    youtube: s.socials.youtube,
    x: s.socials.x,
  };
}
export type Contact = ReturnType<typeof contactFrom>;

