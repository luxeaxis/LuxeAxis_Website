import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import WhatsAppWidget from '@/components/ui/WhatsAppWidget';
import { buildWhatsAppLink, cleanPhoneNumber } from '@/lib/whatsapp';

describe('WhatsApp Integration & Widget', () => {
  it('cleanPhoneNumber formats phone digits correctly', () => {
    expect(cleanPhoneNumber('+91 98765 43210')).toBe('919876543210');
    expect(cleanPhoneNumber('91-98765-43210')).toBe('919876543210');
  });

  it('buildWhatsAppLink generates valid wa.me link with encoded message', () => {
    const link = buildWhatsAppLink('919876543210', 'Hello LuxeAxis');
    expect(link).toBe('https://wa.me/919876543210?text=Hello%20LuxeAxis');
  });

  it('renders trigger button and opens popover on click', () => {
    render(<WhatsAppWidget />);
    const trigger = screen.getByLabelText('Open WhatsApp Chat Widget');
    expect(trigger).toBeDefined();

    // Click trigger to open menu
    fireEvent.click(trigger);
    expect(screen.getByText('Direct WhatsApp Chat')).toBeDefined();
    expect(screen.getByText('Sales & Consultations')).toBeDefined();
    expect(screen.getByText('Book Free Audit')).toBeDefined();
    expect(screen.getByText('Project Support & Space OS')).toBeDefined();
  });
});
