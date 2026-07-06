import { useRef, useEffect } from "react";
import Button from "../ui/Button";
import SectionLabel from "../ui/SectionLabel";
import { gsap, SplitText, ScrollTrigger } from "@/lib/gsap";
import FeatureProjectsList from "./FeatureProjectsList";

export default function FeatureProjects() {

    const featureProjectsRef = useRef<HTMLDivElement | null>(null)
    const featureProjectsTextRef = useRef<HTMLParagraphElement | null>(null)

    useEffect(() => {
      let featureProjectsTextSplit: SplitText | null = null

      const ctx = gsap.context(() => {
        if (featureProjectsTextRef.current) {
          featureProjectsTextSplit = new SplitText(featureProjectsTextRef.current, {
            type: "lines",
            linesClass: "line"
          })

          //clipping wrappers
          featureProjectsTextSplit.lines.forEach((line) => {
            const wrapper = document.createElement("div")

            wrapper.style.overflow = "hidden"
            wrapper.style.paddingBottom = "0.2em"
            wrapper.style.marginBottom = "0.1em"

            line.parentNode?.insertBefore(wrapper, line)
            wrapper.appendChild(line)
          })

          gsap.from(featureProjectsTextSplit.lines, {
            yPercent: 120,
            duration: 3,
            stagger: 0.08,
            ease: "expo.out",
            scrollTrigger: {
              trigger: featureProjectsRef.current,
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
      <section ref={featureProjectsRef} className="featured-projects bg-gray-100 w-full min-h-dvh py-10  p-5 md:p-8">
        {/* <div className="h-px bg-gray-300 mb-6"></div> */}

        <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-x-12 gap-y-8 items-start mb-20 md:mb-32 border-t border-gray-300 pt-4">
            <SectionLabel label="FEATURED PROJECTS" dark/>


            <div className="flex flex-col items-start gap-8">
                <h2 ref={featureProjectsTextRef} className="text-black text-4xl md:text-5xl font-medium leading-[1.05] max-w-2xl">
                Each project tells its own story of collaboration and precision.
                </h2>

                {/* <button className='w-fit px-6 py-1 bg-black text-white'>
                <span className="text-[12px] font-semibold tracking-widest">VIEW PROJECTS</span>
                </button> */}

                <Button label="VIEW PROJECTS" href="/projects" />
            </div>
        </div>

        <FeatureProjectsList />
      </section>
    )
}