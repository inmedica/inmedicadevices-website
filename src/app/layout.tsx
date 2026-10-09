import type { Metadata, Viewport } from 'next';
import { BackgroundFx } from '@/components/layout/BackgroundFx';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { ScrollReveal } from '@/components/layout/ScrollReveal';
import { UIProvider } from '@/components/ui/UIProvider';
import { getCategories, getProductOptionGroups, getProductsByCategory } from '@/lib/catalog';
import { SITE_URL } from '@/lib/site';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'InMedica Devices — Advanced Medical Equipment & Complete Hospital Solutions', template: '%s | InMedica Devices' },
  description: 'InMedica Devices, Bhubaneswar, Odisha — medical equipment and integrated healthcare solutions for hospitals, clinics, diagnostic centres and healthcare projects.',
  openGraph: { type: 'website', siteName: 'InMedica Devices', locale: 'en_IN', images: ['/assets/team-1.jpg'] },
  icons: { icon: '/assets/logo.png' },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#1f2b5b' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const megaCols = getCategories().map(c => ({
    id: c.id, name: c.name, icon: c.icon,
    items: getProductsByCategory(c.id).map(p => ({ id: p.id, name: p.name })),
  }));
  return (
    <html lang="en">
      <head>
        {/* Same font stylesheets as the design prototype, so text metrics match exactly. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Quicksand:wght@500;600;700&family=Roboto:wght@400;500;700&display=swap" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0&display=block" />
      </head>
      <body>
        <UIProvider productGroups={getProductOptionGroups()}>
          <div className="site-root">
            <BackgroundFx />
            <Header megaCols={megaCols} />
            <main className="site-main">{children}</main>
            <Footer />
          </div>
          <ScrollReveal />
        </UIProvider>
      </body>
    </html>
  );
}
