'use client'
import { useQuote } from "./QuoteContext"

/**
 * Wraps the page chrome and slides it left while the quote drawer is open, so the drawer appears
 * to push the site aside rather than cover it.
 *
 * Two things to know before changing this:
 *
 * 1. A CSS transform on an ancestor makes `position: fixed` descendants resolve against THIS
 *    element instead of the viewport. PageTransition switches its wrapper to `position: fixed`
 *    mid-navigation, so the transform is only applied while the drawer is open — and the drawer
 *    closes on route change (see QuoteDrawer), so the two states never overlap.
 * 2. The drawer itself is mounted OUTSIDE this wrapper in layout.tsx, for the same reason: it is
 *    `position: fixed` and must anchor to the viewport, not to a shifted parent.
 *
 * Below `md` the drawer is full-width, so shifting the page would only push it entirely
 * off-screen for no benefit — the shift is desktop-only.
 */
export default function QuoteShift({ children }: { children: React.ReactNode }) {
    const { open } = useQuote()

    return (
        <div
            // NO transform class when closed — not even `translate-x-0`. A zero transform is still
            // a transform, and it makes `position: fixed` descendants resolve against this element
            // instead of the viewport. That silently broke BottomNav's floating bar
            // (`fixed bottom-6`, which ended up at the bottom of the document) and its full-screen
            // menu overlay. Closed means no transform at all, so fixed positioning behaves.
            className={`transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                open ? 'md:-translate-x-[min(1100px,78vw)]' : ''
            }`}
        >
            {children}
        </div>
    )
}
