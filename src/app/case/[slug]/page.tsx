import type { Metadata } from "next"
import { uiuxProjects } from "@/data/projects"
import { notFound } from "next/navigation"
import UICaseStudyScreen from "@/components/projects/uiux/case-study/UICaseStudyScreen"
import { SITE_URL } from "@/lib/site"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return uiuxProjects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = uiuxProjects.find((p) => p.slug === slug)

  // An unknown slug falls through to notFound() in the component below. Returning bare metadata
  // keeps the 404 out of the index rather than letting it inherit the site-wide title.
  if (!project) {
    return { title: 'Case study not found', robots: { index: false, follow: false } }
  }

  return {
    title: `${project.name} UI/UX Case Study`,
    description: project.description,
    keywords: project.tags,
    alternates: {
      canonical: `/case/${project.slug}`,
    },
    openGraph: {
      type: 'article',
      url: `/case/${project.slug}`,
      title: `${project.name} UI/UX Case Study`,
      description: project.description,
      // Falls back to the app-level opengraph-image when a project has no artwork of its own.
      images: project.image ? [{ url: project.image, alt: `${project.name} case study` }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.name} UI/UX Case Study`,
      description: project.description,
      images: project.image ? [project.image] : undefined,
    },
  }
}

export default async function CasePage({ params }: Props) {
  const { slug } = await params
  const project = uiuxProjects.find((p) => p.slug === slug)
  if (!project) notFound()

  return (
    <div className="w-full flex flex-col bg-transparent">
      <UICaseStudyScreen project={project} />
    </div>
  )
}