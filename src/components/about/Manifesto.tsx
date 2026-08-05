'use client'

import Image from "next/image";
import Button from "../ui/Button";
import SectionLabel from "../ui/SectionLabel";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";

export default function Manifesto() {

    const manifestoRef = useRef<HTMLDivElement | null>(null)
    const manifestoTextRef = useRef<HTMLParagraphElement | null>(null)
    const imgSectRef = useRef<HTMLDivElement | null>(null)
    const imgSectTextRef = useRef<HTMLHeadingElement | null>(null)

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

            if (imgSectTextRef.current) {
                const imgSectSplit = new SplitText(imgSectTextRef.current, {
                    type: "lines,words",
                    linesClass: "line"
                })

                imgSectSplit.lines.forEach((line) => {
                    const wrapper = document.createElement("div")
                    wrapper.style.overflow = "hidden"
                    line.parentNode?.insertBefore(wrapper, line)
                    wrapper.appendChild(line)
                })

                gsap.from(imgSectSplit.lines, {
                    yPercent: 120,
                    duration: 3,
                    stagger: 0.08,
                    ease: "expo.out",
                    scrollTrigger: {
                        trigger: imgSectRef.current,
                        start: "top 80%",   // fire as the section enters the viewport
                    },
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
                We bring data to life through
                skill and innovation. Trusted by
                organizations who demand precision,
                delivery and care.
                </p>
            </div>

            <div className="flex flex-col gap-6">
                <p ref={manifestoTextRef} className="text-black text-4xl md:text-5xl md:font-medium  max-w-xs md:max-w-3xl leading-tighter">Each phase of our work carries the
                same intent; to understand before
                we create, to refine before we build,
                and to craft with care that lasts.</p>
                <Button label="OUR APPROACH" href=""/>
            </div>

            {/* Content-sized blocks centred together — same layout as the contact page section */}
            <div ref={imgSectRef} className="flex flex-col md:flex-row items-center justify-center text-black gap-10 md:gap-4 md:p-10">
                {/* Text */}
                <div className="flex flex-col gap-10 md:gap-16 w-full md:max-w-2xl">
                    <h3 ref={imgSectTextRef} className="text-3xl md:text-4xl font-medium text-gray-900">Share your ideas, and we’ll shape them into a detailed proposal that reflects your goals with precision and care.</h3>
                    <div className="flex flex-col gap-3 max-w-xs md:ml-auto md:mr-20">
                        <SectionLabel label="Have a clear vision in mind?" dark/>
                        <p className="md:text-sm text-gray-600 mt-2">If you already have a concept or clear idea for your digital project, you can request a tailored quote right away. Simply fill in the form with as much detail as possible—our team will translate your vision into a precise proposal that fits your needs.</p>
                    </div>
                </div>

                {/* Image */}
                <div className="w-full md:max-w-[500px]">
                    <Image src="/abtt.webp" alt="A dimly lit desk at night: a tablet showing a dashboard interface, keyboard, headphones, and a city skyline through the window" width={700} height={300} className="w-full h-auto" />
                </div>
            </div>
        </section>
    )
}