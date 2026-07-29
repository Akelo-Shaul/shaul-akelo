'use client'
import Image from "next/image"
import { useEffect,useRef } from "react"
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap"
import { useLoader } from "../layout/LoaderContext"
import SectionLabel from "../ui/SectionLabel"

export default function Hero() {

    const { introDone } = useLoader()

    const heroRef = useRef<HTMLDivElement | null>(null)
    const containerRef = useRef<HTMLDivElement | null>(null);
    const imageRef = useRef<HTMLDivElement | null>(null);
    const herotitleRef = useRef<HTMLParagraphElement | null>(null)

    useEffect(() => {
    if (!introDone) return;
    if (!imageRef.current) return;

    const ctxt = gsap.context(() => {
        gsap.to(imageRef.current, {
            yPercent: 50,
            ease: 'none',
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top top',
                end: 'bottom top',
                scrub: true,
            },
        });

        let heroSplit: SplitText | null = null
        if (herotitleRef.current) {
            heroSplit = new SplitText(herotitleRef.current, {
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
    }, containerRef)

    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 1800);

    return () => {
        clearTimeout(refreshTimer);
        ctxt.revert();
    };
    }, [introDone]);

    return (
        <section ref={heroRef} className="hero relative w-full min-h-dvh">

            <div ref={containerRef} className="absolute inset-0 overflow-hidden">
                <div ref={imageRef} className="absolute inset-0 opacity-40">
                    {/* Decorative backdrop rendered at 40% opacity behind the hero text, so it
                        doesn't need full detail — q=50 roughly halves the payload of what is the
                        page's LCP element. */}
                    <Image src="/bgg.webp" alt="" fill priority quality={50} className="object-cover" />
                </div>
            </div>

            <div className="relative z-10 w-full h-[100vh] flex flex-col pb-30 ">

                <div className="flex-1" />
                <p ref={herotitleRef} className="herotitle text-white text-4xl md:text-5xl md:font-medium text-center max-w-xs md:max-w-2xl mx-auto leading-tighter">
                    Building systems for the world&apos;s best achievers.
                </p>
                
            </div>

            <div className="relative w-full pb-10 md:pb-40 overflow-x-clip  p-5 md:p-8">       

                <div className="grid grid-cols-1 md:grid-cols-3 items-start gap-x-6">

                    <div className="hidden md:block row-span-2"/>

                    <div className="col-span-1 md:col-start-2 md:col-span-2 h-px bg-white/30 mb-6 ml-0 md:ml-28" />

                    <div className="justify-self-start md:justify-self-center mb-6">
                        <SectionLabel label="Glazing Specialists" />
                    </div>

                    {/* Right — description */}
                    <p className="justify-self-start md:justify-self-end text-white text-sm font-medium max-w-xs leading-relaxed">
                    We connect you to the world and the world to you through
                    research, design and engineering of your needs( shaping an
                    image of your dream). Achieved at low latency, high performance 
                    and smooth installation.
                    </p>

                </div>
                
            </div>
            
        </section>
    )

}