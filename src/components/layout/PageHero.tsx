import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';

export function PageHero({ title, sub, crumbs = [] }: { title: string; sub: string; crumbs?: { label: string; href: string }[] }) {
  const trail = [{ label: 'Home', href: '/' }, ...crumbs];
  return (
    <section className="page-hero">
      <div className="page-hero-ring" />
      <div className="page-hero-blob" />
      <div className="container page-hero-inner">
        <nav className="crumbs" aria-label="Breadcrumb">
          {trail.map(c => (
            <span key={c.href} style={{ display: 'contents' }}>
              <Link href={c.href}>{c.label}</Link>
              <Icon name="chevron_right" />
            </span>
          ))}
          <span style={{ color: '#fff' }}>{title}</span>
        </nav>
        <h1>{title}</h1>
        <p>{sub}</p>
      </div>
    </section>
  );
}
