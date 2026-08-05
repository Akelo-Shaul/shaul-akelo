/**
 * Canonical origin for the deployed site, with no trailing slash.
 *
 * Every absolute URL Google sees — canonicals, OG tags, sitemap entries, JSON-LD — is built from
 * this one value, so there is a single place to change it if the domain ever moves. It is a plain
 * constant rather than an env var on purpose: the canonical host must be identical in every
 * environment, otherwise preview deploys would emit canonicals pointing at themselves and compete
 * with production in the index.
 */
export const SITE_URL = 'https://shaulakelo.com'

export const SITE_NAME = 'Shaul Akelo'

/** Used as the OG/Twitter description wherever a page doesn't set something more specific. */
export const SITE_DESCRIPTION =
  'Shaul Akelo builds websites, 3D environments, and animations that make brands and products impossible to ignore.'
