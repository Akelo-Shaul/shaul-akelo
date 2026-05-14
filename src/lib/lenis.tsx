'use client'
import { useLenis } from 'lenis/react'

export function useSmoothScroll() {
    return useLenis()
}

export function useScrollToTop() {
    const lenis = useLenis()

    return () => lenis?.scrollTo(0, { duration: 1.2})
}

export function useScrollTo() {
    const lenis = useLenis()

    return (target: string | HTMLElement, offset = 0) => {
        lenis?.scrollTo(target, {offset, duration: 1.2})
    }
}