'use client'
import { getProjectHref, projects, shuffle } from "@/data/projects";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import useHydrated from "@/hooks/useHydrated";

export default function FeatureProjectsList() {

    // A fresh random order every page load, drawn from all categories. Deferred until after
    // hydration so the server HTML and first client render agree (see useHydrated).
    const hydrated = useHydrated()
    const featured = useMemo(() => (hydrated ? shuffle(projects) : projects), [hydrated])

    const sectionRef = useRef<HTMLDivElement | null>(null)
    const previewRef = useRef<HTMLDivElement | null>(null)
    const imageRefs = useRef<(HTMLDivElement | null)[]>([])
    const [activeIndex, setActiveIndex] = useState<number | null>(null)
    const xToRef = useRef<gsap.QuickToFunc | null>(null)
    const yToRef = useRef<gsap.QuickToFunc | null>(null)


    useEffect(() => {
        if (!previewRef.current) return
        gsap.set(previewRef.current, {xPercent: -50, yPercent: -50, opacity: 0, scale: 0.9})
        xToRef.current = gsap.quickTo(previewRef.current, 'x', { duration: 0.5, ease: 'power3.out' })
        yToRef.current = gsap.quickTo(previewRef.current, 'y', { duration: 0.5, ease: 'power3.out' })
    }, [])

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!sectionRef.current || !xToRef.current || !yToRef.current) return
        const rect = sectionRef.current.getBoundingClientRect()
        xToRef.current(e.clientX - rect.left)
        yToRef.current(e.clientY - rect.top)
    }

    const handleRowEnter = (index: number) => {
        setActiveIndex(index)
        if (previewRef.current) {
            gsap.to(previewRef.current, { opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out' })
        }
        imageRefs.current.forEach((el, i) => {
            if (!el) return
            gsap.to(el, { opacity: i === index ? 1 : 0, duration:0.3, ease: 'power2.out' })
        })
    }

    const handleLeave = () => {
        setActiveIndex(null)
        if (previewRef.current) {
            gsap.to(previewRef.current, { opacity: 0, scale: 0.9, duration: 0.3, ease: 'power3.out' })
        }
        imageRefs.current.forEach(el => {
            if (!el) return
            gsap.to(el, { opacity: 0, duration:0.3, scale: 0.9, ease:'power3.out', overwrite: true })
        })
    }

    return (
        <div 
            ref={sectionRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleLeave}
            className="relative w-full py-10px"
        >

            <ul className="border-t border-gray-300">
                {featured.map((project, i) => {
                    const isActive = activeIndex === i
                    // Case study if the project has one, else the live project in a new tab.
                    const { href, external } = getProjectHref(project)
                    return (
                        <li key={project.slug}>
                            <Link
                                href={href}
                                target={external ? '_blank' : undefined}
                                rel={external ? 'noopener noreferrer' : undefined}
                                onMouseEnter={() => handleRowEnter(i)}
                                className="grid grid-cols-[1fr_auto] md:grid-cols-[2fr_3fr_auto] items-center gap-6 py-5 border-b border-gray-300 hover:border-gray-500"
                            >
                                <h3
                                    className={`text-black text-xl font-medium transition-colors duration-300
                                        ${isActive ? 'md:text-black' : 'md:text-black/25'}
                                        `}
                                >
                                    {project.name}
                                </h3>

                                <div className="hidden md:flex flex-wrap items-center justify-start gap-3">
                                    {project.tags.map(tag => (
                                        <span
                                            key={tag}
                                            className={`rounded-full border px-2 py-1 text-[10px] font-semibold tracking-widest transition-colors duration-300 ${
                                                isActive ? 'border-black/60 text-black' : 'border-black/15 text-black/30'
                                            }`}
                                        >{tag}</span>
                                    ))}
                                </div>

                            
                                <span
                                    className={`text-black text-2xl transition-colors duration-300 ${
                                    isActive ? 'md:text-black' : 'md:text-black/25'
                                    }`}
                                    aria-hidden
                                >
                                    ↪
                                </span>
                            </Link>
                        </li>
                    )
                })}
            </ul>

            <div 
                ref={previewRef}
                style={{ willChange: 'transform' }}
                className="pointer-events-none absolute top-0 left-0 z-20 h-[320px] w-[260px] overflow-hidden"
            >
                {featured.map((project, i) => {
                    const imageSrc = project.image || project.images?.[0]
                    return (
                        <div 
                        key={project.slug}
                        ref={el => {imageRefs.current[i] = el}}
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
                    )
                })}
            </div>
        </div>
    )
}