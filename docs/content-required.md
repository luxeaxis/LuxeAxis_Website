# Content still required

Every "To be published" marker on the live site, with exactly where it goes and
what shape it needs. Hand this to whoever holds the facts.

Nothing here is a code change. Each item is a value dropped into a file that
already renders it — the components, tests and structured data are all built and
switch over automatically. Where a section currently shows a placeholder, it
becomes the real thing with no edit beyond the data.

**Why it was left blank rather than filled in with something plausible:** the
studio's whole proposition is published pricing and documentary proof. A
placeholder price, an invented statistic or a made-up testimonial discredits
precisely the claim the site is built to make — and several of these
(guarantee terms, tier prices) are commitments a visitor could hold you to.
`tests/unit/content.test.ts` asserts the blanks stay blank, so seeding a fake
fails the build rather than shipping.

---

## 1. Blocks launch

### 1.1 Lead endpoint — `LEAD_WEBHOOK_URL`

An HTTPS URL accepting a JSON `POST`. Space OS lead queue, a CRM inbound hook,
Zapier, Make — anything that receives and stores it.

Set as an environment variable at deploy. Nothing in the code changes.

Until it is set, `/api/lead` answers 503 and the form tells the visitor plainly,
offering email and WhatsApp with their enquiry pre-composed. That rescues the
lead but gives you no queue, no 30-minute first-touch clock and no UTM
attribution.

The payload shape is defined in `lib/lead/schema.ts` and includes
`receivedAt` and `firstTouchDueAt`, both computed server-side.

### 1.2 Privacy statement (DPDPA)

**Needs a lawyer. Deliberately not drafted.**

`/privacy` currently states, accurately, what the site collects and where it
goes — that part is knowable from the code. The formal statement is a legal
instrument: lawful basis, retention, transfers, data-principal rights, grievance
officer. A regulator and a data principal are both entitled to rely on every
word.

The Book-Audit consent checkbox and the cookie banner both link here. The form
should not collect personal data in production until this exists.

### 1.3 Terms of use

**Needs a lawyer.** `/terms` is a stub saying so, and is `noindex`.

---

## 2. Pricing and commitments

| Item | File | What is needed |
|---|---|---|
| Tier prices | `lib/content/source.ts:207, 214, 226` | A "from" figure in rupees for Essential, Signature, Elite. Replaces `priceFrom: null`. |
| Calculator rate card | `lib/content/source.ts` — `getCalculatorConfig()` returns `null` | Per-square-foot **band** (low and high) per tier, plus the min and max carpet area you will quote for, and a rounding unit. Shape is `CalculatorConfig` in `lib/content/types.ts`. |
| Guarantee terms | `lib/content/source.ts:349, 356` | The actual conditions of the 60-Day Handover Guarantee and the Supply-Chain Management fee. Replaces `terms: null`. |

Supplying tier prices switches the home page, `/pricing` and `/residential` from
tier summaries to real price bands. Supplying the rate card makes the Fee
Calculator appear — it is fully built and tested, and renders nowhere today
because it has no rates.

**A band, not a single figure.** The calculator is deliberately incapable of
producing a point estimate: you cannot honestly quote one before seeing the
space, and the arithmetic has no code path for it.

---

## 3. Proof

| Item | File | What is needed |
|---|---|---|
| Statistics | `lib/content/source.ts:259` (`STATS`) | Values for the four measures already named: projects delivered, on-time completion, Net Promoter Score, referral rate. |
| Testimonials | `lib/content/source.ts:258` (`TESTIMONIALS`) | Quote, real name, and context (e.g. "Adyar, 3BHK") — **with the client's consent to be named**. |
| Project photography | `lib/content/source.ts:257` (`PROJECTS`) | Per project: slug, title, neighbourhood, tier, and a photograph with alt text — **with the client's consent to publish**. |

Projects unlock `/portfolio` (currently an honest empty state) and the home
page's featured-work section, and are the prerequisite for the case-study route.

**Photographs, not renders.** A render of a real project reads as *less*
trustworthy than the photograph, and stock substitution is ruled out outright —
it is the one thing that would undercut the proof argument the rest of the site
rests on.

---

## 4. Studio facts

| Item | File | What is needed |
|---|---|---|
| ~~Opening hours~~ | — | **Settled: none published.** The studio works from a serviced floor and takes no drop-ins, so `openingHours` would assert to Google that the premises are open to the public — "Open now" above a door that will not open. The site publishes a response window instead (7am to 10pm, every day) plus "visits by appointment". |
| Founding date, team, credentials | `app/about/page.tsx:104` | The company facts an About page is made of. |
| Map coordinates | not yet modelled | Latitude and longitude. `geo` is omitted from `LocalBusiness` because coordinates guessed from a postcode put the map pin on the wrong building. |

Already supplied and live: address, phone, WhatsApp, both email addresses, CIN,
GST, domain and the vector logo.

---

## 5. Service detail

| Item | File | What is needed |
|---|---|---|
| White-Glove protocol | `app/nri/page.tsx:126` | The steps of the named remote protocol. The spec names it and does not enumerate it, and inventing the steps of a service protocol would be writing operational commitments. |
| Remote design tiers | `app/digital/page.tsx:64` | What Starter, Pro and Premium each include, and what they cost. |
| Commercial references | `app/commercial/[vertical]/page.tsx:115` | Case studies or references per vertical — workplace, retail & hospitality, healthcare. |
| Payment routes for NRI | `app/nri/[region]/page.tsx` | What you accept from each region, and in what currency. Payment terms are the wrong thing to guess at, since a visitor could act on them. |
| Design Club | `components/Footer.tsx` | What it is, and where the opt-in should post. |

---

## 6. Artwork

Eight of the nine scene posters are solid-navy placeholders. Only `journey` is
real — the studio's own section-divider artwork from Canva.

`three/registry.ts` lists all nine with their required aspect ratios. Two are
specifically photographic and cannot be solved with graphics:

- **`hero`** (16:9) — a real finished room. It is the LCP element and the first
  thing a visitor judges the studio on.
- **`portfolio`** (16:9) — completed project work.

The rest (persona-router, vastu, space-score, space-os, pricing-axis, nri-globe)
can be art-directed illustration in the navy-and-gold language.

---

## 7. Optional

| Item | Effect |
|---|---|
| `NEXT_PUBLIC_GA4_ID` / `NEXT_PUBLIC_POSTHOG_KEY` | Analytics is wired and consent-gated; it measures nothing until one is set. |
| `NEXT_PUBLIC_FLAG_THREE_V1=true` | Turns on the WebGL layer. Leave off until scenes exist — an empty rig costs a GPU context to render nothing. |
| `NEXT_PUBLIC_SITE_ORIGIN` | Defaults to `https://luxeaxis.in`. Set only if that is wrong. |

---

## 8. One decision, not an asset

**Does `luxeaxis.com` exist?** If the studio owns both, whichever is not
`luxeaxis.in` should 301 to it. Two domains serving the same site compete with
each other in search, and every canonical, sitemap entry and JSON-LD URL on this
site points at `.in`.
