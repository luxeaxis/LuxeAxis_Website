import { Container, Stack } from '@/components/layout';
import { Reveal } from '@/components/Reveal';
import {
  HafeleLogo,
  HettichLogo,
  BlumLogo,
  CenturyPlyLogo,
  GreenplyLogo,
  AsianPaintsLogo,
  BergerPaintsLogo,
  SaintGobainLogo,
  DupontCorianLogo,
  FevicolLogo,
} from '@/components/icons/PartnerLogos';

/**
 * MaterialPartners — premium brand partner marquee featuring 10 official vector partner logos (Build Backlog HomeOne Layout Alignment).
 */
export function MaterialPartners() {
  const partners = [
    {
      name: 'Häfele',
      category: 'German Architectural Hardware',
      Logo: HafeleLogo,
    },
    {
      name: 'Hettich',
      category: 'Soft-Close Drawer Systems',
      Logo: HettichLogo,
    },
    {
      name: 'Blum',
      category: 'Austrian Precision Motion',
      Logo: BlumLogo,
    },
    {
      name: 'CenturyPly',
      category: 'Boiling Waterproof Marine Ply',
      Logo: CenturyPlyLogo,
    },
    {
      name: 'Greenply',
      category: 'Eco-Certified Structural Plywood',
      Logo: GreenplyLogo,
    },
    {
      name: 'Asian Paints',
      category: 'Royale Luxury Emulsion & Finishes',
      Logo: AsianPaintsLogo,
    },
    {
      name: 'Berger Paints',
      category: 'Protective & Weathercoat Finishes',
      Logo: BergerPaintsLogo,
    },
    {
      name: 'Saint-Gobain',
      category: 'High-Clarity Glass & Gyproc Ceilings',
      Logo: SaintGobainLogo,
    },
    {
      name: 'DuPont Corian',
      category: 'Solid Surface Countertops',
      Logo: DupontCorianLogo,
    },
    {
      name: 'Fevicol',
      category: 'Marine Grade Wood Adhesives',
      Logo: FevicolLogo,
    },
  ];

  return (
    <section
      className="py-section-y border-b border-border-subtle overflow-hidden"
      aria-labelledby="partners-heading"
    >
      <Container>
        <Stack gap={6} className="text-center">
          <Reveal>
            <Stack gap={2} className="max-w-measure mx-auto">
              <p className="font-ui text-overline uppercase tracking-[var(--font-tracking-wider)] text-accent font-semibold">
                Quality You Can Touch
              </p>
              <h2
                id="partners-heading"
                className="font-display text-h2 text-on-surface"
              >
                Partnered with World-Class Brands
              </h2>
            </Stack>
          </Reveal>

          <div className="relative w-full overflow-hidden py-4">
            <div className="flex w-max animate-marquee space-x-6">
              {[...partners, ...partners].map((partner, idx) => {
                const LogoComponent = partner.Logo;
                return (
                  <div
                    key={`${partner.name}-${idx}`}
                    className="group flex items-center space-x-4 rounded-xl bg-surface-deep/80 border border-accent/20 backdrop-blur-md px-5 py-3 shadow-md transition-all duration-300 hover:border-accent/50 hover:bg-surface-raised/80 hover:scale-[1.02]"
                  >
                    <div className="shrink-0 flex items-center justify-center">
                      <LogoComponent className="h-7 w-auto max-w-[130px] transition-transform duration-300 group-hover:scale-105" />
                    </div>
                    <div className="text-left min-w-0">
                      <strong className="block font-display text-xs font-bold text-on-surface group-hover:text-accent transition-colors duration-300 leading-tight">
                        {partner.name}
                      </strong>
                      <span className="font-ui text-[10px] text-on-surface-muted truncate block">
                        {partner.category}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Stack>
      </Container>
    </section>
  );
}
