'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useLoader } from './LoaderContext'
import { useContext, useEffect, useState } from 'react'
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
  const [animating, setAnimating] = useState(true)
  const [prevPath, setPrevPath] = useState(pathname)

  // Mirror the animating state to the shared context so the footer can hide during a transition.
  useEffect(() => { setTransitioning(animating) }, [animating, setTransitioning])

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