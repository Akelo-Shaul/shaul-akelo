'use client'
  import Image from "next/image"
  import Link from "next/link"
  import { usePathname } from "next/navigation"
  import { useLenis } from "lenis/react"
  import { useEffect, useRef } from "react"
  import { gsap, ScrollTrigger } from "@/lib/gsap"
  import { getFooterImage } from "@/data/navigation"

  const socials = [
    { label: "Instagram", href: "" },
    { label: "YouTube",   href: "" },
    { label: "LinkedIn",  href: "" },
    { label: "X",         href: "" },
  ]

  const legal = [
    { label: "Privacy policy",     href: "" },
    { label: "Terms & conditions", href: "" },
  ]

  export default function Footer() {
    const pathname = usePathname()
    const lenis = useLenis()
    const image = getFooterImage(pathname)

    const sectionRef = useRef<HTMLElement | null>(null)
    const imageRef = useRef<HTMLDivElement | null>(null)

    // Subtle parallax + fade on the background image, matching Hero / UICaseStudyScreen.
    useEffect(() => {
      if (!imageRef.current) return
      const ctx = gsap.context(() => {
        gsap.fromTo(
          imageRef.current,
          { yPercent: -12, opacity: 0.6 },
          {
            yPercent: 0,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom bottom",
              scrub: true,
            },
          }
        )
      }, sectionRef)

      const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 1800)
      return () => {
        clearTimeout(refreshTimer)
        ctx.revert()
      }
      // re-run when the route (and thus the image) changes
    }, [pathname])

    return (
      <footer
        ref={sectionRef}
        className="relative w-full min-h-[70vh] flex flex-col justify-end overflow-hidden text-white"
      >
        {/* Per-page background image */}
        <div ref={imageRef} className="absolute inset-0 scale-110">
          <Image
            key={image}
            src={image}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        {/* Legibility overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Scroll-to-top arrow */}
        <button
          type="button"
          aria-label="Back to top"
          onClick={() => lenis?.scrollTo(0)}
          className="relative z-10 mx-auto mb-10 flex h-12 w-12 items-center justify-center border border-white/40 text-lg transition-colors hover:bg-white/10"
        >
          ↑
        </button>

        {/* Bottom row: copyright · socials · legal */}
        <div className="relative z-10 w-full px-5 md:px-8 pb-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between text-xs uppercase tracking-widest">
            {/* left: copyright + socials */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <span>©{new Date().getFullYear()}, Shaul Akelo</span>
              {socials.map((s) => (
                <Link key={s.label} href={s.href || "#"} className="opacity-70 transition-opacity hover:opacity-100">
                  {s.label}
                </Link>
              ))}
            </div>

            {/* right: legal */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {legal.map((l) => (
                <Link key={l.label} href={l.href || "#"} className="opacity-70 transition-opacity hover:opacity-100">
                  {l.label}
                </Link>
              ))}
              <span className="opacity-70">Crafted by Shaul</span>
            </div>
          </div>
        </div>
      </footer>
    )
  }