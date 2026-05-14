'use client'
import { useLenis } from 'lenis/react'
import { useEffect } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

export default function LenisScrollSync() {
    const lenis = useLenis(ScrollTrigger.update)

    useEffect(() => {
        if (!lenis) return
        const update = (time: number) => lenis.raf(time * 1000)
        gsap.ticker.add(update)
        gsap.ticker.lagSmoothing(0)
        return () => gsap.ticker.remove(update)
    }, [lenis])

    return null
}