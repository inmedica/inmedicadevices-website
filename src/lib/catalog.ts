/**
 * Catalogue data access. Every page reads content through these functions; the
 * data comes from the admin-managed database snapshot in ./cms (with the static
 * files in /data as fallback).
 */
import type { Category, CategoryId, GroupIntro, Product, Project, SpecTable } from '@/data/types';
import { getSite } from './cms';

export const getCategories = async (): Promise<Category[]> => (await getSite()).cats;
export const getCategory = async (id: string): Promise<Category | undefined> => (await getCategories()).find(c => c.id === id);
export const categoryNameIn = (cats: Category[], id: CategoryId): string => cats.find(c => c.id === id)?.name ?? id;
export const categoryName = async (id: CategoryId): Promise<string> => categoryNameIn(await getCategories(), id);

export const getProducts = async (): Promise<Product[]> => (await getSite()).products;
export const getProduct = async (id: string): Promise<Product | undefined> => (await getProducts()).find(p => p.id === id);
export const getProductsByCategory = async (cat: string): Promise<Product[]> => (await getProducts()).filter(p => p.cat === cat);
export const getRelatedProducts = async (p: Product, max = 4): Promise<Product[]> => (await getProducts()).filter(x => x.id !== p.id && x.cat === p.cat).slice(0, max);

export const getProjects = async (): Promise<Project[]> => (await getSite()).content.solutions.projects;
export const getProject = async (id: string) => (await getProjects()).find(p => p.id === id);

export const countLabel = (n: number) => n + (n === 1 ? ' product' : ' products');

export interface ProductGroup {
  name: string;
  items: Product[];
  intro: GroupIntro | null;
  showName: boolean;
  count: string;
}

export async function getProductGroups(cat: CategoryId): Promise<ProductGroup[]> {
  const site = await getSite();
  const groups: ProductGroup[] = [];
  for (const p of site.products.filter(x => x.cat === cat)) {
    const name = p.group || categoryNameIn(site.cats, p.cat);
    let g = groups.find(x => x.name === name);
    if (!g) {
      g = { name, items: [], intro: site.groupIntro[name] ?? null, showName: false, count: '' };
      groups.push(g);
    }
    g.items.push(p);
  }
  for (const g of groups) {
    g.showName = groups.length > 1 || cat === 'imaging';
    g.count = countLabel(g.items.length);
  }
  return groups;
}

export interface ProductSection {
  key: string;
  label: string;
  icon: string;
  paras?: string[];
  text?: string;
  items?: string[];
  chips?: string[];
  tables?: SpecTable[];
}

const SEC_ICON: Record<string, string> = { overview: 'description', hl: 'star', features: 'auto_awesome', specs: 'tune', apps: 'medical_information', trans: 'settings_input_antenna', components: 'widgets', accessories: 'cable', bro: 'menu_book', range: 'category' };

const splitList = (s: string) => s.replace(/\.$/, '').split(/,\s*|\s+and\s+/).filter(Boolean);

export function getProductSections(p: Product): ProductSection[] {
  const S: Omit<ProductSection, 'icon'>[] = [];
  if (p.kind === 'usg') {
    S.push({ key: 'overview', label: 'Overview', paras: p.desc });
    if (p.hl) S.push({ key: 'hl', label: 'Key Highlights', items: p.hl });
    if (p.specTables) S.push({ key: 'specs', label: 'Specifications', tables: p.specTables });
    if (p.apps) S.push({ key: 'apps', label: 'Suitable Applications', chips: p.apps });
    if (p.trans) S.push({ key: 'trans', label: 'Transducer Options', text: p.trans.intro, items: p.trans.items });
  } else if (p.kind === 'std' && p.o) {
    const o = p.o;
    S.push({ key: 'overview', label: 'Overview', text: o.overview });
    if (p.featureList || o.features) S.push(p.featureList ? { key: 'features', label: 'Features', items: p.featureList } : { key: 'features', label: 'Features', text: o.features });
    if (p.specTables || o.specs) S.push(p.specTables ? { key: 'specs', label: 'Specifications', tables: p.specTables } : { key: 'specs', label: 'Specifications', text: o.specs });
    if (o.apps) S.push({ key: 'apps', label: 'Applications', chips: splitList(o.apps) });
    if (o.components) S.push({ key: 'components', label: 'System Components', text: o.components });
    if (o.accessories) S.push({ key: 'accessories', label: 'Accessories', text: o.accessories });
  } else {
    S.push({ key: 'overview', label: 'Overview', text: p.short });
    if (p.rangeTable) S.push({ key: 'range', label: 'Product Range', tables: [p.rangeTable] });
    else if (p.items) S.push({ key: 'range', label: 'Range', items: p.items });
    if (p.specTables) S.push({ key: 'specs', label: 'Specifications', tables: p.specTables });
  }
  if (p.bro) S.push({ key: 'bro', label: 'From the Brochure', items: p.bro });
  return S.map(x => ({ ...x, icon: SEC_ICON[x.key] || 'info' }));
}

/** Options for the enquiry form's product picker: every product grouped by category, plus project & service needs. */
export async function getProductOptionGroups(): Promise<{ label: string; items: string[] }[]> {
  const site = await getSite();
  return [
    ...site.cats.map(c => ({ label: c.name, items: site.products.filter(p => p.cat === c.id).map(p => p.name) })).filter(g => g.items.length),
    { label: 'Hospital Projects', items: site.content.solutions.projects.map(p => p.name) },
    { label: 'Other Requirements', items: ['Accessories / Consumables', 'Installation & Commissioning', 'AMC / Service Support', 'Not sure — need advice'] },
  ];
}
