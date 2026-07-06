import dynamic from 'next/dynamic'
import type { Project } from "@/data/projects"

const RoomScene = dynamic(() => import('./Room/RoomScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] bg-black flex items-center justify-center text-white">
      Loading...
    </div>
  ),
})

interface AnimationProjectsListProps {
  projects: Project[]
}

export default function AnimationProjectsList({ projects }: AnimationProjectsListProps) {
  return (
    <section className="grid gap-6 grid-cols-1 lg:grid-cols-3 p-8">
      <div className="lg:col-span-3 xl:col-span-1">
        <div className="h-[400px] rounded-3xl overflow-hidden bg-slate-950 border border-white/10">
          <RoomScene />
        </div>
      </div>

      {projects.map((project) => (
        <article
          key={project.slug}
          className="rounded-3xl border border-white/10 bg-slate-900 p-5"
        >
          <h3 className="text-xl font-semibold">{project.name}</h3>
          <p className="mt-3 text-sm text-gray-300">{project.description}</p>
        </article>
      ))}
    </section>
  )
}