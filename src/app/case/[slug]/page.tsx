import { uiuxProjects } from "@/data/projects"
import { notFound } from "next/navigation"
import UICaseStudyScreen from "@/components/projects/uiux/case-study/UICaseStudyScreen"

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
    return uiuxProjects.map((p) => ({ slug: p.slug }))
}

export default async function CasePage({ params }: Props) {
    const { slug } = await params
    const project = uiuxProjects.find((p) => p.slug === slug)
    if (!project) notFound()

    return (
        <div className="w-full flex flex-col relative">
            <UICaseStudyScreen project={project} />
        </div>
    )
}
