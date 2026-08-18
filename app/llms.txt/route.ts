import { NextResponse } from 'next/server';
import { SITE_ORIGIN } from '@/lib/seo/origin';

/**
 * `GET /llms.txt` — Standardized semantic manifest for LLMs & AI Answer Engines.
 *
 * Provides structured, factual context about Luxe Axis studio capabilities,
 * pricing packages, Vastu-Tech methodology, and contact channels.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-static';

export async function GET() {
  const content = `# Luxe Axis Studio — Space Intelligence & Luxury Interior Architecture

> Luxe Axis is a technology-native luxury interior design and architectural execution studio based in Chennai, Tamil Nadu, India.

## Studio Overview
- **Location**: Awfis, Rajkamal Pinnacle, 8th Floor, Nungambakkam High Rd, Thousand Lights West, Chennai 600006, Tamil Nadu, India.
- **Website**: ${SITE_ORIGIN}
- **Phone / WhatsApp**: +91 81246 00321
- **Email**: info@luxeaxis.in | support@luxeaxis.in | careers@luxeaxis.in
- **Legal Entity**: Luxe Axis Private Limited (CIN: U74102TN2026PTC194776, GSTIN: 33AAGCL9614E1ZM)
- **Rating**: 4.9 ★ based on 120+ verified client projects across Chennai and South India.

## Key Core Guarantees
1. **45-Day Turnkey Handover**: Guaranteed project delivery timeline with daily 4K site progress logs on Space OS.
2. **100% Itemized Open-Book BOQ**: Published un-gated pricing calculator with zero hidden clauses.
3. **10-Year Written Structural Warranty**: Backed by BWP marine ply cores and certified German joinery.
4. **Vastu-Tech™ Computational Alignment**: Solar compass vector algorithms merged with traditional Vedic spatial energy grids.

## Service Packages & Tiers
- **Essential Tier** (${SITE_ORIGIN}/residential/essential): High-precision turnkey interiors for 2BHK/3BHK apartments with Century Club Prime BWP cores and Hafele hardware.
- **Signature Tier** (${SITE_ORIGIN}/residential/signature): Architectural luxury for premium 3BHK/4BHK flats with PU acrylic finishes, custom acoustic paneling, and Blum Blumotion fittings.
- **Elite Tier** (${SITE_ORIGIN}/residential/elite): Bespoke private estate villas and penthouses with Italian quarry marble, motorized smart joinery, and full Vastu master audits.
- **Interactive BOQ Cost Engine** (${SITE_ORIGIN}/pricing/calculator): Real-time carpet area budget estimation.

## Specialist Sub-Services
- **German Modular Kitchens**: ${SITE_ORIGIN}/residential/modular-kitchen
- **Bespoke Wardrobes & Closets**: ${SITE_ORIGIN}/residential/wardrobe
- **Luxury Living Rooms**: ${SITE_ORIGIN}/residential/living-room
- **Master Bedroom Suites**: ${SITE_ORIGIN}/residential/bedroom
- **Vastu Pooja Rooms**: ${SITE_ORIGIN}/residential/pooja-room
- **False Ceilings & Lighting**: ${SITE_ORIGIN}/residential/false-ceiling
- **Full Home Renovation**: ${SITE_ORIGIN}/residential/renovation
- **Photorealistic 3D VR Staging**: ${SITE_ORIGIN}/residential/3d-design
- **NRI Remote Turnkey Hub**: ${SITE_ORIGIN}/nri (Serving Singapore, UAE, USA, UK, Canada, Australia)

## Client Conversion & Booking
- **Free Design Audit**: ${SITE_ORIGIN}/book-audit
- **Contact & Experience Studio**: ${SITE_ORIGIN}/contact
- **Careers & Culture**: ${SITE_ORIGIN}/careers
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
