/** Next.js static imports may be a URL string or `{ src, width, height }`. */
export function assetUrl(asset) {
  if (!asset) return "";
  if (typeof asset === "string") return asset;
  if (typeof asset.src === "string") return asset.src;
  return "";
}
