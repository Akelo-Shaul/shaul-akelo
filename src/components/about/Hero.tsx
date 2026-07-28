'use client'

import { useEffect, useRef } from "react";
import Button from "../ui/Button";
import SectionLabel from "../ui/SectionLabel";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import Image from "next/image";
import { useLoader } from "../layout/LoaderContext";

export default function Hero() {

    const { introDone } = useLoader()

    const heroRef = useRef<HTMLDivElement | null>(null)
    const heroTextRef = useRef<HTMLParagraphElement | null>(null)

    useEffect(() => {
        if (!introDone) return;

        const ctxt = gsap.context(() => {
            
            let heroSplit: SplitText | null = null
            if (heroTextRef.current) {
                heroSplit = new SplitText(heroTextRef.current, {
                    type: "lines",
                    linesClass: "line"
                })
    
                // Create clipping wrappers
                heroSplit.lines.forEach((line) => {
                    const wrapper = document.createElement("div")
    
                    wrapper.style.overflow = "hidden"
                    wrapper.style.paddingBottom = "0.2em"
                    wrapper.style.marginBottom = "0.1em"
    
                    line.parentNode?.insertBefore(wrapper, line)
                    wrapper.appendChild(line)
                })
    
                gsap.from(heroSplit.lines, {
                    yPercent: 120,
                    duration: 3,
                    stagger: 0.08,
                    ease: "expo.out",
                    delay: 0.4
                })
            }
        }, heroRef)

            
        const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 1800);

        return () => {
            clearTimeout(refreshTimer);
            ctxt.revert();
        };
        
    }, [introDone])

    return (
        <section ref={heroRef} className="flex flex-col about h-[80vh] md:h-[150vh] w-full gap-10 bg-white justify-end items-center p-5 md:p-8">
            <div className="flex flex-col  gap-5 items-center md:pt-30">
                <SectionLabel label="ABOUT SHAUL AKELO" dark />

                <p ref={heroTextRef} className="text-center text-black text-4xl md:text-5xl font-medium max-w-xl">
                Passionately shaping code
                into community and returns
                </p>
            </div>
            <div className="relative w-full h-[200px] md:h-[500px] mb-10">
                <Image src="/about.webp" alt="" fill className="object-cover" />
            </div>

        </section>
    )
}