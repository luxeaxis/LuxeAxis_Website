import { Container, Stack } from '@/components/layout';

/**
 * MaterialPartners — premium brand partner marquee (Build Backlog HomeOne Layout Alignment).
 */
export function MaterialPartners() {
  const partners = [
    { name: 'Häfele', category: 'German Hardware & Fittings' },
    { name: 'Hettich', category: 'Soft-Close Motion Systems' },
    { name: 'CenturyPly', category: 'Boiling Waterproof Marine Plywood' },
    { name: 'Asian Paints', category: 'Royale Luxury Emulsion & Finishes' },
    { name: 'Saint-Gobain', category: 'High-Clarity Glass & Mirrors' },
    { name: 'Somany', category: 'Vitrified Large-Format Tiles' },
    { name: 'Sleek Kitchen', category: 'Modular Wirework & Accessories' },
  ];

  return (
    <section className="py-section-y border-b border-border-subtle overflow-hidden" aria-labelledby="partners-heading">
      <Container>
        <Stack gap={6} className="text-center">
          <Stack gap={2} className="max-w-measure mx-auto">
            <p className="font-ui text-overline uppercase tracking-[var(--font-tracking-wider)] text-accent font-semibold">
              Quality You Can Touch
            </p>
            <h2 id="partners-heading" className="font-display text-h2 text-on-surface">
              Partnered with World-Class Brands
            </h2>
          </Stack>

          <div className="relative w-full overflow-hidden py-4">
            <div className="flex w-max animate-marquee space-x-6">
              {[...partners, ...partners].map((partner, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-3 rounded-lg border border-border-subtle bg-surface-deep px-6 py-4 shadow-sm"
                >
                  <span className="font-display text-h3 font-bold text-accent">{partner.name}</span>
                  <span className="text-border-subtle">|</span>
                  <span className="font-ui text-small text-on-surface-2">{partner.category}</span>
                </div>
              ))}
            </div>
          </div>
        </Stack>
      </Container>
    </section>
  );
}
