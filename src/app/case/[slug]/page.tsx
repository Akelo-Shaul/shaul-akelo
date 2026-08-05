import type { Metadata } from "next"
import { caseStudyProjects } from "@/data/projects"
import { notFound } from "next/navigation"
import UICaseStudyScreen from "@/components/projects/uiux/case-study/UICaseStudyScreen"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return caseStudyProjects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = caseStudyProjects.find((p) => p.slug === slug)

  // An unknown slug falls through to notFound() in the component below. Returning bare metadata
  // keeps the 404 out of the index rather than letting it inherit the site-wide title.
  if (!project) {
    return { title: 'Case study not found', robots: { index: false, follow: false } }
  }

  // Category-derived so each case study reads as its own thing rather than every page claiming to
  // be a UI/UX one: "Pizza App UI/UX Case Study", "MazeMob Software Case Study",
  // "Room 3D Animation Case Study".
  const title = `${project.name} ${project.category} Case Study`

  return {
    title,
    description: project.description,
    // No `keywords` here on purpose: Google Search ignores the keywords meta tag outright
    // (https://developers.google.com/search/docs/fundamentals/seo-starter-guide). The tags are
    // still rendered as visible text on the card and case page, which is what actually counts.
    alternates: {
      canonical: `/case/${project.slug}`,
    },
    openGraph: {
      type: 'article',
      url: `/case/${project.slug}`,
      title,
      description: project.description,
      // Falls back to the app-level opengraph-image when a project has no artwork of its own.
      images: project.image ? [{ url: project.image, alt: `${project.name} case study` }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: project.description,
      images: project.image ? [project.image] : undefined,
    },
  }
}

export default async function CasePage({ params }: Props) {
  const { slug } = await params
  const project = caseStudyProjects.find((p) => p.slug === slug)
  if (!project) notFound()

  return (
    <div className="w-full flex flex-col bg-transparent">
      <UICaseStudyScreen project={project} />
    </div>
  )
}