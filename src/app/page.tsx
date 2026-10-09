import Link from 'next/link';
import { CompletedTiles } from '@/components/clients/CompletedTiles';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { FeaturedCard } from '@/components/products/ProductCard';
import { EnquiryButton } from '@/components/ui/EnquiryButton';
import { Icon } from '@/components/ui/Icon';
import { CLIENTS, COMPLETED, CONTACT, WHY } from '@/data/company';
import { countLabel, getCategories, getProduct, getProductsByCategory, getProjects } from '@/lib/catalog';
import type { Product } from '@/data/types';

/* eslint-disable @next/next/no-img-element */

const HERO_CATS: [string, string][] = [['USG', 'imaging'], ['X-Ray', 'imaging'], ['C-Arm', 'imaging'], ['Critical Care', 'critical'], ['OT Equipment', 'ot'], ['Hospital Furniture', 'furniture'], ['Endoscopy', 'endoscopy'], ['Laparoscopy', 'laparoscopy']];
const FEATURED = ['m6', 'n9', 'v3', 'a700', 'carm', 'hd500', 'monitor', 'x2600'];

export default function HomePage() {
  const featured = FEATURED.map(id => getProduct(id)).filter((p): p is Product => !!p);
  return (
    <>
      {/* ---------- hero ---------- */}
      <section className="container hero">
        <div data-reveal className="hero-copy">
          <div className="hero-pill"><i />Bhubaneswar, Odisha · Medical Equipment &amp; Hospital Solutions</div>
          <h1>Advanced Medical Equipment &amp; Complete Hospital Solutions</h1>
          <p className="hero-sub">We provide reliable medical equipment and integrated healthcare solutions for hospitals, clinics, diagnostic Centres and healthcare projects.</p>
          <div className="hero-ctas">
            <Link href="/products/imaging" className="btn btn-red h56">Explore Products<Icon name="arrow_forward" size={20} /></Link>
            <EnquiryButton className="btn btn-outline-navy h56">Request a Quote</EnquiryButton>
          </div>
          <div className="hero-cats">
            <div className="hero-cats-label">Our Product Categories</div>
            <div className="pill-row">
              {HERO_CATS.map(([label, c]) => <Link key={label} href={`/products/${c}`} className="cat-pill">{label}</Link>)}
            </div>
          </div>
        </div>
        <div data-reveal className="hero-media">
          <HeroCarousel />
          <Link href="/product/n9" className="float-card float-a">
            <img src="/assets/products/n9-1.jpg" alt="Consona N9" />
            <span className="fc-txt"><span className="fc-k" style={{ color: 'var(--red)' }}>Ultrasound</span><span className="fc-n">Consona N9</span></span>
          </Link>
          <Link href="/product/v3" className="float-card float-b">
            <img src="/assets/products/v3-1.jpg" alt="COMEN V3" />
            <span className="fc-txt"><span className="fc-k" style={{ color: 'var(--teal)' }}>Critical Care</span><span className="fc-n">Ventilator V3</span></span>
          </Link>
          <Link href="/product/hd550" className="float-card float-c">
            <img src="/assets/products/hd550-1.jpg" alt="SonoScape HD-550" />
            <span className="fc-txt"><span className="fc-k" style={{ color: 'var(--navy-3)' }}>Endoscopy</span><span className="fc-n">HD-550 System</span></span>
          </Link>
        </div>
      </section>

      {/* ---------- about ---------- */}
      <section className="band-white">
        <div className="container section split">
          <div data-reveal className="media-43 zoom-hover">
            <img src="/assets/team-2.jpg" alt="The InMedica Devices team" style={{ objectPosition: 'center 35%' }} />
          </div>
          <div data-reveal className="stack-18">
            <div className="kicker">About Us</div>
            <h2 className="h2 balance">Your Trusted Healthcare Technology Partner</h2>
            <p className="lead">Based in Bhubaneswar, Odisha, InMedica Devices is a premier medical equipment and healthcare solutions company. We specialize in providing a comprehensive, end-to-end range of state-of-the-art medical equipment specifically tailored for modern hospitals, clinics, diagnostic Centres, and leading healthcare institutions.</p>
            <div className="vm-grid">
              <div className="vm-card" style={{ background: 'var(--cyan-tint)' }}><b style={{ color: 'var(--teal)' }}>Vision</b><div>To become a trusted healthcare technology partner by providing quality medical equipment and dependable healthcare solutions.</div></div>
              <div className="vm-card" style={{ background: 'var(--red-tint)' }}><b style={{ color: 'var(--red-hover)' }}>Mission</b><div>To deliver reliable healthcare equipment and build long-term relationships with healthcare institutions.</div></div>
            </div>
            <Link href="/about" className="btn btn-outline-red" style={{ alignSelf: 'flex-start', height: 52, padding: '0 26px', fontSize: 14 }}>Read More<Icon name="arrow_forward" size={20} /></Link>
          </div>
        </div>
      </section>

      {/* ---------- categories ---------- */}
      <section className="container section">
        <div data-reveal className="section-head-center">
          <div className="kicker-soft">Wide Range Of Medical Equipment</div>
          <h2 className="h2">Our Product Categories</h2>
        </div>
        <div className="cat-grid">
          {getCategories().map(c => (
            <Link key={c.id} data-reveal href={`/products/${c.id}`} className="cat-card card-lift red-border">
              <div className="cat-card-img"><img src={c.img} alt={c.name} loading="lazy" /></div>
              <div className="cat-card-body">
                <span className="icon-tile icon-tile-46"><Icon name={c.icon} /></span>
                <span className="cat-card-txt"><b>{c.name}</b><small>{countLabel(getProductsByCategory(c.id).length)}</small></span>
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
              <div className="kicker kicker-on-navy">Hospital Projects</div>
              <h2 className="h2" style={{ marginTop: 10 }}>Hospital Project Solutions</h2>
              <p className="p-on-navy">End-to-end solutions for every department and every stage of your hospital project.</p>
            </div>
            <Link href="/projects" className="btn btn-white h52">View All<Icon name="arrow_forward" size={20} /></Link>
          </div>
          <div className="proj-grid">
            {getProjects().map(p => (
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
          <div className="kicker">Our Strength</div>
          <h2 className="h2" style={{ lineHeight: 'normal' }}>Why Choose Us?</h2>
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
              <div className="kicker-soft">Wide Range Of Ultrasound Imaging Solutions</div>
              <h2 className="h2" style={{ marginTop: 10, lineHeight: 'normal' }}>Featured Products</h2>
            </div>
            <Link href="/products/imaging" className="btn btn-outline-navy h52">All Products<Icon name="arrow_forward" size={20} /></Link>
          </div>
          <div className="prod-grid">
            {featured.map(p => <FeaturedCard key={p.id} p={p} />)}
          </div>
        </div>
      </section>

      {/* ---------- clients ---------- */}
      <section className="section">
        <div data-reveal className="container" style={{ marginBottom: 32, textAlign: 'center' }}>
          <div className="kicker">Trusted By</div>
          <h2 className="h2" style={{ marginTop: 10, lineHeight: 'normal' }}>Our Clients / Projects</h2>
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

      {/* ---------- quote band ---------- */}
      <section className="band-teal">
        <div className="container quote-grid">
          <div data-reveal>
            <h2>Helping Patients From Around The Globe!!</h2>
            <p>Healthcare in India is emerging as an important segment mainly due to the definite supportive factors, such as rising health consciousness, better health facilities and insurance support. Also, the drive for affordable healthcare is forcing companies to provide superior technologies at affordable costs.</p>
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
