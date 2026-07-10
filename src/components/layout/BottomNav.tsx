'use client'
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { useLenis } from "lenis/react"
import { useEffect, useRef, useState } from "react"
import { useLoader } from "./LoaderContext"
import { navLinks } from "@/data/navigation"
import SectionLabel from "../ui/SectionLabel"
import Button from "../ui/Button"

// Smooth, expressive easing (expo-out feel) so nothing snaps.
const EASE = [0.16, 1, 0.3, 1] as const

// The card content reveals AFTER the box has expanded (delayChildren),
// then each item staggers in.
const contentVariants = {
  hidden: {},
  show: { transition: { delayChildren: 0.28, staggerChildren: 0.08 } },
}
const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}
// Masked line reveal for the nav links (wrapper clips, inner slides up).
const maskWrapper = { hidden: {}, show: {} }
const maskInner = {
  hidden: { y: "115%" },
  show: { y: "0%", transition: { duration: 0.7, ease: EASE } },
}

export default function BottomNav() {
  const pathname = usePathname()
  const lenis = useLenis()
  const { introDone } = useLoader()

  const [open, setOpen] = useState(false)
  const [atBottom, setAtBottom] = useState(false)
  const autoOpenedRef = useRef(false) // guards the auto-open so it fires once per arrival
  const introDoneRef = useRef(introDone) // read latest introDone inside the scroll callback
  useEffect(() => { introDoneRef.current = introDone }, [introDone])

  // Track scroll: toggle the ✕/↑ affordance and auto-open the menu at the page bottom.
  useLenis((l) => {
    // Ignore until the page is actually measured/scrollable — on first paint `limit` is 0,
    // so `limit - scroll < 40` is trivially true and the menu would pop open under the loader.
    const scrollable = l.limit > 40
    const bottom = scrollable && l.limit - l.scroll < 40
    setAtBottom((prev) => (prev === bottom ? prev : bottom))
    if (bottom && introDoneRef.current && !autoOpenedRef.current) {
      autoOpenedRef.current = true
      setOpen(true)
    } else if (!bottom) {
      autoOpenedRef.current = false // re-arm once they scroll away from the bottom
    }
  })

  // Lock Lenis scroll while the overlay is open.
  useEffect(() => {
    if (!lenis) return
    if (open) lenis.stop()
    else lenis.start()
    return () => lenis.start()
  }, [open, lenis])

  // Close overlay on route change.
  useEffect(() => { setOpen(false) }, [pathname])

  // Close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false) }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  // The toggle: at the page bottom it scrolls to top; otherwise it just closes.
  const handleToggle = () => {
    const goTop = atBottom
    setOpen(false)
    if (goTop) {
      lenis?.start() // the open-effect also re-enables it, but ensure scroll works now
      lenis?.scrollTo(0)
    }
  }

  return (
    <>
      {/* Bottom control — the bar and the ✕/↑ toggle are ONE morphing element (shared layoutId).
          Outer div owns horizontal centering; inner motion.div owns the one-time intro slide. */}
      <div className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2">
        <motion.div
          initial={{ y: "150%" }}
          animate={{ y: introDone ? "0%" : "150%" }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {open ? (
              <motion.button
                key="toggle"
                layoutId="nav-control"
                type="button"
                onClick={handleToggle}
                aria-label={atBottom ? "Back to top" : "Close menu"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="flex h-12 w-12 items-center justify-center rounded-md bg-neutral-800 text-lg text-white shadow-lg"
              >
                <motion.span
                  key={atBottom ? "up" : "close"}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                >
                  {atBottom ? "↑" : "✕"}
                </motion.span>
              </motion.button>
            ) : (
              <motion.div
                key="bar"
                layoutId="nav-control"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                role="button"
                tabIndex={0}
                aria-label="Open menu"
                onClick={() => setOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(true) }
                }}
                className="flex min-w-[300px] cursor-pointer items-center justify-between gap-8 rounded-md bg-neutral-800 px-6 py-4 text-white shadow-lg"
              >
                <span className="text-base font-bold" aria-hidden="true">◈</span>
                <span className="text-xs font-bold uppercase tracking-widest">
                  {navLinks.find((l) => l.href === pathname)?.label ?? "Menu"}
                </span>
                <span className="flex flex-col items-end gap-[5px]" aria-hidden="true">
                  <span className="block h-px w-6 bg-white" />
                  <span className="block h-px w-6 bg-white" />
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Menu overlay: dimmed backdrop + a card that grows from a small box */}
      <AnimatePresence>
        {open && (
          <>
            {/* Dimmed page behind (click to close) — does not scale */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]"
            />

            {/* Centered layer scales up from a small box; clicking empty space closes */}
            <motion.div
              key="card"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.65, ease: EASE }}
              onClick={(e) => { if (e.target === e.currentTarget) setOpen(false) }}
              className="fixed inset-0 z-50 flex items-center justify-center px-6"
            >
              {/* The menu card */}
              <div className="w-full max-w-md bg-neutral-800/95 p-8 text-white shadow-2xl md:p-10">
                <motion.div variants={contentVariants} initial="hidden" animate="show">
                  <motion.div variants={fadeUp}>
                    <SectionLabel label="Menu" />
                  </motion.div>

                  <motion.div variants={listVariants} className="mt-6 flex flex-col gap-1">
                    {navLinks.map((link) => {
                      const active = link.href === pathname
                      return (
                        <motion.div key={link.href} variants={maskWrapper} className="overflow-hidden">
                          <motion.div variants={maskInner}>
                            <Link
                              href={link.href}
                              onClick={() => setOpen(false)}
                              className="flex items-center gap-3 text-4xl font-medium leading-tight md:text-5xl"
                            >
                              {active && <span className="text-amber-400 text-xl">◆</span>}
                              {link.label}
                            </Link>
                          </motion.div>
                        </motion.div>
                      )
                    })}
                  </motion.div>

                  <motion.div variants={fadeUp} className="mt-8">
                    <Button label="Get a Quote" href="/contact" />
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
