import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import { Footer } from '@/components/Footer';

afterEach(cleanup);

describe('Footer', () => {
  it('renders the sitemap as a labelled nav landmark with routes from the spec', () => {
    render(<Footer />);
    const nav = screen.getByRole('navigation', { name: 'Site map' });
    expect(within(nav).getByRole('link', { name: 'Vastu-Tech' }).getAttribute('href')).toBe(
      '/intelligence/vastu-tech',
    );
    expect(
      within(nav).getByRole('link', { name: 'Book a design audit' }).getAttribute('href'),
    ).toBe('/book-audit');
    expect(within(nav).getByRole('link', { name: 'Privacy' }).getAttribute('href')).toBe('/privacy');
  });

  it('never fabricates CIN/GST — the trust row is an explicit "to be published" placeholder', () => {
    render(<Footer />);
    expect(screen.getByText('CIN')).toBeDefined();
    expect(screen.getByText('GST')).toBeDefined();
    expect(screen.getAllByText('to be published').length).toBeGreaterThanOrEqual(2);
  });

  it('renders the real contact details as things a visitor can act on', () => {
    // These used to be "Number to be published" / "Address to be published".
    // Now that the studio has supplied them, the assertion that matters is not
    // that they appear but that they WORK: a phone number rendered as plain
    // text on a page most people open on a phone is a number that never gets
    // dialled, and a wa.me link with a `+` in it silently fails.
    render(<Footer />);

    const phone = screen.getByRole('link', { name: '+91 81246 00321' });
    expect(phone.getAttribute('href')).toBe('tel:+918124600321');

    const whatsapp = screen.getByRole('link', { name: 'WhatsApp' });
    expect(whatsapp.getAttribute('href')).toBe('https://wa.me/918124600321');

    // A real <address> element, which is the semantic home for the contact
    // details of the document it sits in.
    const address = document.querySelector('address');
    expect(address?.textContent).toContain('Nungambakkam High Rd');
    expect(address?.textContent).toContain('600006');
  });

  it('still marks the genuinely outstanding facts as pending', () => {
    // CIN and GST are quoted on invoices and checked against a government
    // register — a plausible-looking one is a false company record, not a
    // placeholder. They stay explicit gaps until supplied.
    render(<Footer />);
    expect(screen.getAllByText('to be published').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText(/coming soon/i)).toBeDefined();
  });

  it('uses the company name given in the spec, not a fabricated one', () => {
    render(<Footer />);
    expect(screen.getByText(/Luxe Axis Private Limited/)).toBeDefined();
  });
});
