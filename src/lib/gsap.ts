import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger, SplitText)

// MorphSVGPlugin is deliberately NOT registered above. It's only used by the Button hover morph,
// and Button renders on every page — registering it eagerly would put ~20KB on every route,
// including mobile where the header button is hidden entirely.
//
// Instead it loads on the first hover anywhere on the site. The promise is memoised at module
// scope, so all button instances share one import and one registerPlugin call.
let morphReady: Promise<void> | null = null

export function loadMorphSVG(): Promise<void> {
    morphReady ??= import("gsap/MorphSVGPlugin").then(({ MorphSVGPlugin }) => {
        gsap.registerPlugin(MorphSVGPlugin)
    })
    return morphReady
}

export {gsap, ScrollTrigger, SplitText}