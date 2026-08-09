'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  buildPersonalizedWhatsAppLink,
  ChannelKey,
  DEFAULT_WHATSAPP_CHANNELS,
} from '@/lib/whatsapp';

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<ChannelKey | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const widgetRef = useRef<HTMLDivElement>(null);

  const salesNumber = process.env.NEXT_PUBLIC_WHATSAPP_SALES_NUMBER || '919876543210';
  const supportNumber = process.env.NEXT_PUBLIC_WHATSAPP_SUPPORT_NUMBER || '919876543211';

  // Reset form when menu is closed or channel is deselected
  const handleClose = () => {
    setIsOpen(false);
    setSelectedChannel(null);
    setErrors({});
  };

  // Keyboard accessibility: dismiss popover on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    }

    function handleClickOutside(e: MouseEvent) {
      if (widgetRef.current && !widgetRef.current.contains(e.target as Node)) {
        handleClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const validate = () => {
    const newErrors: { name?: string; email?: string; phone?: string } = {};
    if (!name.trim() || name.trim().length < 2) {
      newErrors.name = 'Please enter your name.';
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Enter a valid email address.';
    }
    if (!phone.trim() || !/^[+\d][\d\s\-()]{6,}$/.test(phone.trim())) {
      newErrors.phone = 'Enter a mobile number we can reach you on.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChannel || !validate()) return;

    setIsSubmitting(true);
    const targetPhone = selectedChannel === 'support' ? supportNumber : salesNumber;

    // Send lead payload asynchronously to /api/lead
    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyType: 'other',
          areaSqFt: 1000,
          tier: 'undecided',
          city: 'Chennai',
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          preferredTime: 'any',
          contactMethod: 'whatsapp',
          notes: `WhatsApp Widget Inquiry (${DEFAULT_WHATSAPP_CHANNELS[selectedChannel].label})`,
          consent: true,
        }),
      });
    } catch {
      // Fail open: even if /api/lead fails or is offline, do not block WhatsApp redirect
    }

    // Build personalized WhatsApp link and open in new tab
    const waLink = buildPersonalizedWhatsAppLink(targetPhone, selectedChannel, {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
    });

    window.open(waLink, '_blank', 'noopener,noreferrer');

    setIsSubmitting(false);
    handleClose();
  };

  return (
    <div ref={widgetRef} className="fixed bottom-6 right-6 z-50 isolate">
      {/* Popover Menu */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="WhatsApp Chat Options"
          className="absolute bottom-16 right-0 w-76 sm:w-88 max-w-[calc(100vw-2rem)] lx-liquid-glass rounded-2xl p-4 border border-accent/40 shadow-2xl backdrop-blur-2xl transition-all duration-300 space-y-3 animate-in fade-in slide-in-from-bottom-3"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/15 pb-2.5">
            <div className="flex items-center gap-2.5">
              {selectedChannel ? (
                <button
                  type="button"
                  onClick={() => setSelectedChannel(null)}
                  className="p-1.5 rounded-lg text-on-surface-2 hover:text-on-surface hover:bg-white/10 transition-colors"
                  aria-label="Back to channels"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-md shrink-0">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.461c-1.852 0-3.666-.499-5.257-1.442l-.377-.225-3.905 1.024 1.042-3.805-.247-.393A9.87 9.87 0 012.04 11.96C2.04 6.47 6.494 2.016 11.986 2.016c2.66 0 5.16 1.036 7.042 2.92a9.927 9.927 0 012.916 7.025c-.004 5.489-4.46 9.942-9.951 9.942m8.471-18.423A11.878 11.878 0 0011.986 0C5.372 0 .004 5.367.004 11.959c0 2.107.549 4.164 1.593 5.975L0 24l6.236-1.635A11.865 11.865 0 0011.98 23.92c6.611 0 11.98-5.368 11.984-11.961.002-3.197-1.243-6.201-3.513-8.463" />
                  </svg>
                </div>
              )}
              <div>
                <h4 className="font-display text-xs sm:text-sm font-bold text-on-surface">
                  {selectedChannel
                    ? DEFAULT_WHATSAPP_CHANNELS[selectedChannel].label
                    : 'Direct WhatsApp Chat'}
                </h4>
                <p className="text-[10px] text-on-surface-2 font-medium">
                  {selectedChannel ? 'Enter details to start chat' : 'Instant reply from LuxeAxis team'}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-on-surface-muted hover:text-on-surface p-1 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close WhatsApp Menu"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* VIEW 1: Channel Selector */}
          {!selectedChannel && (
            <div className="space-y-2">
              {(['sales', 'audit', 'support'] as ChannelKey[]).map((key) => {
                const channel = DEFAULT_WHATSAPP_CHANNELS[key];
                const icons: Record<ChannelKey, string> = { sales: '💬', audit: '📐', support: '🛠️' };
                const badges: Record<ChannelKey, { label: string; style: string }> = {
                  sales: { label: 'Sales', style: 'bg-amber-400/10 text-amber-400 border-amber-400/20' },
                  audit: { label: 'Lead', style: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' },
                  support: { label: 'Support', style: 'bg-blue-400/10 text-blue-400 border-blue-400/20' },
                };

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedChannel(key)}
                    className="w-full text-left group flex items-center gap-2.5 p-2.5 rounded-xl lx-liquid-glass-card border border-accent/25 hover:border-accent/60 transition-all duration-200"
                  >
                    <div className="w-7 h-7 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20 flex items-center justify-center text-xs font-bold shrink-0 group-hover:scale-105 transition-transform">
                      {icons[key]}
                    </div>
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-on-surface group-hover:text-accent transition-colors truncate">
                          {channel.label}
                        </span>
                        <span
                          className={`text-[9px] uppercase font-mono px-1 py-0.2 rounded border shrink-0 ml-1 ${badges[key].style}`}
                        >
                          {badges[key].label}
                        </span>
                      </div>
                      <p className="text-[10px] text-on-surface-2 truncate">{channel.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* VIEW 2: Pre-Chat Contact Form */}
          {selectedChannel && (
            <form onSubmit={handleSubmit} className="space-y-2.5">
              {/* Full Name */}
              <div>
                <label htmlFor="wa-name" className="block text-[10px] font-semibold text-on-surface mb-1">
                  Full Name <span className="text-accent">*</span>
                </label>
                <input
                  id="wa-name"
                  type="text"
                  required
                  placeholder="Your Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-surface-deep/80 border border-white/20 text-xs text-on-surface placeholder:text-on-surface-muted focus:outline-none focus:border-accent transition-colors"
                />
                {errors.name && <p className="text-[9px] text-red-400 mt-0.5">{errors.name}</p>}
              </div>

              {/* Email Address */}
              <div>
                <label htmlFor="wa-email" className="block text-[10px] font-semibold text-on-surface mb-1">
                  Email Address <span className="text-accent">*</span>
                </label>
                <input
                  id="wa-email"
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-surface-deep/80 border border-white/20 text-xs text-on-surface placeholder:text-on-surface-muted focus:outline-none focus:border-accent transition-colors"
                />
                {errors.email && <p className="text-[9px] text-red-400 mt-0.5">{errors.email}</p>}
              </div>

              {/* Mobile Number */}
              <div>
                <label htmlFor="wa-phone" className="block text-[10px] font-semibold text-on-surface mb-1">
                  Mobile / WhatsApp Number <span className="text-accent">*</span>
                </label>
                <input
                  id="wa-phone"
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-surface-deep/80 border border-white/20 text-xs text-on-surface placeholder:text-on-surface-muted focus:outline-none focus:border-accent transition-colors"
                />
                {errors.phone && <p className="text-[9px] text-red-400 mt-0.5">{errors.phone}</p>}
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold shadow-md hover:shadow-[0_0_20px_rgba(37,211,102,0.5)] transition-all flex items-center justify-center gap-2 border border-white/20"
              >
                {isSubmitting ? (
                  <span>Connecting...</span>
                ) : (
                  <>
                    <span>Start WhatsApp Chat</span>
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.461c-1.852 0-3.666-.499-5.257-1.442l-.377-.225-3.905 1.024 1.042-3.805-.247-.393A9.87 9.87 0 012.04 11.96C2.04 6.47 6.494 2.016 11.986 2.016c2.66 0 5.16 1.036 7.042 2.92a9.927 9.927 0 012.916 7.025c-.004 5.489-4.46 9.942-9.951 9.942m8.471-18.423A11.878 11.878 0 0011.986 0C5.372 0 .004 5.367.004 11.959c0 2.107.549 4.164 1.593 5.975L0 24l6.236-1.635A11.865 11.865 0 0011.98 23.92c6.611 0 11.98-5.368 11.984-11.961.002-3.197-1.243-6.201-3.513-8.463" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          )}

          <div className="text-center border-t border-white/10 pt-2">
            <span className="text-[9px] text-on-surface-muted font-ui">
              ⚡ Replies within 15 minutes during studio hours
            </span>
          </div>
        </div>
      )}

      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label="Open WhatsApp Chat Widget"
        className="group relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_8px_30px_rgba(37,211,102,0.45)] hover:shadow-[0_12px_40px_rgba(37,211,102,0.7)] hover:scale-110 active:scale-95 transition-all duration-300 border border-white/30"
      >
        <svg className="w-6 h-6 sm:w-7 sm:h-7 fill-current transition-transform duration-300 group-hover:rotate-12" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.461c-1.852 0-3.666-.499-5.257-1.442l-.377-.225-3.905 1.024 1.042-3.805-.247-.393A9.87 9.87 0 012.04 11.96C2.04 6.47 6.494 2.016 11.986 2.016c2.66 0 5.16 1.036 7.042 2.92a9.927 9.927 0 012.916 7.025c-.004 5.489-4.46 9.942-9.951 9.942m8.471-18.423A11.878 11.878 0 0011.986 0C5.372 0 .004 5.367.004 11.959c0 2.107.549 4.164 1.593 5.975L0 24l6.236-1.635A11.865 11.865 0 0011.98 23.92c6.611 0 11.98-5.368 11.984-11.961.002-3.197-1.243-6.201-3.513-8.463" />
        </svg>
        {/* Pulsing notification dot */}
        <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-surface-deep" />
        </span>
      </button>
    </div>
  );
}
