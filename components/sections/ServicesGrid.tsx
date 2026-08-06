import Image from 'next/image';
import { Container, Grid, Stack } from '@/components/layout';
import { Link } from '@/components/Link';

/**
 * ServicesGrid — 6 interior design service cards (Build Backlog HomeOne Layout Alignment).
 */
export function ServicesGrid() {
  const services = [
    {
      num: '01',
      title: 'Full Home Interiors',
      desc: 'Complete 2BHK, 3BHK, and Villa interior design packages with everything included.',
      href: '/residential',
      image: '/posters/hero.avif',
    },
    {
      num: '02',
      title: 'Modular Kitchens',
      desc: 'Hafele & Hettich German hardware, marine ply carcass, and precision factory installation.',
      href: '/residential/signature',
      image: '/posters/hero.avif',
    },
    {
      num: '03',
      title: 'Master Bedrooms & Wardrobes',
      desc: 'Luxury master suites, walk-in wardrobes, and soft-close storage systems.',
      href: '/residential/essential',
      image: '/posters/hero.avif',
    },
    {
      num: '04',
      title: 'Living Rooms & False Ceiling',
      desc: 'Architectural false ceilings, cove lighting, feature walls, and bespoke TV units.',
      href: '/residential/elite',
      image: '/posters/hero.avif',
    },
    {
      num: '05',
      title: 'Commercial & Workplaces',
      desc: 'Tech offices and boutique commercial interiors that boost productivity and brand presence.',
      href: '/commercial',
      image: '/posters/hero.avif',
    },
    {
      num: '06',
      title: 'Vastu-Tech 3D Staging',
      desc: 'Photorealistic 3D visualization and automated Vastu orientation verification before build.',
      href: '/intelligence/vastu-tech',
      image: '/posters/hero.avif',
    },
  ];

  return (
    <section className="py-section-y border-b border-border-subtle" aria-labelledby="services-heading">
      <Container>
        <Stack gap={8}>
          <Stack gap={3} className="text-center max-w-measure mx-auto">
            <p className="font-ui text-overline uppercase tracking-[var(--font-tracking-wider)] text-accent font-semibold">
              What We Design
            </p>
            <h2 id="services-heading" className="font-display text-[length:var(--typography-h2-font-size)] leading-tight text-on-surface">
              Interior Design Services in Chennai
            </h2>
            <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface-2">
              From turnkey residential packages to specialized modular kitchens and commercial spaces, backed by fixed transparent pricing.
            </p>
          </Stack>

          <Grid cols={3} gap={6}>
            {services.map((svc) => (
              <div
                key={svc.title}
                className="group relative overflow-hidden rounded-lg border border-border-subtle bg-surface-deep transition-all duration-300 hover:border-accent/60 hover:shadow-xl"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={svc.image}
                    alt={svc.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-deep via-surface-deep/40 to-transparent" />
                  <span className="absolute top-4 left-4 font-display text-h3 text-accent font-bold">
                    {svc.num}
                  </span>
                </div>

                <div className="p-6">
                  <Stack gap={3}>
                    <h3 className="font-display text-h3 text-on-surface group-hover:text-accent transition-colors">
                      {svc.title}
                    </h3>
                    <p className="font-ui text-small text-on-surface-2">{svc.desc}</p>
                    <Link href={svc.href} variant="standalone" className="font-ui text-small font-semibold">
                      Explore Service →
                    </Link>
                  </Stack>
                </div>
              </div>
            ))}
          </Grid>
        </Stack>
      </Container>
    </section>
  );
}
