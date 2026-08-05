'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useLoader } from './LoaderContext'
import { useLenis } from 'lenis/react'
import { useContext, useEffect, useRef, useState } from 'react'
import { LayoutRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime'

// Freezes the App Router context so an exiting page keeps rendering its own content during the
// transition, instead of the incoming route content bleeding in (which left the old page as a
// bare background colour). Standard pattern for AnimatePresence + Next App Router.
function FrozenRouter({ children }: { children: React.ReactNode }) {
  const context = useContext(LayoutRouterContext)
  // useState's initializer captures the first context value and never recomputes, giving the
  // same "freeze" as a ref without reading a ref during render.
  const [frozen] = useState(context)

  return (
    <LayoutRouterContext.Provider value={frozen}>
      {children}
    </LayoutRouterContext.Provider>
  )
}

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { introDone, setTransitioning } = useLoader()
  const lenis = useLenis()
  const [animating, setAnimating] = useState(true)
  const [prevPath, setPrevPath] = useState(pathname)

  // Mirror the animating state to the shared context so the footer can hide during a transition.
  useEffect(() => { setTransitioning(animating) }, [animating, setTransitioning])

  // Reset scroll ourselves on route change, because Next's built-in scroll-to-top bails out here.
  // Its handler skips the scroll when the incoming page's top edge is already in the viewport —
  // and the fixed overlay below puts that edge at y=0 no matter where the document is scrolled,
  // so the check always passes. Without this, navigating from the bottom of a page (i.e. from the
  // bottom nav, which auto-opens down there) lands the next page at the footer.
  // Lenis owns the scroll, so go through it — writing scrollTop directly gets overwritten on its
  // next RAF tick.
  const scrolledFor = useRef(pathname)
  useEffect(() => {
    // Skips the initial mount, and the re-run once `lenis` becomes available, so a refresh that
    // restores scroll position isn't yanked to the top.
    if (scrolledFor.current === pathname) return
    scrolledFor.current = pathname
    // `immediate`: no visible jump — this happens behind the transition, while both page layers
    // are position:fixed and the footer is `invisible`.
    // `force`: bypasses Lenis's stopped state, since BottomNav/QuoteDrawer call lenis.stop().
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
    else window.scrollTo(0, 0)
  }, [pathname, lenis])

  // Once the wrapper leaves position:fixed the document regains its full height, so Lenis has to
  // re-measure — otherwise it keeps the short (fixed) `limit`, which feeds BottomNav's
  // at-the-bottom detection and would pop the menu open on arrival. This has to be an effect
  // rather than part of onAnimationComplete: the flip to `relative` isn't in the DOM until React
  // has committed `animating`.
  useEffect(() => {
    if (!animating) lenis?.resize()
  }, [animating, lenis])

  // On route change, re-enter the fixed-overlay "animating" state BEFORE paint so the
  // incoming page reveals over the outgoing one instead of flashing in normal flow first.
  if (pathname !== prevPath) {
    setPrevPath(pathname)
    setAnimating(true)
  }

  return (
    <AnimatePresence mode="sync">
      <motion.div
        key={pathname}
        initial={{ y: '100%', clipPath: 'inset(8% 9%)' }}
        animate={introDone ? {
          y: ['100%', '0%', '0%'],
          clipPath: ['inset(8% 9%)', 'inset(8% 9%)', 'inset(0% 0%)'],
        } : {
          y: '100%',
          clipPath: 'inset(8% 9%)',
        }}
        // Keep the outgoing page mounted, full and static, as the backdrop the incoming page
        // slides over. Its y/clip target equals its current values (a no-op), so framer would
        // otherwise unmount it on the next frame — leaving the new page sliding over a black
        // body. Delaying an opacity change holds it for the transition, then removes it once
        // the incoming page has fully covered it. (FrozenRouter keeps it rendering its OWN
        // content instead of the new route.)
        exit={{
          opacity: 0,
          transition: { duration: 0.01, delay: 1.5 },
        }}
        transition={{
          duration: 1.5,
          times: [0, 0.5, 1],
          ease: [0.2, 0, 0.3, 1],
        }}
        onAnimationComplete={(definition) => {
          // Only the entering page's reveal releases the fixed overlay. Its `animate` is
          // keyframed (y is an array); the outgoing page's `exit` (y: '0%') is not — and it
          // completes instantly, so ignoring it prevents the incoming page from flashing.
          if (introDone && Array.isArray((definition as { y?: unknown }).y)) {
            setAnimating(false)
          }
        }}
        style={{
          position: animating ? 'fixed' : 'relative',
          inset: animating ? 0 : 'auto',
          zIndex: 10,
          willChange: 'transform',
          width: '100%',
        }}
      >
        <FrozenRouter>{children}</FrozenRouter>
      </motion.div>
    </AnimatePresence>
  )
}