import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, expect, it, vi, afterEach } from 'vitest';
import WhatsAppWidget from '@/components/ui/WhatsAppWidget';
import { buildPersonalizedWhatsAppLink, buildWhatsAppLink, cleanPhoneNumber } from '@/lib/whatsapp';

describe('WhatsApp Integration & Widget', () => {
  afterEach(() => {
    cleanup();
  });

  it('cleanPhoneNumber formats phone digits correctly', () => {
    expect(cleanPhoneNumber('+91 98765 43210')).toBe('919876543210');
    expect(cleanPhoneNumber('91-98765-43210')).toBe('919876543210');
  });

  it('buildWhatsAppLink generates valid wa.me link with encoded message', () => {
    const link = buildWhatsAppLink('919876543210', 'Hello LuxeAxis');
    expect(link).toBe('https://wa.me/919876543210?text=Hello%20LuxeAxis');
  });

  it('buildPersonalizedWhatsAppLink builds wa.me link with user details', () => {
    const link = buildPersonalizedWhatsAppLink('919876543210', 'sales', {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+919876543210',
    });
    expect(link).toContain('John%20Doe');
    expect(link).toContain('john%40example.com');
    expect(link).toContain('919876543210');
  });

  it('renders trigger button and channel options on click', () => {
    render(<WhatsAppWidget />);
    const trigger = screen.getByRole('button', { name: 'Open WhatsApp Chat Widget' });
    expect(trigger).toBeDefined();

    // Click trigger to open menu
    fireEvent.click(trigger);
    expect(screen.getByRole('heading', { name: 'Direct WhatsApp Chat' })).toBeDefined();
    expect(screen.getByText('Sales & Consultations')).toBeDefined();
    expect(screen.getByText('Book Free Audit')).toBeDefined();
    expect(screen.getByText('Project Support & Space OS')).toBeDefined();
  });

  it('navigates to contact form when a channel is selected and opens WhatsApp on submit', async () => {
    window.open = vi.fn();
    render(<WhatsAppWidget />);
    
    // Open widget
    fireEvent.click(screen.getByRole('button', { name: 'Open WhatsApp Chat Widget' }));
    
    // Select Sales channel
    fireEvent.click(screen.getByText('Design inquiries, pricing, & estimates'));
    expect(screen.getByText('Enter details to start chat')).toBeDefined();
    expect(screen.getByLabelText(/Full Name/i)).toBeDefined();
    expect(screen.getByLabelText(/Email Address/i)).toBeDefined();
    expect(screen.getByLabelText(/Mobile /i)).toBeDefined();

    // Fill form
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText(/Mobile /i), { target: { value: '+919876543210' } });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /Start WhatsApp Chat/i }));

    await waitFor(() => {
      expect(window.open).toHaveBeenCalledWith(
        expect.stringContaining('Jane%20Doe'),
        '_blank',
        'noopener,noreferrer'
      );
    });
  });
});
