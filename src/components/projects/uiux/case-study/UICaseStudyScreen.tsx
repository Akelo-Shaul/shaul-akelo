'use client'

import { Project } from "@/data/projects"
import CaseSections from "./sections/CaseSections"
import { useEffect, useRef } from "react"
import { gsap, ScrollTrigger } from "@/lib/gsap"
import Image from "next/image"

export default function UICaseStudyScreen({ project }: { project: Project }) {
  const backgroundRef = useRef<HTMLDivElement | null>(null)
  const heroRef = useRef<HTMLDivElement | null>(null)

  const backgroundImage = project.image ||
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80'

  useEffect(() => {
    if (!backgroundRef.current || !heroRef.current) return

    const ctx = gsap.context(() => {
      gsap.to(backgroundRef.current, {
        opacity: 0.05,                
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top bottom',
          end: 'top 30%',
          markers: true,
          scrub: 1,
        },
      })
    })

    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 2000)

    return () => {
      clearTimeout(refreshTimer)
      ctx.revert()
    }
  }, [])

  return (
    <div className="relative w-full bg-black">

      {/* Sticky background — stays in place while content scrolls over it */}
      <div className="sticky top-0 w-full h-screen -mb-screen z-0 pointer-events-none"
        style={{ marginBottom: '-100vh' }}  // pulls content up to overlap
      >
        <div
          ref={backgroundRef}
          className="absolute inset-0 w-full h-full"
          style={{ opacity: 0.5, willChange: 'opacity' }}
        >
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

      {/* All content sits above the sticky background */}
      <div className="relative z-10">

        {/* Hero */}
        <section
          ref={heroRef}
          className="w-full h-screen flex flex-col justify-center gap-10 px-8 md:px-26"
        >
          <div className="flex flex-row gap-6">
            <h4>HOME</h4>
            <h4 className="uppercase">{project.name}</h4>
          </div>
          <h1 className="text-9xl font-bold uppercase text-white">
            {project.name}
          </h1>
          <p className="text-xl text-gray-100 tracking-wider font-thin max-w-2xl">
            {project.description}
          </p>
        </section>

        {/* Content sections */}
        <div className="relative w-full p-8 md:px-24">
          {project.sections?.map((section, idx) => (
            <div key={idx} className="w-full flex flex-col pt-30">
              <CaseSections section={section} />
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}