'use client'
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { useLoader } from '@/components/layout/LoaderContext'


export default function Home() {

  const { introDone } = useLoader()

  const containerRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    if (!introDone) return;;
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
    }, containerRef)

    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 1800);

    return () => {
      clearTimeout(refreshTimer);
      ctxt.revert();
    };
  }, [introDone]);

  return (
    <div className="w-full flex flex-col relative bg-black">
      <section className="hero relative w-full min-h-dvh pt-5">

        <div ref={containerRef} className="absolute inset-0 overflow-hidden">
          <div ref={imageRef} className="absolute inset-0 scale-110 opacity-40">
            <Image src="/tech.jpg" alt="" fill priority className="object-cover" />
          </div>
        </div>

        <div className="relative z-10 w-full min-h-dvh flex flex-col pb-35">

          <div className="w-full flex">

            <div className=" hidden md:flex flex-1"></div>

            <div className="w-full md:flex-1 flex justify-center items-center">
              <h1 className="text-4xl md:text-2xl">
                Shaul Akelo
              </h1>
            </div>

            <div className="flex-1 hidden md:flex justify-end ">
              <button className="px-6 py-3 text-white rounded-full">
                Get a Quote
              </button>
            </div>

          </div>

          <div className="flex-1" />
          <p className="text-white text-4xl md:text-5xl md:font-medium text-center max-w-xs md:max-w-md mx-auto leading-tighter">
            Exceptional glazing for those who build with vision.
          </p>
          
        </div>

        <div className="relative w-full pb-10 md:pb-40 overflow-x-clip px-8">       

          <div className="grid grid-cols-1 md:grid-cols-3 items-start gap-x-6">

            <div className="hidden md:block row-span-2"/>

            <div className="col-span-1 md:col-start-2 md:col-span-2 h-px bg-white/30 mb-6 ml-0 md:ml-28" />

            <p className="justify-self-start md:justify-self-center text-white text-xs tracking-widest uppercase flex items-center gap-2 mb-6">
              <span className="text-amber-400">◆</span>
              Glazing Specialists
            </p>

            {/* Right — description */}
            <p className="justify-self-start md:justify-self-end text-white text-sm font-medium max-w-xs leading-relaxed">
              We design and install bespoke glass systems for ambitious
              architectural projects. Every pane reflects our commitment
              to clarity, quality, and collaboration.
            </p>

          </div>
            
        </div>
        
      </section>

      <section className="about h-[60vh] md:h-[80vh] w-full bg-white flex flex-col md:items-center justify-center gap-10 p-8">

        <p className="text-black text-xs tracking-widest uppercase flex items-center gap-2">
          <span>◆</span>
          ABOUT SHAUL AKELO
        </p>

        <p className="md:text-center text-black text-4xl md:text-5xl font-medium max-w-3xl">
          We bring architecture to life through
          craft and innovation. Trusted by
          architects who demand precision,
          beauty, and care.
        </p>

        {/* Convert this to a reusable button component */}
        <button className='w-fit px-6 py-1 bg-black text-white'>
          <span className="text-[12px] font-semibold tracking-widest">WHO I AM</span>
        </button>
      </section>

      <section className="featured-projects bg-gray-100 w-full min-h-dvh py-10 p-8">
        <div className="h-px bg-gray-300 mb-6"></div>

        <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-x-12 gap-y-8 items-start">

          <div className="text-black text-xs tracking-widest uppercase flex items-center gap-2">
            <span>◆</span>
            FEATURED PROJECTS
          </div>

          <div className="flex flex-col items-start gap-8">
            <h2 className="text-black text-4xl md:text-5xl font-medium leading-[1.05] max-w-2xl">
              Each project tells its own story of collaboration and precision.
            </h2>

            <button className='w-fit px-6 py-1 bg-black text-white'>
              <span className="text-[12px] font-semibold tracking-widest">VIEW PROJECTS</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
