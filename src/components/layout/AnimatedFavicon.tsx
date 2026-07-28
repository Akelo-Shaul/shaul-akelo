'use client'
import { useEffect } from 'react'
import useReducedMotion from '@/hooks/useReducedMotion'

// Chrome, Edge and Safari render only the FIRST frame of an animated GIF favicon, so the tab icon
// sits still. This cycles it manually by swapping <link rel="icon"> between pre-extracted frames.
//
// These are the two frames of /shaul.gif at 32x32 (it's a 2-frame loop at 1s per frame), cropped
// to the content bounds. The source GIF is 1000x1000 with ~17% transparent padding on every edge,
// so cropping is what makes the mark fill the tab — going above 32px only adds sharpness.
//
// Both frames share ONE crop box (the union of their individual content bounds) so the character
// stays anchored instead of jumping between frames. Regenerate with:
//   sharp('public/shaul.gif', { page: N })
//     .extract({ left: 119, top: 119, width: 762, height: 762 })
//     .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
//     .png({ compressionLevel: 9 })
//
// DO NOT change these without checking the tab afterwards — an earlier attempt at cropped 64x64
// frames stopped the animation playing. Use fresh filenames when regenerating, so a cached icon
// can't be mistaken for a working one.
const FRAMES = ['/favicon-crop-0.png', '/favicon-crop-1.png']
const FRAME_MS = 1000

export default function AnimatedFavicon() {
    const reducedMotion = useReducedMotion()

    useEffect(() => {
        // Honour the OS "reduce motion" setting: leave the static GIF in place.
        if (reducedMotion) return

        const link = document.querySelector<HTMLLinkElement>('link[rel~="icon"]')
        if (!link) return

        const original = link.getAttribute('href')
        const originalType = link.getAttribute('type')

        // Warm the browser cache so the first swap doesn't flash an empty icon.
        FRAMES.forEach((src) => { new Image().src = src })

        let frame = 0
        link.setAttribute('type', 'image/png')

        const timer = window.setInterval(() => {
            frame = (frame + 1) % FRAMES.length
            link.setAttribute('href', FRAMES[frame])
        }, FRAME_MS)

        return () => {
            window.clearInterval(timer)
            // Put the GIF back, so Firefox (which animates it natively) isn't left on a still frame.
            if (original) link.setAttribute('href', original)
            if (originalType) link.setAttribute('type', originalType)
        }
    }, [reducedMotion])

    return null
}
