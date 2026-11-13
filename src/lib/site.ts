export const site = {
  name: "AI Engine",
  description:
    "The best AI engineering writing, picked by a person and summarised in a few lines. Read the gist here, then go to the original post.",
};

/** The public address from `SITE_URL`, scheme included and without a trailing slash; null when unset. */
export function siteUrl(): string | null {
  const value = process.env.SITE_URL?.trim().replace(/\/+$/, "");
  return value ? value : null;
}
