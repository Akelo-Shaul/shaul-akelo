'use client'

import Image from "next/image";
import SectionLabel from "../ui/SectionLabel";
import { useLoader } from "../layout/LoaderContext";
import { useQuote } from "../quote/QuoteContext";
import { useEffect, useRef } from "react";
import { gsap, SplitText, ScrollTrigger } from "@/lib/gsap";

export default function ContactInfo() {

    const { introDone } = useLoader()
    const { openQuote } = useQuote()

    const contactInfoRef = useRef<HTMLDivElement | null>(null)
    const contactInfoTextRef = useRef<HTMLParagraphElement | null>(null)
    const imgSectRef = useRef<HTMLDivElement | null>(null)
    const imgSectTextRef = useRef<HTMLHeadingElement | null>(null)

    useEffect(() => {
        if (!introDone) return;

        const ctxt = gsap.context(() => {
            let contactInfoSplit: SplitText | null = null

            if (contactInfoTextRef.current) {
                contactInfoSplit = new SplitText(contactInfoTextRef.current, {
                    type: "lines",
                    linesClass: "line"
                })

                // Create clipping wrappers
                contactInfoSplit.lines.forEach((line) => {
                    const wrapper = document.createElement("div")

                    wrapper.style.overflow = "hidden"
                    wrapper.style.paddingBottom = "0.2em"
                    wrapper.style.marginBottom = "0.1em"

                    line.parentNode?.insertBefore(wrapper, line)
                    wrapper.appendChild(line)
                })

                gsap.from(contactInfoSplit?.lines, {
                    yPercent: 120,
                    duration: 3,
                    stagger: 0.08,
                    ease: "expo.out",
                    delay: 0.4
                })
            }

            if (imgSectTextRef.current) {
                const imgSectSplit = new SplitText(imgSectTextRef.current, {
                    type: "lines,words",
                    linesClass: "line"
                })

                // Create clipping wrappers
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
                    scrollTrigger: {
                        trigger: imgSectRef.current,
                        start: "top 80%",   // fire as the section enters the viewport
                    },
                    ease: "expo.out",
                })
            }

        }, contactInfoRef)

        // Recompute trigger positions once the layout/images have settled.
        const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 1800)

        return () => {
            clearTimeout(refreshTimer)
            ctxt.revert()
        }
    }, [introDone])

    return (
        <section ref={contactInfoRef} className="bg-white mb-15 pt-30 md:py-40 p-5 md:p-8">
            <div className="flex flex-col gap-8 my-10">
                <SectionLabel label="CONTACT" dark/>
                <p ref={contactInfoTextRef} className="text-black text-4xl md:text-5xl md:font-medium  max-w-xs md:max-w-xl leading-tighter">Every great build begins with understanding</p>
            </div>

            <div className="md:my-20 flex  flex-col md:flex-row text-black border-t border-gray-300 pt-4 gap-8">
                <div className="flex-1">
                    <SectionLabel label="GET IN TOUCH" dark/>
                </div>
                <div className="flex flex-col md:flex-row flex-1 gap-4">
                    <div className="flex-1">
                        <p>Talk To Us</p>
                        <a href="tel:+254115089122" className="hover:underline">+254 115 089 122</a>
                    </div>
                    <div className="flex-1">
                        <p>Write Us</p>
                        <a href="mailto:shaulakelo@gmail.com" className="hover:underline">shaulakelo@gmail.com</a>
                    </div>
                </div>

            </div>

            <div className="my-8 md:my-20 flex flex-col md:flex-row text-black border-t border-gray-300 pt-4 gap-8">
                <div className="flex-1">
                    <SectionLabel label="ADDRESS" dark/>
                </div>
                <div className="flex flex-col md:flex-row flex-1 gap-4">
                    <div className="flex-1">
                        <p>Talk To Us</p>
                        <a href="tel:+254115089122" className="hover:underline">+254 115 089 122</a>
                    </div>
                    <div className="flex-1">
                        <p>Need Help?</p>
                        {/* Opens the quote drawer. Styled to match the phone link above it
                            rather than as a filled button, so the two columns stay balanced. */}
                        <button
                            type="button"
                            onClick={openQuote}
                            className="text-left hover:underline"
                        >
                            GET A QUOTE
                        </button>
                    </div>
                </div>

            </div>

            {/* Content-sized blocks centred together, so whitespace sits on the outer
                edges instead of pooling between the text and image. */}
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
                    <Image
                        src="/alexander.webp"
                        alt="Contact Image"
                        width={700}
                        height={300}
                        className="w-full h-auto"
                    />
                </div>
            </div>
        </section>
    )
}