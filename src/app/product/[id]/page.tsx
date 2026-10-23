import type { Metadata } from 'next';
import Link from 'next/link';
import { ProductGallery } from '@/components/products/ProductGallery';
import { SectionNav } from '@/components/products/SectionTabs';
import { SpecTables } from '@/components/products/SpecTables';
import { EnquiryButton, ToastButton } from '@/components/ui/EnquiryButton';
import { Icon } from '@/components/ui/Icon';
import { categoryName, getProduct, getProducts, getProductSections, getRelatedProducts } from '@/lib/catalog';
import { getSite } from '@/lib/cms';
import { pageMeta, redirectOrNotFound } from '@/lib/seo';

/* eslint-disable @next/next/no-img-element */

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  return (await getProducts()).map(p => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProduct((await params).id);
  if (!p) return {};
  return pageMeta(`/product/${p.id}`, {
    title: p.title,
    description: p.short,
    openGraph: { title: p.title, description: p.short, images: p.imgs.length ? [p.imgs[0]] : undefined },
  });
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const p = await getProduct(id);
  if (!p) return redirectOrNotFound(`/product/${id}`);
  const [catName, related, site] = await Promise.all([categoryName(p.cat), getRelatedProducts(p), getSite()]);
  const group = p.group && p.group !== catName ? p.group : null;
  const sections = getProductSections(p);
  const brand = p.brand ? site.brands.find(b => b.id === p.brand) : undefined;

  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'Product', name: p.title, description: p.short, category: catName,
    image: p.imgs, brand: { '@type': 'Brand', name: brand?.name ?? 'InMedica Devices' },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="container pd-crumbs">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link><Icon name="chevron_right" />
          <Link href={`/products/${p.cat}`}>{catName}</Link><Icon name="chevron_right" />
          <span className="cur">{p.name}</span>
        </nav>
      </section>

      <section className="container pd-top">
        <ProductGallery imgs={p.imgs} alts={p.imgAlts} name={p.name} />
        <div data-reveal className="pd-info">
          <div className="badges">
            <span className="badge badge-red">{catName}</span>
            {group && <span className="badge badge-teal">{group}</span>}
          </div>
          <h1>{p.title}</h1>
          <p className="lead" style={{ color: 'var(--text-2)' }}>{p.short}</p>
          <div className="pd-ctas">
            <EnquiryButton type="quote" product={p.name} className="btn btn-red h54"><Icon name="request_quote" size={20} />Request Quote</EnquiryButton>
            <EnquiryButton type="demo" product={p.name} className="btn btn-outline-soft h54 pd-demo"><Icon name="co_present" size={20} />Request Demo</EnquiryButton>
            {p.brochure ? (
              <a href={p.brochure} target="_blank" rel="noopener" className="btn btn-ghost"><Icon name="download" size={20} />Download Brochure</a>
            ) : (
              <ToastButton message="Brochure for this product will be available soon" className="btn btn-dashed"><Icon name="download" size={20} />Brochure</ToastButton>
            )}
          </div>
          <div className="pd-assure">
            <span><Icon name="construction" />Installation &amp; commissioning</span>
            <span><Icon name="support_agent" />After-sales support</span>
            <span><Icon name="handyman" />AMC / service</span>
          </div>
        </div>
      </section>

      <section className="container pd-body">
        <SectionNav sections={sections} />
        <div className="pd-sections">
        {sections.map(s => (
          <div key={s.key} data-sec={s.key} data-reveal className="pd-sec">
            <div className="pd-sec-head"><span className="icon-tile"><Icon name={s.icon} /></span><b>{s.label}</b></div>
            {s.paras?.map(t => <div key={t} className="p16-17">{t}</div>)}
            {s.text && <div className="p16-17">{s.text}</div>}
            {s.items && (
              <div className="check-grid">
                {s.items.map(t => <div key={t} className="check-item"><Icon name="check_circle" /><span>{t}</span></div>)}
              </div>
            )}
            {s.chips && <div className="pill-row">{s.chips.map(t => <span key={t} className="chip-cyan">{t}</span>)}</div>}
            {s.tables && <SpecTables tables={s.tables} />}
          </div>
        ))}
        </div>
      </section>

      <section className="container" style={{ paddingTop: 20 }}>
        <div data-sec="demo" data-reveal className="cta-band" style={{ background: 'var(--navy)', color: '#fff' }}>
          <div style={{ maxWidth: 640 }}>
            <div className="cta-band-title" style={{ fontSize: 'clamp(22px,2.34vw,29px)' }}>Request Product Demo</div>
            <div className="cta-band-txt" style={{ color: 'var(--on-navy)' }}>Want to see the equipment before making a decision? Submit your details and our team will contact you regarding product demonstration availability.</div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            <EnquiryButton type="demo" product={p.name} className="btn btn-white-lift h54">Request a Demo</EnquiryButton>
            <EnquiryButton type="sales" product={p.name} className="btn btn-ghost-white h54">Send Enquiry</EnquiryButton>
          </div>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="container" style={{ paddingTop: 'clamp(36px,5vw,64px)', paddingBottom: 'clamp(48px,6vw,80px)' }}>
          <h2 className="h2-xs" style={{ margin: '0 0 22px' }}>Related Products</h2>
          <div className="rel-grid">
            {related.map(r => (
              <Link key={r.id} href={`/product/${r.id}`} className="rel-card">
                <div className="rel-card-img">
                  {r.imgs[0] ? <img src={r.imgs[0]} alt={r.name} loading="lazy" /> : <div className="ph-stripes" />}
                </div>
                <div className="rel-card-name">{r.name}</div>
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <div style={{ height: 60 }} />
      )}
    </>
  );
}
