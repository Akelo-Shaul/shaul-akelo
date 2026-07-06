import { Project, SoftwareSubCategory } from "@/data/projects"
import { gsap } from "@/lib/gsap"
import { useEffect, useRef } from "react"
import { FiSmartphone, FiGlobe, FiMonitor, FiCpu } from "react-icons/fi"
import Button from "../../ui/Button"
import { IconType } from "react-icons"


const subCategoryIconMap: Record<SoftwareSubCategory, IconType> = {
    'mobile' : FiSmartphone,
    'web' : FiGlobe,
    'desktop' : FiMonitor,
    'iot' : FiCpu
}

export default function SWProjectCard({ project }: {project: Project}) {
    const cardRef = useRef<HTMLDivElement>(null)
    const bgRef = useRef<HTMLDivElement>(null)
    const hoverTl = useRef<gsap.core.Timeline>(null)

    const Icon = project.subCategory ? subCategoryIconMap[project.subCategory] : undefined

    useEffect(() => {
        if (!cardRef.current || !bgRef.current) return

        hoverTl.current = gsap
            .timeline({ paused: true })
            .to(cardRef.current, {
                scale: 1.03,
                duration: 0.35,
                ease: 'power3.out',
            })
            .to(bgRef.current, {
                opacity: 0.18,
                x: 0,
                duration: 0.35,
                ease: 'power3.out'
            }, 0)

            return () => {
                hoverTl.current?.kill()
            }
    }, [])

    return(
        <div 
            ref={cardRef}
            className = "relative overflow-hidden transition-shadow"
            onMouseEnter={() => hoverTl.current?.play()}
            onMouseLeave={() => hoverTl.current?.reverse()}
        >
            <div 
                ref={bgRef}
                className="pointer-events-none absolute right-0 top-1/2 h-40 w-[50%] -translate-y-1/2 bg-cover bg-center opacity-0"
                style={{ 
                    backgroundImage: `url(${project.image || project.images?.[0]})`,
                    WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,1))",
                    maskImage: "linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,1))",
                    WebkitMaskRepeat: "no-repeat",
                    maskRepeat: "no-repeat",
                    WebkitMaskSize: "100% 100%",
                    maskSize: "100% 100%",
                }}
            >
            </div>
            
            <div className="flex w-full flex-col md:flex-row gap-8 md:justify-between items-start py-4">
                {/* icon and title section */}
                <div className="flex flex-col md:flex-row items-start gap-4">
                    {Icon ? (
                        <div className="flex h-12 w-12 items-center justify-center text-white">
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
                <div className="m-3">
                    <Button label="Source Code"/>
                </div>

            </div>

            <div className="h-px mb-6 bg-white"></div>
        </div>
        
    )
}