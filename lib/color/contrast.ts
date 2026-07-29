/** Parses #rgb, #rrggbb, rgb(), or rgba() into 0–255 channels. Alpha is ignored:
 *  WCAG contrast is defined for composited colours, and every pairing we assert
 *  is opaque text on an opaque surface. */
function parse(color: string): [number, number, number] {
  const hex = color.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    const h = hex[1]!;
    const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
    return [
      parseInt(full.slice(0, 2), 16),
      parseInt(full.slice(2, 4), 16),
      parseInt(full.slice(4, 6), 16),
    ];
  }
  const rgb = color.trim().match(/^rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/i);
  if (rgb) return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])];
  throw new Error(`Unsupported colour format: ${color}`);
}

/** WCAG 2.x relative luminance. */
function luminance(color: string): number {
  const [r, g, b] = parse(color).map((channel) => {
    const s = channel / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Composites a translucent colour over an opaque backdrop, returning the
 * resulting opaque colour.
 *
 * Needed because several surfaces in this system are translucent overlays —
 * `--field-bg` is `rgba(13,43,78,0.03)` over the theme surface — so text
 * rendered on them sits on a background that is NOT the surface token. Testing
 * a text role against `surface` alone therefore overstates its contrast: the
 * muted role measured 4.51:1 on ivory but 4.27:1 on the composited field
 * background, below AA, which axe caught on /style after the suite had passed.
 */
export function compositeOver(overlay: string, backdrop: string): string {
  const alpha = alphaOf(overlay);
  const fg = parse(overlay);
  const bg = parse(backdrop);
  const mixed = fg.map((channel, i) =>
    Math.round(channel * alpha + bg[i]! * (1 - alpha)),
  ) as [number, number, number];
  return `rgb(${mixed[0]}, ${mixed[1]}, ${mixed[2]})`;
}

/** Alpha channel of an `rgba()` string; 1 for any opaque format. */
function alphaOf(color: string): number {
  const match = color.trim().match(/^rgba\(\s*\d+[,\s]+\d+[,\s]+\d+[,\s/]+([\d.]+)\s*\)$/i);
  return match ? Number(match[1]) : 1;
}

/** WCAG 2.x contrast ratio, in [1, 21]. Symmetric in its arguments. */
export function contrastRatio(fg: string, bg: string): number {
  const a = luminance(fg);
  const b = luminance(bg);
  const [lighter, darker] = a > b ? [a, b] : [b, a];
  return (lighter + 0.05) / (darker + 0.05);
}
