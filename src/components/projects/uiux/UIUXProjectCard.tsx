'use client'

import { Project } from "@/data/projects";
import Image from "next/image";
import Button from "../../ui/Button";

export default function UIUXProjectCard({ project, index }: { project: Project; index: number }) {
    const reverse = index % 2 === 1
    const imageSrc = project.image ?? project.images?.[0]

    return (
        <div 
            className={`flex w-full flex-col md:flex-row md:px-20 gap-8 md:justify-between items-center py-4
                ${reverse ? 'md:flex-row-reverse' : ''}
                `}
        >
            {/* Rendered only when the project actually has artwork. This used to fall back to
                /projects/ashmead.jpg, a placeholder that no longer exists. */}
            {imageSrc && (
                <div className="w-[60%]">
                    <Image src={imageSrc} alt={project.name} className="w-full h-auto" width={800} height={300} />
                </div>
            )}
            <div className="w-full md:w-[40%] flex flex-col gap-4 max-w-4xl">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-center text-sm font-light text-gray-400">
                        {project.tags.map((tag, index) => (
                            <span key={tag} className="inline-flex items-center">
                                {tag}
                                {index < project.tags.length - 1 && (
                                    <span className="mx-2">/</span>
                                )}
                            </span>
                        ))}
                    </div>
                    <h3 className="font-bold leading-tight tracking-tight uppercase text-3xl">
                        {project.name} 
                    </h3>
                    <p className="max-w-3xl text-lg">{project.description}</p>
                </div>
                <Button label="View Case" href={`/case/${project.slug}`} />
            </div>
        </div>
    )
}