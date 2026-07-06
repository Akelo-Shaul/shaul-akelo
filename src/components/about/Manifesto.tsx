'use client'

import Image from "next/image";
import Button from "../ui/Button";
import SectionLabel from "../ui/SectionLabel";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";

export default function Manifesto() {

    const manifestoRef = useRef<HTMLDivElement | null>(null)
    const manifestoTextRef = useRef<HTMLParagraphElement | null>(null)
     
    useEffect(() => {
        const ctxt = gsap.context(() => {
            let manifestoSplit: SplitText | null = null
            if (manifestoTextRef.current) {
                manifestoSplit = new SplitText(manifestoTextRef.current, {
                    type: "lines",
                    linesClass: "line"
                })

                // Create clipping wrappers
                manifestoSplit.lines.forEach((line) => {
                    const wrapper = document.createElement("div")

                    wrapper.style.overflow = "hidden"
                    wrapper.style.paddingBottom = "0.2em"
                    wrapper.style.marginBottom = "0.1em"

                    line.parentNode?.insertBefore(wrapper, line)
                    wrapper.appendChild(line)
                })

                gsap.from(manifestoSplit.lines, {
                    yPercent: 120,
                    duration: 3,
                    stagger: 0.08,
                    ease: "expo.out",
                    scrollTrigger: {
                        trigger: manifestoRef.current,
                        start: "top 80%",
                    }
                }) 
            }
        }, manifestoRef)

        const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 1800);

        return () => {
            clearTimeout(refreshTimer);
            ctxt.revert();
        };

    }, [])

    return (
        <section ref={manifestoRef} className="flex flex-col gap-15 md:gap-20 p-5 md:p-8">
            <div className="flex flex-col md:flex-row gap-4 text-black items-start justify-between border-t border-gray-300 py-4">
                <SectionLabel label="MANIFESTO" dark />
                <p className="text-sm font-medium max-w-xs leading-relaxed">
                We design and install bespoke glass systems for ambitious
                architectural projects. Every pane reflects our commitment
                to clarity, quality, and collaboration.
                </p>
            </div>

            <div className="flex flex-col gap-6">
                <p ref={manifestoTextRef} className="text-black text-4xl md:text-5xl md:font-medium  max-w-xs md:max-w-3xl leading-tighter">Each phase of our work carries the
                same intent; to understand before
                we create, to refine before we build,
                and to craft with care that lasts.</p>
                <Button label="OUR APPROACH" href=""/>
            </div>

            <div className="flex flex-col-reverse md:flex-row text-black items-center justify-center md:p-10 gap-6 md:gap-40">
                <div className="flex flex-col gap-3 md:max-w-xs md:mr-30">
                    <SectionLabel label="Have a clear vision in mind?" dark/>
                    <p className="text-sm text-gray-600 mt-2">If you already have a concept or clear idea for your glazing project, you can request a tailored quote right away. Simply fill in the form with as much detail as possible—our team will translate your vision into a precise proposal that fits your needs.</p>
                </div>

                <div className="md:w-[50vw]">
                    <Image src="/cover.png" alt="Contact Image " width={700} height={300}/>
                </div>
            </div>
        </section>
    )
}