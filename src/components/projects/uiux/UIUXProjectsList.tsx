import { Project } from "@/data/projects";
import UIUXProjectCard from "./UIUXProjectCard";

interface UIUXProjectsListProps {
    projects: Project[]
}

export default function UIUXProjectsList({ projects }: UIUXProjectsListProps) {
    return (
        <section className="p-8">
            {projects.map((project, index) =>
                <UIUXProjectCard key={project.slug} project={project} index={index} />
            )}
        </section>
    )
} 