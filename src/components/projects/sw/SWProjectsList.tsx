import { Project } from "@/data/projects";
import ProjectCard from "./SWProjectCard";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";


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