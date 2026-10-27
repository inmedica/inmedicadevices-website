import type { Metadata, Viewport } from 'next';
import { BackgroundFx } from '@/components/layout/BackgroundFx';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { ScrollReveal } from '@/components/layout/ScrollReveal';
import { UIProvider } from '@/components/ui/UIProvider';
import { Analytics, PreviewBar } from '@/components/layout/SiteExtras';
import { getProductOptionGroups } from '@/lib/catalog';
import { contactFrom, getSite } from '@/lib/cms';
import { SITE_URL } from '@/lib/site';
import './globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSite();
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: settings.seo.defaultTitle, template: '%s | InMedica Devices' },
    description: settings.seo.defaultDescription,
    openGraph: { type: 'website', siteName: settings.company.name, locale: 'en_IN', images: settings.seo.ogImage ? [settings.seo.ogImage] : undefined },
    verification: settings.analytics.gscVerification ? { google: settings.analytics.gscVerification } : undefined,
  };
}

export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#1f2b5b' };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const site = await getSite();
  const megaCols = site.cats.map(c => ({
    id: c.id, name: c.name, icon: c.icon,
    items: site.products.filter(p => p.cat === c.id).map(p => ({ id: p.id, name: p.name })),
  }));
  const contact = contactFrom(site.settings);
  const ga4 = site.settings.analytics.ga4Id;
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
        <UIProvider productGroups={await getProductOptionGroups()}>
          <div className="site-root">
            <BackgroundFx />
            <Header megaCols={megaCols} logo={site.settings.company.logo} contact={{ phone: contact.phone, phoneHref: contact.phoneHref, email: contact.email }} />
            <main className="site-main">{children}</main>
            <Footer />
          </div>
          <ScrollReveal />
        </UIProvider>
        {site.preview && <PreviewBar />}
        {ga4 && /^G-[A-Z0-9]+$/.test(ga4) && <Analytics id={ga4} />}
      </body>
    </html>
  );
}
