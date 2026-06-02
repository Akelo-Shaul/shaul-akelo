import { Project } from "@/data/projects";

interface AnimationProjectsListProps {
    projects: Project[]
}

export default function AnimationProjectsList({ projects }: AnimationProjectsListProps) {
    return (
        <div>
            Animation Projects
        </div>
    )
}