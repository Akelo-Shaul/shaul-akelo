'use client'

import { Project, getProjectLink } from "@/data/projects"
import CaseSections from "./sections/CaseSections"
import { useEffect, useRef } from "react"
import { gsap, ScrollTrigger } from "@/lib/gsap"
import Image from "next/image"
import Link from "next/link"
import Button from "@/components/ui/Button"
import { useLoader } from "@/components/layout/LoaderContext"

export default function UICaseStudyScreen({ project }: { project: Project }) {
  const backgroundRef = useRef<HTMLDivElement | null>(null)
  const heroRef = useRef<HTMLDivElement | null>(null)
  const { transitioning } = useLoader()
  // True once we've actually seen a transition run. This distinguishes the settled
  // `transitioning === false` (safe to measure) from the stale `false` that's present
  // at mount during a client-side navigation, before PageTransition flips it to true.
  const transitionSeen = useRef(false)

  const backgroundImage = project.image ||
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80'

  const projectLink = getProjectLink(project)

  useEffect(() => {
    // While a transition is running, mark it seen and do nothing. The page is inside
    // PageTransition's position:fixed + transformed overlay right now, so any ScrollTrigger
    // built here would measure the hero at the wrong position and the scrubbed fade would
    // sit at its end state — which is the "animation plays on its own" bug on navigation.
    if (transitioning) {
      transitionSeen.current = true
      return
    }
    // Ignore the stale `false` that exists at mount before the transition has started.
    if (!transitionSeen.current) return
    if (!backgroundRef.current || !heroRef.current) return

    let ctx: ReturnType<typeof gsap.context> | undefined
    let frame2 = 0

    // Two frames so the browser has applied position:relative and laid the hero out
    // before ScrollTrigger measures it. Measuring against the settled layout keeps the
    // scrubbed fade at scroll 0 (full opacity) until the user actually scrolls.
    const frame1 = requestAnimationFrame(() => {
      frame2 = requestAnimationFrame(() => {
        ctx = gsap.context(() => {
          gsap.to(backgroundRef.current, {
            opacity: 0.1,
            ease: "none",
            scrollTrigger: {
              trigger: heroRef.current,
              // Hero starts at the top of the page, so 'top top' = scroll 0 (no fade yet),
              // and 'bottom top' = hero fully scrolled past. Using 'top bottom' here made the
              // trigger already active on load, so the fade ran without scrolling.
              start: 'bottom 80%',
              end: 'bottom 30%',
              scrub: 1,
            },
          })
        })
        ScrollTrigger.refresh()
      })
    })

    return () => {
      cancelAnimationFrame(frame1)
      cancelAnimationFrame(frame2)
      ctx?.revert()
    }
  }, [transitioning])

  return (
    <div className="relative w-full bg-black">

      {/* Sticky background — stays in place while content scrolls over it */}
      <div className="sticky top-0 w-full h-screen -mb-screen z-0 pointer-events-none"
        style={{ marginBottom: '-100vh' }}  // pulls content up to overlap
      >
        <div
          ref={backgroundRef}
          className="absolute inset-0 w-full h-full"
          style={{ opacity: 0.4, willChange: 'opacity' }}
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
          {/* Breadcrumb: HOME navigates, the current page is bold + underlined and carries
              aria-current so it's announced as the current location too. */}
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-row items-center gap-6">
              <li>
                <Link
                  href="/"
                  className="font-light text-white/70 transition-colors hover:text-white"
                >
                  HOME
                </Link>
              </li>
              <li>
                <span
                  aria-current="page"
                  className="font-bold uppercase text-white underline underline-offset-4"
                >
                  {project.name}
                </span>
              </li>
            </ol>
          </nav>
          <h1 className="text-9xl font-bold uppercase text-white">
            {project.name}
          </h1>
          <p className="text-xl text-gray-100 tracking-wider font-thin max-w-2xl">
            {project.description}
          </p>

          {projectLink && (
            <div>
              <Button label="See Project" href={projectLink} external />
            </div>
          )}
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