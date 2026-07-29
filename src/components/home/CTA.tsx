import { useEffect, useRef } from "react";
import { gsap, SplitText, ScrollTrigger } from "@/lib/gsap";
import Button from "../ui/Button";
import SectionLabel from "../ui/SectionLabel";

export default function CTA() {

    const ctaRef = useRef<HTMLDivElement | null>(null)
    const ctaTextRef = useRef<HTMLParagraphElement | null>(null)

    useEffect(() => {
        let ctaTextSplit: SplitText | null = null

        const ctx = gsap.context(() => {
        if (ctaTextRef.current) {
            ctaTextSplit = new SplitText(ctaTextRef.current, {
            type: "lines",
            linesClass: "line"
            })

            //clipping wrappers
            ctaTextSplit.lines.forEach((line) => {
            const wrapper = document.createElement("div")

            wrapper.style.overflow = "hidden"
            wrapper.style.paddingBottom = "0.2em"
            wrapper.style.marginBottom = "0.1em"

            line.parentNode?.insertBefore(wrapper, line)
            wrapper.appendChild(line)
            })

            gsap.from(ctaTextSplit.lines, {
            yPercent: 120,
            duration: 3,
            stagger: 0.08,
            ease: "expo.out",
            scrollTrigger: {
                trigger: ctaRef.current,
                start: "top 80%",
            }
            })
        }
        })

        
        const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 1800);

        return () => {
            clearTimeout(refreshTimer);
            ctx.revert();
        };
    }, [])

    return(
        <div ref={ctaRef} className="flex flex-col bg-gray-100 gap-8 p-5 md:p-8 h-[50vh] md:h-[80vh] justify-center">
            <SectionLabel label="WHERE VISION MEETS EXECUTION" dark />
            <p ref={ctaTextRef} className="text-black text-4xl md:text-5xl md:font-medium  max-w-xs md:max-w-xl leading-tighter">Every great build begins with understanding</p>
            <div className="flex gap-8 items-start">
                <Button label="MY APPROACH" href="/about" outline textColor="text-black" />
                <Button label="GET IN TOUCH" href="/contact" />
            </div>
        </div>
    )
}