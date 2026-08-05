import type { MetadataRoute } from 'next'
import { caseStudyProjects } from '@/data/projects'
import { SITE_URL } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  // One timestamp for the whole build. `lastModified` is only a hint to crawlers, and a per-request
  // `new Date()` would make every URL look freshly edited on every fetch — which trains Google to
  // ignore the field entirely.
  const lastModified = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE_URL}/projects`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/about`, lastModified, changeFrequency: 'yearly', priority: 0.7 },
    { url: `${SITE_URL}/contact`, lastModified, changeFrequency: 'yearly', priority: 0.7 },
  ]

  // Derived from the same array that drives `generateStaticParams` in case/[slug]/page.tsx, so
  // commenting a project back in adds its case study here automatically.
  const caseRoutes: MetadataRoute.Sitemap = caseStudyProjects.map((project) => ({
    url: `${SITE_URL}/case/${project.slug}`,
    lastModified,
    changeFrequency: 'yearly',
    priority: 0.8,
  }))

  return [...staticRoutes, ...caseRoutes]
}
