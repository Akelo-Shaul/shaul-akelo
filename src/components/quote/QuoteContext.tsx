'use client'
import { createContext, useCallback, useContext, useState, ReactNode } from "react"

type QuoteContextValue = {
    open: boolean
    openQuote: () => void
    closeQuote: () => void
}

const QuoteContext = createContext<QuoteContextValue | null>(null)

/**
 * Drawer open/closed state, lifted to a provider because the triggers (the header CTA and the
 * bottom-nav menu CTA) live in a different subtree from the drawer itself, which is mounted at
 * the layout root so it can sit outside the pushed page wrapper.
 */
export function QuoteProvider({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false)
    const openQuote = useCallback(() => setOpen(true), [])
    const closeQuote = useCallback(() => setOpen(false), [])

    return (
        <QuoteContext.Provider value={{ open, openQuote, closeQuote }}>
            {children}
        </QuoteContext.Provider>
    )
}

export function useQuote() {
    const ctxt = useContext(QuoteContext)
    if (!ctxt) throw new Error('useQuote must be inside <QuoteProvider>')
    return ctxt
}
