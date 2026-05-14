'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useLoader } from './LoaderContext'
import { useState } from 'react'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { introDone } = useLoader()
  const [animating, setAnimating] = useState(true)

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
        exit={{ y: '0%', clipPath: 'inset(0% 0%)' }}
        transition={{
          duration: 1.5,
          times: [0, 0.5, 1],
          ease: [0.2, 0, 0.3, 1],
        }}
        onAnimationComplete={() => {
          if (introDone) setAnimating(false)  // ← only fires after real entry animation
        }}
        style={{
          position: animating ? 'fixed' : 'relative',
          inset: animating ? 0 : 'auto',
          zIndex: 10,
          willChange: 'transform',
          width: '100%',
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}