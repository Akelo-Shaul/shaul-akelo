import { Project } from "@/data/projects";
import ProjectCard from "./SWProjectCard";


interface SWProjectsListProps {
    projects: Project[]
}

export default function SWProjectsList({ projects }: SWProjectsListProps) {
    return (
        <section className="p-8">
            {projects.map((project) =>
                <ProjectCard key={project.slug} project={project} />
            )}
        </section>
    )
}