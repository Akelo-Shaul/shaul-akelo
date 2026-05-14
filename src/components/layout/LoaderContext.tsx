'use client'
import { createContext, useCallback, useContext, useState, ReactNode } from "react"

type LoaderContextValue = {
    introDone: boolean
    markIntroDone: () => void
}

const LoaderContext = createContext<LoaderContextValue | null>(null)

export function LoaderProvider({ children }: { children: ReactNode}) {
    const [introDone, setIntroDone] = useState(false)
    const markIntroDone = useCallback(() => setIntroDone(true), [])

    return (
        <LoaderContext.Provider value={{ introDone, markIntroDone}}>
            {children}
        </LoaderContext.Provider>
    )
}

export function useLoader() {
    const ctxt = useContext(LoaderContext)
    if (!ctxt) throw new Error('useLoader must be inside <LoaderProvider>')
    return ctxt
}