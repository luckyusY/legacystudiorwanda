/**
 * Cloudinary URL helpers for the portfolio. Inserts on-the-fly transforms after
 * `/upload/` so we serve right-sized, auto-format (AVIF/WebP), auto-quality images.
 */

function insert(url: string, transform: string): string {
  if (!url.includes("/upload/")) return url;
  return url.replace("/upload/", `/upload/${transform}/`);
}

/** Scale to a target width, preserve aspect ratio. */
export function cldFit(url: string, w: number): string {
  return insert(url, `f_auto,q_auto,w_${w},c_limit`);
}

/** Content-aware crop to an exact box (for art-directed / full-bleed slots). */
export function cldCrop(url: string, w: number, h: number): string {
  return insert(url, `f_auto,q_auto,c_fill,g_auto,w_${w},h_${h}`);
}

const FIT_WIDTHS = [384, 540, 768, 1080, 1440, 2000];

/** Responsive srcset (scaled, no crop). */
export function fitSrcSet(url: string): string {
  return FIT_WIDTHS.map((w) => `${cldFit(url, w)} ${w}w`).join(", ");
}

/** Responsive srcset for a fixed aspect ratio (cropped). */
export function cropSrcSet(url: string, ratio: number): string {
  return FIT_WIDTHS.map((w) => `${cldCrop(url, w, Math.round(w / ratio))} ${w}w`).join(", ");
}

/** Tiny blurred placeholder for progressive loading. */
export function cldBlur(url: string): string {
  return insert(url, "f_auto,q_auto,w_40,e_blur:600");
}
