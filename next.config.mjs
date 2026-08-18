/**
 * Response headers, applied to every route.
 *
 * The site previously sent none of these — no framing protection, no MIME
 * sniffing protection, no referrer policy — and leaked `X-Powered-By: Next.js`
 * on top (see `poweredByHeader` below).
 *
 * Note what is NOT here: a script/style Content-Security-Policy. Next's App
 * Router inlines bootstrap and flight-payload scripts, so a real policy needs
 * per-request nonces threaded through middleware and into the document, and a
 * CSP written without them either breaks the app outright or has to be widened
 * with `'unsafe-inline'` — which is a CSP in name only, and worse than none
 * because it looks like protection in an audit. That work is worth doing on its
 * own, with its own e2e proof that no route console-errors under it. Until then
 * this file carries only headers that are correct with no further plumbing.
 *
 * `frame-ancestors` IS included, because it is the one directive that costs
 * nothing here: it constrains who may embed the site, never what the page may
 * load, so it cannot break a script. It duplicates `X-Frame-Options` on purpose
 * — the modern directive for browsers that honour it, the legacy header for
 * anything that does not.
 */
const SECURITY_HEADERS = [
  // Allow same-origin framing so TinaCMS admin can render visual previews in its admin iframe
  { key: 'Content-Security-Policy', value: "frame-ancestors 'self'" },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  // Stops a browser second-guessing a declared Content-Type — the vector for
  // turning an uploaded or user-supplied file into executable script.
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Send the full URL within our own origin (useful for analytics later), but
  // only the bare origin when leaving it, so internal paths never leak into a
  // third party's referrer logs.
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // No feature of this site uses any of these. Denying them means a future
  // third-party embed cannot quietly start asking visitors for them either.
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  // Two years, subdomains included, preload-eligible. Set here rather than at
  // the CDN so the guarantee travels with the app regardless of where it is
  // deployed; a browser simply ignores it when served over plain HTTP, so this
  // is inert in local development rather than something to gate on NODE_ENV.
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { formats: ['image/avif', 'image/webp'] },
  // Volunteers the exact framework and therefore its CVE list to anyone
  // running `curl -I`. It buys nothing in return.
  poweredByHeader: false,
  async rewrites() {
    return [
      {
        source: '/admin',
        destination: '/admin/index.html',
      },
    ];
  },
  async headers() {
    return [{ source: '/:path*', headers: SECURITY_HEADERS }];
  },
};

export default nextConfig;
