import { useEffect, useRef } from "react";
import Button from "../ui/Button";
import { gsap, SplitText, ScrollTrigger } from "@/lib/gsap";
import SectionLabel from "../ui/SectionLabel";

export default function About() {
    const aboutRef = useRef<HTMLDivElement | null>(null)
    const aboutTextRef = useRef<HTMLParagraphElement | null>(null)
    
    useEffect(() => {

        const ctx = gsap.context(() => {
            let aboutTextSplit: SplitText | null = null
            if (aboutTextRef.current) {
                aboutTextSplit = new SplitText(aboutTextRef.current, {
                    type: "lines",
                    linesClass: "line"
                })
    
                //clipping wrappers
                aboutTextSplit.lines.forEach((line) => {
                    const wrapper = document.createElement("div")
    
                    wrapper.style.overflow = "hidden"
                    wrapper.style.paddingBottom = "0.2em"
                    wrapper.style.marginBottom = "0.1em"
    
                    line.parentNode?.insertBefore(wrapper, line)
                    wrapper.appendChild(line)
                })
    
                gsap.from(aboutTextSplit.lines, {
                    yPercent: 120,
                    duration: 3,
                    stagger: 0.08,
                    ease: "expo.out",
                    scrollTrigger: {
                        trigger: aboutRef.current,
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

    
    return (
        <section ref={aboutRef} className="about h-[60vh] md:h-[80vh] w-full bg-white flex flex-col md:items-center justify-center gap-4 md:gap-10 p-5 md:p-8">
            <SectionLabel label="ABOUT SHAUL AKELO" dark />

            <p ref={aboutTextRef} className="md:text-center text-black text-3xl md:text-5xl font-medium max-w-3xl">
            We bring data to life through
            skill and innovation. Trusted by
            organizations who demand precision,
            delivery and care.
            </p>

            <Button label="WHO I AM" href="/about" />
        </section>
    )
}