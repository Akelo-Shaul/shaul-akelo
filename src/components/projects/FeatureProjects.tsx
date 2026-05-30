'use client'
import { featureProjects } from "@/data/projects";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from '@/lib/gsap'

export default function FeatureProjects() {

    const [currentIndex, setCurrentIndex] = useState(0)
    const project = featureProjects[currentIndex]
    const total = featureProjects.length
    const INTERVAL_DURATION = 3000 //3 seconds
    const imageSrc = project.image || project.images?.[0]

    const pad = (n:number) => n.toString().padStart(2,'0')


    // Auto-advance projects
    useEffect(() => {
        const timer = window.setInterval(() => {
            setCurrentIndex(prev =>
            prev === featureProjects.length - 1 ? 0 : prev + 1
            )
        }, INTERVAL_DURATION)

        return () => window.clearInterval(timer)
    }, [currentIndex]) // Empty dependency - only run once

    useEffect(() => {
        const target = '.progress-fill'
        gsap.set(target, { width: '0%' })
        const anim = gsap.to(target, {
            width: '100%',
            duration: 3,
            ease: 'power1.inOut'
        })

        return () => {
            anim.kill()
        }

    }, [currentIndex])



    const handlePrev = () => {
        setCurrentIndex(i => (i === 0 ? featureProjects.length -1 : i - 1))
    }

    const handleNext = () => {
        setCurrentIndex(i => (i === featureProjects.length - 1 ? 0 : i + 1))
    }

    return (
        <section className="relative w-full h-[70vh] flex items-end p-8">
            <div className="absolute inset-0 overflow-hidden opacity-50">
                <div
                    key={project.slug}
                    className="absolute inset-0 opacity-0"
                >
                    {imageSrc ? (
                    <Image
                        src={imageSrc}
                        alt={project.name}
                        fill
                        sizes="260px"
                        className="object-cover"
                    />
                    ) : null}
                </div>
            </div>

            <div className="relative flex flex-col gap-4 z-10 w-full">
                <div className="flex justify-between items-end">
                    <p className="text-4xl md:text-5xl md:font-medium max-w-xs md:max-w-xl leading-tighter">{project.name}</p>
                    <div className="hidden md:flex gap-2 ml-auto bg-white">
                        <button 
                            type="button"
                            aria-label="Previous Testimonial"
                            onClick={handlePrev}
                            className="flex h-10 w-10 items-center justify-center border border-black/30 text-black hover:bg-black hover:text-white transition-colors"
                        >
                            <span aria-hidden>←</span>
                        </button>
                        <button 
                            type="button"
                            aria-label="Next Testimonial"
                            onClick={handleNext}
                            className="flex h-10 w-10 items-center justify-center border border-black/30 text-black hover:bg-black hover:text-white transition-colors"
                        >
                            <span aria-hidden>
                                →
                            </span>
                        </button>
                    </div> 
                </div>

                <div className="mt-8 w-full h-1 bg-gray/300">
                    <div 
                        className="progress-fill h-full bg-white origin-left" 
                        />
                        
                </div>

                <div className="flex justify-between items-end">
                    <p className="text-xl md:font-medium  max-w-xs leading-tighter">{project.category}</p>
                    <span className="text-sm text-grey/50 tracking-widest">
                        {pad(currentIndex + 1)}/{pad(total)}
                    </span>
                </div>
            </div>
        </section>
    )
}