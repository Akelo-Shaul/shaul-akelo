import { Project, SoftwareSubCategory } from "@/data/projects"
import { FiSmartphone, FiGlobe, FiMonitor, FiCpu } from "react-icons/fi"
import Button from "../ui/Button"
import { IconType } from "react-icons"


const subCategoryIconMap: Record<SoftwareSubCategory, IconType> = {
    'mobile' : FiSmartphone,
    'web' : FiGlobe,
    'desktop' : FiMonitor,
    'iot' : FiCpu
}

export default function SWProjectCard({ project }: {project: Project}) {

    const Icon = project.subCategory ? subCategoryIconMap[project.subCategory] : undefined

    return(
        <>
            <div className="flex w-full flex-col md:flex-row gap-8 md:justify-between items-start py-4">
                {/* icon and title section */}
                <div className="flex flex-col md:flex-row items-start gap-4">
                    {Icon ? (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white">
                            <Icon className="h-6 w-6" />
                        </div>
                    ) : (
                        <div className="p-2">
                            <img src="/file.svg" alt="project icon" width={24} height={24}/>
                        </div>
                    )}

                    {/* <div className="p-2">
                        <img src="/file.svg" alt="project icon" width={24} height={24}/>
                    </div> */}
                    <div className="flex flex-col gap-4 max-w-4xl">
                        <div className="flex flex-col">
                            <h3 className="font-bold leading-tight tracking-tight text-3xl md:text-4xl">
                                {project.name} 
                                <span className="font-light text-2xl"> {project.category}</span>
                            </h3>
                            <p className="max-w-3xl text-lg">{project.description}</p>
                        </div>
                        <p className="text-sm">{project.description}</p>
                    </div>
                </div>
                 

                {/* buttons section */}
                <div className="">
                    <Button label="Source Code"/>
                </div>

            </div>

            <div className="h-px mb-6 bg-white"></div>
        </>
        
    )
}