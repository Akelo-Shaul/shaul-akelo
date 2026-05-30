// import { use, useEffect, useRef } from "react";
// import { gsap, ScrollTrigger } from "@/lib/gsap";

// type ScrollTriggerOptions = {
//     animation: (element: HTMLElement) => gsap.core.Tween | gsap.core.Timeline,
//     trigger?: ScrollTrigger.Vars
// }

// export function useScrollTrigger<T extends HTMLElement>({
//     animation,
//     trigger = {},
// }: ScrollTriggerOptions) {
//     const ref = useRef<T | null>(null)

//     useEffect(() => {
//         if (!ref.current) return
//         const el = ref.current

//         const anim = animation(el)

//         ScrollTrigger.create({
//             trigger: el,
//             start: 
//         })
//     }
// }