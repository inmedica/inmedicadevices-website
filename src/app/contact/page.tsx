import type { Metadata } from 'next';
import { ContactForm } from '@/components/forms/ContactForm';
import { PageHero } from '@/components/layout/PageHero';
import { ToastButton } from '@/components/ui/EnquiryButton';
import { Icon } from '@/components/ui/Icon';
import { CONTACT } from '@/data/company';
import { getProductOptionGroups } from '@/lib/catalog';

export const metadata: Metadata = { title: 'Contact Us', description: 'Request a quote, product demo, sales or service enquiry — InMedica Devices, Bhubaneswar.' };

export default function ContactPage() {
  return (
    <>
      <PageHero title="Contact Us" sub="You can also fill out the below form, and we will be in touch soon." />
      <div className="container contact-grid">
        <ContactForm productGroups={getProductOptionGroups()} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div data-reveal className="contact-cards">
            <a href={CONTACT.phoneHref} className="contact-card" style={{ background: 'var(--navy)' }}>
              <Icon name="call" /><span style={{ fontWeight: 700 }}>Call Us</span><span style={{ fontSize: 13, color: 'var(--on-navy)' }}>{CONTACT.phone}</span>
            </a>
            <a href={CONTACT.whatsapp} target="_blank" rel="noopener" className="contact-card" style={{ background: 'var(--success)' }}>
              <Icon name="chat" /><span style={{ fontWeight: 700 }}>WhatsApp</span><span style={{ fontSize: 13, color: '#d6f3e2' }}>Chat with us</span>
            </a>
            <a href={`mailto:${CONTACT.email}`} className="contact-card" style={{ background: 'var(--teal)' }}>
              <Icon name="mail" /><span style={{ fontWeight: 700 }}>Email</span><span style={{ fontSize: 12, color: '#cfe5ee', wordBreak: 'break-all' }}>{CONTACT.email}</span>
            </a>
          </div>
          <div data-reveal className="map-card">
            <iframe title="InMedica Devices head office" src={CONTACT.mapEmbed(15)} loading="lazy" />
            <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span className="loc-tag">Our Locations · Head Office</span>
              <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-body)' }}>{CONTACT.address}</div>
              <a href={CONTACT.directions} target="_blank" rel="noopener" className="link-red" style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}>
                <Icon name="arrow_forward" size={18} />Get Directions
              </a>
            </div>
          </div>
          <div data-reveal className="follow">
            <span style={{ fontWeight: 700 }}>Follow Us</span>
            <div style={{ display: 'flex', gap: 10 }}>
              <a href={CONTACT.facebook} target="_blank" rel="noopener" aria-label="Facebook" className="social">f</a>
              <a href={CONTACT.instagram} target="_blank" rel="noopener" aria-label="Instagram" className="social"><Icon name="photo_camera" size={20} /></a>
              <ToastButton message="X (Twitter) profile link coming soon" ariaLabel="X" className="social x">X</ToastButton>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
