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
  // Was the menu opened by scrolling to the bottom (vs. clicking the bar)? Scroll-opened
  // menus stay scroll-linked (no scroll lock) so scrolling back up reverses/closes them.
  const [scrollOpened, setScrollOpened] = useState(false)
  const scrollOpenedRef = useRef(false)
  const autoOpenedRef = useRef(false) // guards the auto-open so it fires once per arrival
  const maxScrollRef = useRef(0) // deepest scroll reached while scroll-opened
  const introDoneRef = useRef(introDone) // read latest introDone inside the scroll callback
  useEffect(() => { introDoneRef.current = introDone }, [introDone])

  // Fully close and forget how it was opened.
  const closeMenu = () => {
    scrollOpenedRef.current = false
    setScrollOpened(false)
    setOpen(false)
  }

  // Track scroll: toggle the ✕/↑ affordance, auto-open at the bottom, and close only once the
  // user climbs back up past a small margin from the deepest point they reached — so scrolling
  // (or over-scroll jitter) at the very bottom never closes it.
  useLenis((l) => {
    // Ignore until the page is actually measured/scrollable — on first paint `limit` is 0,
    // so `limit - scroll < 40` is trivially true and the menu would pop open under the loader.
    const scrollable = l.limit > 40
    const bottom = scrollable && l.limit - l.scroll < 40
    setAtBottom((prev) => (prev === bottom ? prev : bottom))

    if (bottom && introDoneRef.current && !autoOpenedRef.current) {
      autoOpenedRef.current = true
      scrollOpenedRef.current = true
      maxScrollRef.current = l.scroll
      setScrollOpened(true)
      setOpen(true)
    } else if (scrollOpenedRef.current) {
      // Keep extending the deepest point on further downward scroll (never closes),
      // and reverse once they scroll back up ~20px from it.
      if (l.scroll > maxScrollRef.current) maxScrollRef.current = l.scroll
      if (maxScrollRef.current - l.scroll > 20) {
        autoOpenedRef.current = false
        closeMenu()
      }
    } else if (!bottom) {
      autoOpenedRef.current = false // re-arm once they scroll away from the bottom
    }
  })

  // Lock Lenis scroll only for a manual (click) open. A scroll-opened menu stays unlocked
  // so the user can scroll back up to dismiss it.
  useEffect(() => {
    if (!lenis) return
    if (open && !scrollOpened) lenis.stop()
    else lenis.start()
    return () => lenis.start()
  }, [open, scrollOpened, lenis])

  // Close overlay on route change. Adjusting state during render (React's documented pattern for
  // "reset state when a value changes") rather than in an effect avoids a cascading re-render and
  // closes the menu before paint, so the new route never flashes with it still open.
  const [prevPath, setPrevPath] = useState(pathname)
  if (pathname !== prevPath) {
    setPrevPath(pathname)
    setScrollOpened(false)
    setOpen(false)
  }
  // Refs can't be written during render, so the matching ref reset stays in an effect.
  useEffect(() => { scrollOpenedRef.current = false }, [pathname])

  // Close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeMenu() }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  // The toggle: at the page bottom it scrolls to top; otherwise it just closes.
  const handleToggle = () => {
    const goTop = atBottom
    closeMenu()
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
                className="flex min-w-[240px] cursor-pointer items-center justify-between gap-6 rounded-md bg-neutral-800 px-5 py-3 text-white shadow-lg"
              >
                <span className="text-sm font-bold" aria-hidden="true">◈</span>
                <span className="text-[11px] font-bold uppercase tracking-widest">
                  {navLinks.find((l) => l.href === pathname)?.label ?? "Menu"}
                </span>
                <span className="flex flex-col items-end gap-[4px]" aria-hidden="true">
                  <span className="block h-px w-5 bg-white" />
                  <span className="block h-px w-5 bg-white" />
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
            {/* Dimmed backdrop only for a click-opened (modal) menu. When the menu is
                scroll-opened at the footer, we omit it so the footer stays visible and its
                socials / legal links remain clickable. */}
            {!scrollOpened && (
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                onClick={closeMenu}
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]"
              />
            )}

            {/* Centered layer scales up from a small box; clicking empty space closes */}
            <motion.div
              key="card"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.65, ease: EASE }}
              style={{ transformOrigin: "bottom center" }}
              className="pointer-events-none fixed inset-0 z-50 flex items-end justify-center px-6 pb-24"
            >
              {/* The menu card */}
              <div className="pointer-events-auto w-full max-w-xs bg-neutral-800/95 p-6 text-white shadow-2xl md:p-8">
                <motion.div variants={contentVariants} initial="hidden" animate="show">
                  <motion.div variants={fadeUp}>
                    <SectionLabel label="Menu" />
                  </motion.div>

                  {/* Primary nav — hovering one link dims the rest */}
                  <motion.div variants={listVariants} className="group/nav mt-4 flex flex-col gap-0.5">
                    {navLinks.map((link) => {
                      const active = link.href === pathname
                      return (
                        <motion.div key={link.href} variants={maskWrapper} className="overflow-hidden">
                          <motion.div variants={maskInner}>
                            <Link
                              href={link.href}
                              onClick={closeMenu}
                              className="flex items-center gap-3 text-xl font-medium leading-tight text-white transition-colors duration-300 group-hover/nav:text-white/40 hover:!text-white md:text-2xl"
                            >
                              {active && <span className="text-amber-400 text-sm">◆</span>}
                              {link.label}
                            </Link>
                          </motion.div>
                        </motion.div>
                      )
                    })}
                  </motion.div>

                  {/* Secondary links + contact */}
                  <motion.div variants={fadeUp} className="mt-6 flex gap-8 text-xs text-white/55">
                    <div className="flex flex-col gap-1">
                      <Link href="https://medium.com/@shaulakelo" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">News</Link>
                      <Link href="https://github.com/Akelo-Shaul" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">GitHub</Link>
                    </div>
                    <div className="flex flex-col gap-1">
                      <a href="tel:+254115089122" className="transition-colors hover:text-white">+254 115 089 122</a>
                      <a href="mailto:shaulakelo@gmail.com" className="transition-colors hover:text-white">shaulakelo@gmail.com</a>
                    </div>
                  </motion.div>

                  {/* Full-width CTA — shares the Button component so it gets the same
                      arrow-to-robot hover morph as every other button on the site. */}
                  <motion.div variants={fadeUp} className="mt-6">
                    <Button label="Get a Quote" href="/contact" onClick={closeMenu} fullWidth />
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
