'use client'

import { Project } from "@/data/projects"
import CaseSections from "./sections/CaseSections"
import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { gsap, ScrollTrigger } from "@/lib/gsap"
import Image from "next/image"

function FixedBackground({ imageUrl, heroRef }: { 
  imageUrl: string
  heroRef: React.RefObject<HTMLDivElement | null>
}) {
  const backgroundRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!backgroundRef.current || !heroRef.current) return

    const ctx = gsap.context(() => {
      gsap.to(backgroundRef.current, {
        opacity: 0.03,
        '--blur': 2,
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom 50%',
          scrub: true,
        },
      })
    })

    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 1200)

    return () => {
      clearTimeout(refreshTimer)
      ctx.revert()
    }
  }, [heroRef])

  return createPortal(
    <div
      ref={backgroundRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        opacity: 0.2,
        willChange: 'opacity, filter',
        pointerEvents: 'none',
        filter: 'blur(calc(var(--blur, 0) * 1px))',
        '--blur': 0,
      } as React.CSSProperties}
    >
      <Image
        src={imageUrl}
        alt="case study background"
        fill
        className="object-cover object-center"
        priority
        quality={90}
      />
    </div>,
    document.body   // ← renders outside PageTransition's transform context
  )
}

export default function UICaseStudyScreen({ project }: { project: Project }) {
  const heroRef = useRef<HTMLDivElement | null>(null)

  const backgroundImage = project.image || 
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80'

  return (
    <>
      <FixedBackground imageUrl={backgroundImage} heroRef={heroRef} />

      {/* Hero section — full opacity background visible here */}
      <section
        ref={heroRef}
        className="relative w-full h-screen flex flex-col justify-center px-8 md:px-24"
      >
        <h1 className="text-8xl font-bold uppercase text-white">
          {project.name}
        </h1>
        <div className="h-10" />
        <p className="text-xl text-gray-100 tracking-wider font-thin max-w-2xl">
          {project.description}
        </p>
      </section>

      {/* Content sections — background still visible at 30% behind this */}
      <div className="relative w-full p-8 md:p-24">
        {project.sections?.map((section, idx) => (
          <div key={idx} className="w-full flex flex-col pt-30">
            <CaseSections section={section} />
          </div>
        ))}
      </div>
    </>
  )
}