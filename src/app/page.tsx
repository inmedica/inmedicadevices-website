import Link from 'next/link';
import { CompletedTiles } from '@/components/clients/CompletedTiles';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { FeaturedCard } from '@/components/products/ProductCard';
import { EnquiryButton } from '@/components/ui/EnquiryButton';
import { Icon } from '@/components/ui/Icon';
import { categoryNameIn, countLabel } from '@/lib/catalog';
import { contactFrom, getSite } from '@/lib/cms';
import { pageMeta } from '@/lib/seo';
import type { Metadata } from 'next';
import type { Product } from '@/data/types';

/* eslint-disable @next/next/no-img-element */

const FLOAT_POS = ['float-a', 'float-b', 'float-c'];
const FLOAT_COLOR = ['var(--red)', 'var(--teal)', 'var(--navy-3)'];

export const generateMetadata = (): Promise<Metadata> => pageMeta('/', {});

export default async function HomePage() {
  const site = await getSite();
  const h = site.content.home;
  const { clients: CLIENTS, completed: COMPLETED } = site.content.clients;
  const WHY = site.content.about.why;
  const CONTACT = contactFrom(site.settings);
  const projects = site.content.solutions.projects;
  const byId = (id: string) => site.products.find(p => p.id === id);
  const picked = h.featuredIds.map(byId).filter((p): p is Product => !!p);
  const featured = picked.length ? picked : site.products.filter(p => p.featured).slice(0, 8);
  const testimonials = site.hidden.includes('testimonials') ? [] : site.content.testimonials.items.filter(t => t.quote);
  return (
    <>
      {/* ---------- hero ---------- */}
      <section className="container hero">
        <div data-reveal className="hero-copy">
          <div className="hero-pill"><i />{h.heroPill}</div>
          <h1>{h.heroTitle}</h1>
          <p className="hero-sub">{h.heroSub}</p>
          <div className="hero-ctas">
            <Link href="/products/imaging" className="btn btn-red h56">Explore Products<Icon name="arrow_forward" size={20} /></Link>
            <EnquiryButton className="btn btn-outline-navy h56">Request a Quote</EnquiryButton>
          </div>
          <div className="hero-cats">
            <div className="hero-cats-label">Our Product Categories</div>
            <div className="pill-row">
              {h.heroCats.map(({ label, cat }) => <Link key={label} href={`/products/${cat}`} className="cat-pill">{label}</Link>)}
            </div>
          </div>
        </div>
        <div data-reveal className="hero-media">
          <HeroCarousel slides={h.slides} />
          {h.floatCards.slice(0, 3).map((f, i) => byId(f.productId) && (
            <Link key={i} href={`/product/${f.productId}`} className={'float-card ' + FLOAT_POS[i]}>
              {f.img && <img src={f.img} alt={f.name} />}
              <span className="fc-txt"><span className="fc-k" style={{ color: FLOAT_COLOR[i] }}>{f.kicker}</span><span className="fc-n">{f.name}</span></span>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- about ---------- */}
      <section className="band-white">
        <div className="container section split">
          <div data-reveal className="media-43 zoom-hover">
            <img src={h.aboutImg} alt="The InMedica Devices team" style={{ objectPosition: 'center 35%' }} />
          </div>
          <div data-reveal className="stack-18">
            <div className="kicker">{h.aboutKicker}</div>
            <h2 className="h2 balance">{h.aboutTitle}</h2>
            <p className="lead">{h.aboutText}</p>
            <div className="vm-grid">
              <div className="vm-card" style={{ background: 'var(--cyan-tint)' }}><b style={{ color: 'var(--teal)' }}>Vision</b><div>{h.vision}</div></div>
              <div className="vm-card" style={{ background: 'var(--red-tint)' }}><b style={{ color: 'var(--red-hover)' }}>Mission</b><div>{h.mission}</div></div>
            </div>
            <Link href="/about" className="btn btn-outline-red" style={{ alignSelf: 'flex-start', height: 52, padding: '0 26px', fontSize: 14 }}>Read More<Icon name="arrow_forward" size={20} /></Link>
          </div>
        </div>
      </section>

      {/* ---------- categories ---------- */}
      <section className="container section">
        <div data-reveal className="section-head-center">
          <div className="kicker-soft">{h.catKicker}</div>
          <h2 className="h2">{h.catTitle}</h2>
        </div>
        <div className="cat-grid">
          {site.cats.map(c => (
            <Link key={c.id} data-reveal href={`/products/${c.id}`} className="cat-card card-lift red-border">
              <div className="cat-card-img"><img src={c.img} alt={c.name} loading="lazy" /></div>
              <div className="cat-card-body">
                <span className="icon-tile icon-tile-46"><Icon name={c.icon} /></span>
                <span className="cat-card-txt"><b>{c.name}</b><small>{countLabel(site.products.filter(p => p.cat === c.id).length)}</small></span>
                <Icon name="arrow_forward" className="arrow-red" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- hospital projects ---------- */}
      <section className="band-navy">
        <div className="container section">
          <div data-reveal className="section-head-row">
            <div style={{ maxWidth: 640 }}>
              <div className="kicker kicker-on-navy">{h.projKicker}</div>
              <h2 className="h2" style={{ marginTop: 10 }}>{h.projTitle}</h2>
              <p className="p-on-navy">{h.projSub}</p>
            </div>
            <Link href="/projects" className="btn btn-white h52">View All<Icon name="arrow_forward" size={20} /></Link>
          </div>
          <div className="proj-grid">
            {projects.map(p => (
              <Link key={p.id} data-reveal href={`/project/${p.id}`} className="proj-tile">
                <img src={p.img} alt={p.name} loading="lazy" />
                <div className="proj-tile-shade" />
                <div className="proj-tile-txt">
                  <span className="proj-tile-ico"><Icon name={p.icon} /></span>
                  <span className="proj-tile-name">{p.name}</span>
                  <span className="proj-tile-sub">{p.sub}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- why choose us ---------- */}
      <section className="container section">
        <div data-reveal className="section-head-center">
          <div className="kicker">{h.whyKicker}</div>
          <h2 className="h2" style={{ lineHeight: 'normal' }}>{h.whyTitle}</h2>
        </div>
        <div className="why-grid">
          {WHY.map(w => (
            <div key={w.t} data-reveal className="why-card">
              <span className="why-ico"><Icon name={w.icon} /></span>
              <span className="why-t">{w.t}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- featured ---------- */}
      <section className="band-cyan">
        <div className="container section">
          <div data-reveal className="section-head-row">
            <div>
              <div className="kicker-soft">{h.featuredKicker}</div>
              <h2 className="h2" style={{ marginTop: 10, lineHeight: 'normal' }}>{h.featuredTitle}</h2>
            </div>
            <Link href="/products/imaging" className="btn btn-outline-navy h52">All Products<Icon name="arrow_forward" size={20} /></Link>
          </div>
          <div className="prod-grid">
            {featured.map(p => <FeaturedCard key={p.id} p={p} catName={categoryNameIn(site.cats, p.cat)} />)}
          </div>
        </div>
      </section>

      {/* ---------- clients ---------- */}
      <section className="section">
        <div data-reveal className="container" style={{ marginBottom: 32, textAlign: 'center' }}>
          <div className="kicker">{h.clientsKicker}</div>
          <h2 className="h2" style={{ marginTop: 10, lineHeight: 'normal' }}>{h.clientsTitle}</h2>
        </div>
        <div className="marquee-mask">
          <div className="marquee-track">
            {[...CLIENTS, ...CLIENTS].map((c, i) => (
              <div key={i} className={'marquee-chip' + (c.logo ? ' has-logo' : '')} aria-hidden={i >= CLIENTS.length} title={c.n}>
                {c.logo ? <img src={c.logo} alt={c.n} loading="lazy" /> : <><Icon name="local_hospital" />{c.n}</>}
              </div>
            ))}
          </div>
        </div>
        <CompletedTiles projects={COMPLETED} />
        <div style={{ textAlign: 'center', marginTop: 28 }}>
          <Link href="/clients" className="btn btn-navy h52" style={{ padding: '0 26px' }}>View All Projects<Icon name="arrow_forward" size={20} /></Link>
        </div>
      </section>

      {/* ---------- testimonials ---------- */}
      {testimonials.length > 0 && (
        <section className="band-white">
          <div className="container section">
            <div data-reveal className="section-head-center">
              <div className="kicker">{h.testimonialsKicker}</div>
              <h2 className="h2" style={{ lineHeight: 'normal' }}>{h.testimonialsTitle}</h2>
            </div>
            <div className="testi-grid">
              {testimonials.map((t, i) => (
                <figure key={i} data-reveal className="testi-card">
                  <Icon name="format_quote" className="testi-mark" />
                  <blockquote>{t.quote}</blockquote>
                  <figcaption>
                    {t.photo ? <img src={t.photo} alt={t.name} loading="lazy" /> : <span className="testi-avatar">{t.name.split(/\s+/).map(w => w[0]).slice(0, 2).join('')}</span>}
                    <span><b>{t.name}</b><small>{[t.role, t.org].filter(Boolean).join(', ')}</small></span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------- quote band ---------- */}
      <section className="band-teal">
        <div className="container quote-grid">
          <div data-reveal>
            <h2>{h.quoteTitle}</h2>
            <p>{h.quoteText}</p>
          </div>
          <div data-reveal className="quote-card">
            <div className="quote-card-title">Request a Quote</div>
            <div className="quote-card-sub">Tell us what equipment you need.</div>
            <div className="quote-btns">
              <EnquiryButton type="quote" className="btn btn-navy"><Icon name="request_quote" size={20} />Request a Quote</EnquiryButton>
              <EnquiryButton type="demo" className="btn btn-outline-soft"><Icon name="co_present" size={20} />Request a Demo</EnquiryButton>
            </div>
            <div className="quote-links">
              <a href={CONTACT.phoneHref}><Icon name="call" size={20} style={{ color: 'var(--red)' }} />{CONTACT.phone}</a>
              <a href={CONTACT.whatsapp} target="_blank" rel="noopener"><Icon name="chat" size={20} style={{ color: 'var(--success)' }} />WhatsApp</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
