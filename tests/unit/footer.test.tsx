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

  it('marks the WhatsApp, address and Design Club slots as pending rather than inventing copy', () => {
    render(<Footer />);
    expect(screen.getByText('Number to be published.')).toBeDefined();
    expect(screen.getByText('Address to be published.')).toBeDefined();
    expect(screen.getByText(/coming soon/i)).toBeDefined();
  });

  it('uses the company name given in the spec, not a fabricated one', () => {
    render(<Footer />);
    expect(screen.getByText(/Luxe Axis Private Limited/)).toBeDefined();
  });
});
