'use client'
import { projects, shuffle } from "@/data/projects";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from '@/lib/gsap'
import useHydrated from "@/hooks/useHydrated";

export default function FeatureProjects() {

    const [currentIndex, setCurrentIndex] = useState(0)
    const progressRef = useRef<HTMLDivElement>(null)

    // A fresh random order every page load, drawn from all categories. Held off until after
    // hydration so the server HTML and first client render agree (see useHydrated).
    const hydrated = useHydrated()
    const featured = useMemo(() => (hydrated ? shuffle(projects) : projects), [hydrated])

    const total = featured.length
    // Guard the index: `featured` can change length after hydration, and the pool itself shrinks
    // whenever projects are commented out of the data file.
    const project = featured[currentIndex % Math.max(total, 1)]
    const INTERVAL_DURATION = 3000 //3 seconds
    const imageSrc = project?.image || project?.images?.[0]

    const pad = (n:number) => n.toString().padStart(2,'0')


    // Auto-advance projects
    useEffect(() => {
        const timer = window.setInterval(() => {
            setCurrentIndex(prev =>
            prev === total - 1 ? 0 : prev + 1
            )
        }, INTERVAL_DURATION)

        return () => window.clearInterval(timer)
    }, [currentIndex, total]) // `total` changes when the shuffled pool lands after hydration

    // Animate scaleX, not width. `width` is a layout property, so tweening it forced a reflow on
    // every frame for the full 3s, on a permanent loop; scaleX is compositor-only. Targeting the
    // ref instead of the '.progress-fill' selector also drops a DOM query per cycle.
    useEffect(() => {
        const el = progressRef.current
        if (!el) return

        gsap.set(el, { scaleX: 0 })
        const anim = gsap.to(el, {
            scaleX: 1,
            duration: 3,
            ease: 'power1.inOut'
        })

        return () => {
            anim.kill()
        }

    }, [currentIndex])



    const handlePrev = () => {
        setCurrentIndex(i => (i === 0 ? total -1 : i - 1))
    }

    const handleNext = () => {
        setCurrentIndex(i => (i === total - 1 ? 0 : i + 1))
    }

    // Nothing to feature (every project commented out of the data file) — render nothing rather
    // than an empty 70vh band.
    if (!project) return null

    return (
        <section className="relative w-full h-[70vh] flex items-end p-8">
            <div className="absolute inset-0 overflow-hidden opacity-50">
                <div
                    key={project.slug}
                    className="absolute inset-0 opacity-100"
                >
                    {imageSrc ? (
                    <Image
                        src={imageSrc}
                        alt={project.name}
                        fill
                        // Full-bleed banner: it spans the whole viewport width, so the browser
                        // must pick a source that wide. (This said 260px — the width of the
                        // *home page* hover preview — which is why the banner looked soft.)
                        sizes="100vw"
                        quality={90}
                        className="object-cover"
                    />
                    ) : null}
                </div>
            </div>

            <div className="relative flex flex-col gap-4 z-10 w-full">
                <div className="flex justify-between items-end">
                    <p className="text-4xl md:text-5xl md:font-medium max-w-xs md:max-w-xl leading-tighter">{project.name}</p>
                    {/* No background on the wrapper — otherwise the gap between the two buttons
                        paints white too. Each button carries its own fill instead, so only the
                        insides are white and the space between them stays transparent. */}
                    <div className="hidden md:flex gap-2 ml-auto">
                        <button
                            type="button"
                            aria-label="Previous project"
                            onClick={handlePrev}
                            className="flex h-10 w-10 items-center justify-center border border-black/30 bg-white text-black hover:bg-black hover:text-white transition-colors"
                        >
                            <span aria-hidden>←</span>
                        </button>
                        <button
                            type="button"
                            aria-label="Next project"
                            onClick={handleNext}
                            className="flex h-10 w-10 items-center justify-center border border-black/30 bg-white text-black hover:bg-black hover:text-white transition-colors"
                        >
                            <span aria-hidden>
                                →
                            </span>
                        </button>
                    </div> 
                </div>

                <div className="mt-8 w-full h-1 bg-gray/300">
                    {/* w-full because scaleX scales a full-width bar down to 0, rather than
                        growing a zero-width one. origin-left keeps it anchored on the left. */}
                    <div
                        ref={progressRef}
                        className="progress-fill h-full w-full bg-white origin-left"
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