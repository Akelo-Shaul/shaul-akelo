'use client'
import { createContext, useCallback, useContext, useState, ReactNode } from "react"

type LoaderContextValue = {
    introDone: boolean
    markIntroDone: () => void
    transitioning: boolean
    setTransitioning: (v: boolean) => void
}

const LoaderContext = createContext<LoaderContextValue | null>(null)

export function LoaderProvider({ children }: { children: ReactNode}) {
    const [introDone, setIntroDone] = useState(false)
    const markIntroDone = useCallback(() => setIntroDone(true), [])
    // True while a page transition (or the intro) is animating — the footer hides itself
    // during this so it can't bleed through the transition's clip.
    const [transitioning, setTransitioning] = useState(true)

    return (
        <LoaderContext.Provider value={{ introDone, markIntroDone, transitioning, setTransitioning }}>
            {children}
        </LoaderContext.Provider>
    )
}

export function useLoader() {
    const ctxt = useContext(LoaderContext)
    if (!ctxt) throw new Error('useLoader must be inside <LoaderProvider>')
    return ctxt
}