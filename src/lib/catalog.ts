/**
 * Catalogue data access. Every page reads content through these functions, so the
 * source can later move from the static files in /data to MongoDB or a CMS by
 * changing only this module (make the functions async and query the DB).
 */
import { CATS, GROUP_INTRO, PRODUCTS } from '@/data/products';
import { PROJECTS } from '@/data/company';
import type { Category, CategoryId, GroupIntro, Product, SpecTable } from '@/data/types';

export const getCategories = (): Category[] => CATS;
export const getCategory = (id: string): Category | undefined => CATS.find(c => c.id === id);
export const categoryName = (id: CategoryId): string => CATS.find(c => c.id === id)?.name ?? id;

export const getProducts = (): Product[] => PRODUCTS;
export const getProduct = (id: string): Product | undefined => PRODUCTS.find(p => p.id === id);
export const getProductsByCategory = (cat: string): Product[] => PRODUCTS.filter(p => p.cat === cat);
export const getRelatedProducts = (p: Product, max = 4): Product[] => PRODUCTS.filter(x => x.id !== p.id && x.cat === p.cat).slice(0, max);

export const getProjects = () => PROJECTS;
export const getProject = (id: string) => PROJECTS.find(p => p.id === id);

export const countLabel = (n: number) => n + (n === 1 ? ' product' : ' products');

export interface ProductGroup {
  name: string;
  items: Product[];
  intro: GroupIntro | null;
  showName: boolean;
  count: string;
}

export function getProductGroups(cat: CategoryId): ProductGroup[] {
  const groups: ProductGroup[] = [];
  for (const p of getProductsByCategory(cat)) {
    const name = p.group || categoryName(p.cat);
    let g = groups.find(x => x.name === name);
    if (!g) {
      g = { name, items: [], intro: GROUP_INTRO[name] ?? null, showName: false, count: '' };
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
    S.push({ key: 'apps', label: 'Suitable Applications', chips: p.apps });
    if (p.trans) S.push({ key: 'trans', label: 'Transducer Options', text: p.trans.intro, items: p.trans.items });
  } else if (p.kind === 'std' && p.o) {
    const o = p.o;
    S.push(
      { key: 'overview', label: 'Overview', text: o.overview },
      p.featureList ? { key: 'features', label: 'Features', items: p.featureList } : { key: 'features', label: 'Features', text: o.features },
      p.specTables ? { key: 'specs', label: 'Specifications', tables: p.specTables } : { key: 'specs', label: 'Specifications', text: o.specs },
      { key: 'apps', label: 'Applications', chips: splitList(o.apps) },
      { key: 'components', label: 'System Components', text: o.components },
      { key: 'accessories', label: 'Accessories', text: o.accessories },
    );
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
export function getProductOptionGroups(): { label: string; items: string[] }[] {
  return [
    ...CATS.map(c => ({ label: c.name, items: getProductsByCategory(c.id).map(p => p.name) })),
    { label: 'Hospital Projects', items: PROJECTS.map(p => p.name) },
    { label: 'Other Requirements', items: ['Accessories / Consumables', 'Installation & Commissioning', 'AMC / Service Support', 'Not sure — need advice'] },
  ];
}
