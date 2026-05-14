'use client'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { useLoader } from './LoaderContext'

export default function InitialLoader() {
  const { markIntroDone } = useLoader()
  const [visible, setVisible] = useState(true)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const textRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    gsap.registerPlugin(SplitText)
    if (!textRef.current) return

    const split = new SplitText(textRef.current, {
      type: 'chars',
      charsClass: 'char',
    })

    gsap.set(textRef.current, { opacity: 1 })

    const tl = gsap.timeline()

    tl.from(split.chars, {
      yPercent: 100,
      opacity: 0,
      duration: 1,
      stagger: 0.05,
      ease: 'expo.out',
    })
    .to(split.chars, {
      yPercent: -100,
      opacity: 0,
      duration: 0.6,
      stagger: 0.03,
      ease: 'expo.in',
    }, '+=0.4')
    .call(() => {
        markIntroDone()
        setTimeout(() => setVisible(false), 1600)
    })

    return () => { tl.kill(); split.revert() }
  }, [markIntroDone])

  if (!visible) return null

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[9] flex items-center justify-center bg-[#e8e5e1]"
    >
      <div className="overflow-hidden">
        <div
          ref={textRef}
          className="intro-text text-black text-6xl font-semibold leading-none opacity-0"
        >
          SHAUL AKELO
        </div>
      </div>
    </div>
  )
}