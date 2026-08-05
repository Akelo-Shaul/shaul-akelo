'use client'

import FeatureProjects from "@/components/projects/FeatureProjects";
import FilterSection from "@/components/projects/FilterSection";
import ProjectsList from "@/components/projects/sw/SWProjectsList";
import ProjectsTabbar from "@/components/projects/ProjectsTabbar";
import { useState } from "react";
import { animationProjects, uiuxProjects, softwareProjects } from "@/data/projects";
import SWProjectsList from "@/components/projects/sw/SWProjectsList";
import UIUXProjectsList from "@/components/projects/uiux/UIUXProjectsList";
import AnimationProjectsList from "@/components/projects/3d&anim/3dfiles/AnimationProjectsList";

type ProjectTab = "software" | "uiux" | "animation"

export default function Projects() {

    const [selectedTab, setSelectedTab] = useState<ProjectTab>('software')

    const visibleProjects = 
        selectedTab === 'software'
            ? softwareProjects
            : selectedTab === "uiux"
            ? uiuxProjects
            : animationProjects

    const listComponents = {
        software: <SWProjectsList projects={softwareProjects} />,
        uiux: <UIUXProjectsList projects={uiuxProjects} />,
        animation: <AnimationProjectsList projects={animationProjects} />
    }

    return (
        <div className="w-full flex flex-col relative bg-gray-700">
            {/* This page's visible header is a rotating featured-project carousel, so there is no
                fixed headline to mark up. A screen-reader-only h1 gives the page a stable topic for
                assistive tech and for search engines, without altering the design. It states what
                the page actually contains — not hidden keyword text. */}
            <h1 className="sr-only">Projects — software, UI/UX design, and 3D animation work by Shaul Akelo</h1>
            <FeatureProjects />
            <ProjectsTabbar selectedTab={selectedTab} onChangeTab={setSelectedTab} />
            <FilterSection />
            {listComponents[selectedTab]}
        </div>
    )
}