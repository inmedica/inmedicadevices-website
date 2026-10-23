import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import type { Product } from '@/data/types';

/** Listing card (products pages): bordered, red border on hover, 3-line clamp, Brochure badge. */
export function ProductCard({ p }: { p: Product }) {
  const img = p.imgs[0];
  return (
    <Link data-reveal href={`/product/${p.id}`} className="prod-card bordered card-lift red-border">
      <div className="prod-card-img">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {img ? <img src={img} alt={p.imgAlts?.[0] || p.name} loading="lazy" /> : <div className="ph-stripes">product photo</div>}
        {p.brochure && <span className="badge-brochure">Brochure</span>}
      </div>
      <div className="prod-card-body">
        <span className="prod-card-name">{p.name}</span>
        <span className="prod-card-desc clamp-3">{p.short}</span>
        <span className="prod-card-more red">View Details<Icon name="arrow_forward" size={18} /></span>
      </div>
    </Link>
  );
}

/** Home "Featured Products" card: borderless, category kicker, 2-line clamp, "Read More". */
export function FeaturedCard({ p, catName }: { p: Product; catName: string }) {
  const img = p.imgs[0];
  return (
    <Link data-reveal href={`/product/${p.id}`} className="prod-card card-lift">
      <div className="prod-card-img">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {img ? <img src={img} alt={p.imgAlts?.[0] || p.name} loading="lazy" /> : <div className="ph-stripes">product photo</div>}
      </div>
      <div className="prod-card-body" style={{ flex: 'none' }}>
        <span className="prod-card-cat">{catName}</span>
        <span className="prod-card-name">{p.name}</span>
        <span className="prod-card-desc clamp-2">{p.short}</span>
        <span className="prod-card-more">Read More<Icon name="arrow_forward" size={18} /></span>
      </div>
    </Link>
  );
}
