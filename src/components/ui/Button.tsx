'use client'
import Link from "next/link"
import { useCallback, useEffect, useRef } from "react"
import { gsap, loadMorphSVG } from "@/lib/gsap"
import useReducedMotion from "@/hooks/useReducedMotion"
import { ARROW_PATH, ROBOT_PATH } from "./morphPaths"

type Props = {
    label: string
    href?: string
    outline?: boolean
    textColor?: string
    onClick?: () => void
    external?: boolean   // open the href in a new tab (for off-site links)
    morph?: boolean      // arrow-to-robot hover icon; opt out where several buttons sit together
    fullWidth?: boolean  // block CTA that fills its container (the bottom-nav menu)
}

export default function Button({
    label,
    href,
    outline,
    textColor = "text-white",
    onClick,
    external,
    morph = true,
    fullWidth,
}: Props) {
    const sizing = fullWidth
        ? 'flex w-full items-center justify-center px-6 py-3'
        : 'w-fit px-6 py-1'
    const classes = `${sizing}  ${textColor} ${outline ? '' : 'bg-black'}`

    const pathRef = useRef<SVGPathElement>(null)
    const ready = useRef(false)          // plugin loaded, so morphing back is safe
    const reducedMotion = useReducedMotion()

    useEffect(() => () => {
        if (pathRef.current) gsap.killTweensOf(pathRef.current)
    }, [])

    // Two explicit tweens rather than a paused timeline played/reversed: reversing a completed
    // MorphSVG timeline did not restore the original `d`, and `overwrite: 'auto'` handles rapid
    // in/out hovers cleanly by cancelling the in-flight tween.
    const morphTo = (d: string) => {
        if (!pathRef.current) return
        gsap.to(pathRef.current, {
            morphSVG: d,
            duration: 0.45,
            ease: 'power2.inOut',
            overwrite: 'auto',
        })
    }

    // The plugin loads on first hover, not on mount: there are 9+ buttons across the site and
    // most are never hovered, so this keeps ~20KB off the initial page load on every route.
    const handleEnter = useCallback(async () => {
        if (!morph || reducedMotion) return
        await loadMorphSVG()
        ready.current = true
        morphTo(ROBOT_PATH)
    }, [morph, reducedMotion])

    const handleLeave = useCallback(() => {
        if (!ready.current) return       // never morphed, nothing to undo
        morphTo(ARROW_PATH)
    }, [])

    const inner = (
        <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest">
            {morph && (
                // currentColor so the icon follows `textColor` on both the filled and outline
                // variants. fillRule="evenodd" is required — the robot's eyes and mouth are holes
                // cut from its body outline, and without it the shape fills solid.
                <svg viewBox="0 0 1000 1000" className="h-3.5 w-3.5 shrink-0" aria-hidden>
                    <path ref={pathRef} d={ARROW_PATH} fill="currentColor" fillRule="evenodd" />
                </svg>
            )}
            {label}
        </span>
    )

    if (href) {
        return (
            <Link
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className={classes}
                // Links can carry an onClick too — the bottom-nav CTA needs it to close the menu.
                onClick={onClick}
                onMouseEnter={handleEnter}
                onMouseLeave={handleLeave}
            >
                {inner}
            </Link>
        )
    }

    return (
        <button
            className={classes}
            onClick={onClick}
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
        >
            {inner}
        </button>
    )
}
