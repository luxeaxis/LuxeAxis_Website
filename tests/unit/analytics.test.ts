import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CONSENT_COOKIE, readConsent } from '@/lib/analytics/consent';
import { isAnalyticsConfigured, stripPii } from '@/lib/analytics/client';
import {
  breadcrumbJsonLd,
  humanise,
  localBusinessJsonLd,
  organizationJsonLd,
  serviceJsonLd,
} from '@/lib/seo/jsonLd';

beforeEach(() => {
  vi.unstubAllEnvs();
});
afterEach(() => {
  vi.unstubAllEnvs();
});

describe('consent state', () => {
  it('treats "never asked" as its own state, not as a refusal', () => {
    // `unknown` and `denied` both block analytics, but they differ in what the
    // banner should do. Collapsing them into a boolean would either re-ask
    // someone who already declined, or treat silence as a decision.
    expect(readConsent(undefined)).toBe('unknown');
    expect(readConsent('')).toBe('unknown');
    expect(readConsent('other=1')).toBe('unknown');
  });

  it('reads a decision back', () => {
    expect(readConsent(`${CONSENT_COOKIE}=granted`)).toBe('granted');
    expect(readConsent(`${CONSENT_COOKIE}=denied`)).toBe('denied');
  });

  it('finds the cookie among others, and ignores a lookalike name', () => {
    expect(readConsent(`a=1; ${CONSENT_COOKIE}=granted; b=2`)).toBe('granted');
    // The regex must not match `not-lx-consent=granted`.
    expect(readConsent('not-lx-consent=granted')).toBe('unknown');
  });

  it('refuses a value it does not recognise rather than guessing', () => {
    expect(readConsent(`${CONSENT_COOKIE}=yes`)).toBe('unknown');
    expect(readConsent(`${CONSENT_COOKIE}=true`)).toBe('unknown');
  });
});

describe('the analytics configuration gate', () => {
  it('reports nothing configured, so no provider can load today', () => {
    // The second of the two gates. It is what lets the consent plumbing ship
    // and be tested now, with a real provider becoming an environment change
    // rather than a code change.
    expect(isAnalyticsConfigured()).toBe(false);
  });
});

describe('stripPii', () => {
  it('drops an email address', () => {
    // §10.7: "no PII in event payloads". The realistic failure is somebody
    // passing a whole form object into audit_submit because it was convenient.
    expect(
      stripPii({ email: 'visitor@example.com', tier: 'Signature' }),
    ).toEqual({
      tier: 'Signature',
    });
  });

  it('drops phone numbers in the formats this site actually accepts', () => {
    for (const phone of [
      '+91 98400 00000',
      '9840000000',
      '+1 (415) 555-0123',
    ]) {
      expect(stripPii({ phone, ok: 'keep' }), phone).toEqual({ ok: 'keep' });
    }
  });

  it('keeps the non-identifying properties an event is actually for', () => {
    expect(stripPii({ tier: 'Elite', areaSqFt: 1200, clamped: false })).toEqual(
      {
        tier: 'Elite',
        areaSqFt: 1200,
        clamped: false,
      },
    );
  });

  it('does not mistake an ordinary number for a phone number', () => {
    // 1200 sq ft is not a phone number. Over-stripping would quietly delete the
    // data the event exists to carry.
    expect(stripPii({ areaSqFt: 1200 })).toEqual({ areaSqFt: 1200 });
  });
});

describe('structured data', () => {
  it('describes the organisation without inventing its details', () => {
    const org = organizationJsonLd();
    expect(org['@type']).toBe('Organization');
    expect(org.name).toBe('Luxe Axis');
    // Every one of these is a real Organization property and a real fact nobody
    // has supplied. Absent beats guessed — JSON-LD is machine-readable, so an
    // invented value here is fed straight into a search index.
    for (const property of [
      'address',
      'telephone',
      'foundingDate',
      'logo',
      'sameAs',
    ]) {
      expect(org, property).not.toHaveProperty(property);
    }
  });

  it('emits a LocalBusiness node built from the real address', () => {
    // Withheld until the studio supplied an address, because an invented one is
    // machine-readable and can generate Maps directions to a building that has
    // nothing to do with the studio. With a real address it is the highest-value
    // markup on a local-services site.
    const business = localBusinessJsonLd()!;
    expect(business['@type']).toBe('LocalBusiness');
    expect(business.address.postalCode).toBe('600006');
    expect(business.address.addressLocality).toBe('Chennai');
    expect(business.address.addressCountry).toBe('IN');
    // Anchored to the site origin so Organization and LocalBusiness read as one
    // entity rather than two businesses sharing a name.
    expect(business['@id']).toBe('https://luxeaxis.in#studio');
  });

  it('includes only the contact properties that are actually known', () => {
    const business = localBusinessJsonLd()!;
    // Supplied.
    expect(business.telephone).toBe('+918124600321');
    expect(business.email).toBe('info@luxeaxis.in');
    // Not supplied. `geo` in particular stays out — approximating coordinates
    // from a postcode puts the pin on the wrong building.
    expect(business).not.toHaveProperty('openingHours');
    expect(business).not.toHaveProperty('geo');
  });

  it('builds a service node that points back at the organisation', () => {
    const service = serviceJsonLd({
      name: 'Residential interior design',
      description: 'Three tiers, published openly.',
      url: '/residential',
    });
    expect(service['@type']).toBe('Service');
    expect(service.url).toBe('https://luxeaxis.in/residential');
    expect(service.provider.name).toBe('Luxe Axis');
    // No `offers`: that needs a price, and none is published.
    expect(service).not.toHaveProperty('offers');
  });

  it('derives breadcrumbs from the path, in order, starting at home', () => {
    const crumbs = breadcrumbJsonLd('/intelligence/vastu-tech');
    expect(crumbs.itemListElement.map((item) => item.name)).toEqual([
      'Home',
      'Intelligence',
      'Vastu Tech',
    ]);
    expect(crumbs.itemListElement.map((item) => item.position)).toEqual([
      1, 2, 3,
    ]);
    expect(crumbs.itemListElement[1]!.item).toBe(
      'https://luxeaxis.in/intelligence',
    );
  });

  it('accepts a label override where a slug reads badly', () => {
    const crumbs = breadcrumbJsonLd('/commercial/retail-hospitality', {
      'retail-hospitality': 'Retail & Hospitality',
    });
    expect(crumbs.itemListElement[2]!.name).toBe('Retail & Hospitality');
  });

  it('names only URLs that exist, since every crumb is a real page', () => {
    // A BreadcrumbList naming an intermediate URL that 404s is worse than none.
    // Safe only because tests/unit/routes.test.ts enforces that every segment
    // of this site's URLs is a real page.
    const crumbs = breadcrumbJsonLd('/residential/signature');
    for (const item of crumbs.itemListElement) {
      expect(item.item.startsWith('https://luxeaxis.in')).toBe(true);
    }
  });

  it('humanises a slug', () => {
    expect(humanise('space-os')).toBe('Space Os');
    expect(humanise('nri')).toBe('Nri');
  });
});
