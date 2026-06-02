'use client'

import FeatureProjects from "@/components/projects/FeatureProjects";
import FilterSection from "@/components/projects/FilterSection";
import ProjectsList from "@/components/projects/SWProjectsList";
import ProjectsTabbar from "@/components/projects/ProjectsTabbar";
import { useState } from "react";
import { animationProjects, uiuxProjects, softwareProjects } from "@/data/projects";
import SWProjectsList from "@/components/projects/SWProjectsList";
import UIUXProjectsList from "@/components/projects/UIUXProjectsList";
import AnimationProjectsList from "@/components/projects/AnimationProjectsList";

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
            <FeatureProjects />
            <ProjectsTabbar selectedTab={selectedTab} onChangeTab={setSelectedTab} />
            <FilterSection />
            {listComponents[selectedTab]}
        </div>
    )
}