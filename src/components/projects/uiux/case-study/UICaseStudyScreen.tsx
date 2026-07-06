'use client'

import { Project } from "@/data/projects"
import CaseSections from "./sections/CaseSections"
import { useEffect, useRef } from "react"
import { gsap, ScrollTrigger } from "@/lib/gsap"
import Image from "next/image"

export default function UICaseStudyScreen({ project }: { project: Project }) {
    const backgroundRef = useRef<HTMLDivElement | null>(null)
    const heroRef = useRef<HTMLDivElement | null>(null)
    const nextSectionRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (!backgroundRef.current || !heroRef.current || !nextSectionRef.current) return

        const ctx = gsap.context(() => {
            // Fade background opacity from 1 to 0.3 as user scrolls from hero to next section
            gsap.to(backgroundRef.current, {
                opacity: 0.3,
                ease: 'none',
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: 'top top',
                    end: `${nextSectionRef.current?.offsetHeight || 600}px top`,
                    scrub: true,
                },
            })
        })

        const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 1800)

        return () => {
            clearTimeout(refreshTimer)
            ctx.revert()
        }
    }, [])

    const backgroundImage = project.image || 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80'

    return (
        <>
            {/* Fixed background image container */}
            <div 
                ref={backgroundRef}
                className="fixed top-0 left-0 w-screen h-screen -z-20 pointer-events-none overflow-hidden"
                style={{
                    opacity: 1,
                    willChange: 'opacity',
                }}
            >
                <div className="absolute inset-0 w-full h-full">
                    <Image
                        src={backgroundImage}
                        alt="case study background"
                        fill
                        className="object-cover object-center"
                        priority
                        quality={90}
                    />
                </div>
            </div>

            {/* Hero section - background at full opacity */}
            <section ref={heroRef} className="relative z-0 w-full h-screen flex flex-col justify-center px-8 md:px-24">
                <h1 className="text-8xl font-bold uppercase text-white">{project.name}</h1>
                <div className="h-10"></div>
                <p className="text-xl text-gray-100 tracking-wider font-thin max-w-2xl">{project.description}</p>
            </section>

            {/* Content sections - background fades during this section and beyond */}
            <div ref={nextSectionRef} className="relative z-0 bg-black/80 p-24">
                {project.sections?.map((section, idx) => (
                    <div key={idx} className="w-full flex flex-col pt-30">
                        <CaseSections section={section} />
                    </div>
                ))}
            </div>
        </>
    )
}

