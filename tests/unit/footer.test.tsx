import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import { Footer } from '@/components/Footer';

afterEach(cleanup);

describe('Footer', () => {
  it('renders the sitemap as a labelled nav landmark with routes from the spec', () => {
    render(<Footer />);
    const nav = screen.getByRole('navigation', { name: 'Site map' });
    expect(
      within(nav)
        .getByRole('link', { name: 'Vastu-Tech' })
        .getAttribute('href'),
    ).toBe('/intelligence/vastu-tech');
    expect(
      within(nav)
        .getByRole('link', { name: 'Book a design audit' })
        .getAttribute('href'),
    ).toBe('/book-audit');
    expect(
      within(nav).getByRole('link', { name: 'Privacy' }).getAttribute('href'),
    ).toBe('/privacy');
  });

  it('publishes the registered CIN and GST exactly as issued', () => {
    // This asserted a "to be published" placeholder until the studio supplied
    // them. Now that both are real, the thing worth pinning is that they render
    // CHARACTER FOR CHARACTER — these two go on every invoice the studio
    // raises and are checked against a government register, so a truncation or
    // a stray space is a compliance problem, not a display bug.
    render(<Footer />);
    expect(screen.getByText('CIN')).toBeDefined();
    expect(screen.getByText('GST')).toBeDefined();
    expect(screen.getByText('U74102TN2026PTC194776')).toBeDefined();
    expect(screen.getByText('33AAGCL9614E1ZM')).toBeDefined();
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
    // The DPDPA privacy statement and the Design Club opt-in are the two things
    // left in the footer that nobody has supplied. They stay explicit gaps
    // rather than quietly disappearing.
    render(<Footer />);
    expect(
      screen.getByText(/privacy statement to be published/i),
    ).toBeDefined();
    expect(screen.getByText(/coming soon/i)).toBeDefined();
  });

  it('uses the company name given in the spec, not a fabricated one', () => {
    render(<Footer />);
    expect(screen.getByText(/Luxe Axis Private Limited/)).toBeDefined();
  });
});
