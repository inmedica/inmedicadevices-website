import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/layout/PageHero';
import { ProductCard } from '@/components/products/ProductCard';
import { Icon } from '@/components/ui/Icon';
import { getCategories, getCategory, getProductGroups } from '@/lib/catalog';
import { getContent } from '@/lib/cms';
import { pageMeta, redirectOrNotFound } from '@/lib/seo';

type Props = { params: Promise<{ category: string }> };

export async function generateStaticParams() {
  return (await getCategories()).map(c => ({ category: c.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = await getCategory((await params).category);
  if (!cat) return {};
  return pageMeta(`/products/${cat.id}`, { title: `${cat.name} Equipment`, description: `${cat.name} equipment from InMedica Devices — request a quote or product demo.`, openGraph: cat.img ? { images: [cat.img] } : undefined });
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = await getCategory(category);
  if (!cat) return redirectOrNotFound(`/products/${category}`);
  const [groups, cats, page] = await Promise.all([getProductGroups(cat.id), getCategories(), getContent('products')]);

  return (
    <>
      <PageHero title={cat.name} sub={page.heroSub} crumbs={[{ label: 'Products', href: '/products' }]} />
      <div className="subnav">
        <nav className="container subnav-row" aria-label="Product categories">
          {cats.map(c => (
            <Link key={c.id} href={`/products/${c.id}`} className={'chip chip-hover' + (c.id === cat.id ? ' active' : '')} aria-current={c.id === cat.id ? 'page' : undefined}>
              <Icon name={c.icon} />{c.name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="container listing">
        {groups.map(g => (
          <div key={g.name} className="group">
            {g.showName && (
              <div data-reveal className="group-head"><h2>{g.name}</h2><span className="rule" /><small>{g.count}</small></div>
            )}
            {g.intro && (
              <div data-reveal className="group-intro">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div className="group-intro-title">{g.intro.title}</div>
                  {g.intro.paras.map(t => <div key={t} className="p16">{t}</div>)}
                </div>
                {g.intro.chips && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{g.intro.label}</div>
                    <div className="pill-row">{g.intro.chips.map(t => <span key={t} className="chip-soft">{t}</span>)}</div>
                  </div>
                )}
              </div>
            )}
            <div className="prod-grid">
              {g.items.map(p => <ProductCard key={p.id} p={p} />)}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
