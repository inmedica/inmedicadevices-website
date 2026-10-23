import Script from 'next/script';

/** Shown while an admin is previewing unpublished drafts. */
export function PreviewBar() {
  return (
    <div style={{ position: 'fixed', left: 16, bottom: 16, zIndex: 1000, background: '#1f2b5b', color: '#fff', padding: '10px 14px', borderRadius: 6, fontSize: 13, boxShadow: '0 10px 30px rgba(0,0,0,.3)', display: 'flex', gap: 12, alignItems: 'center' }}>
      <b>Preview</b><span>Showing unpublished drafts.</span>
      <a href="/api/preview/exit" style={{ color: '#ff8a85', fontWeight: 600 }}>Exit preview</a>
    </div>
  );
}

/** Google Analytics 4, enabled from the admin (SEO → Google). */
export function Analytics({ id }: { id: string }) {
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}');`}
      </Script>
    </>
  );
}
