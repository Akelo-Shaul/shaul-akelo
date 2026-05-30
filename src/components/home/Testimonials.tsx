import Image from "next/image";
import SectionLabel from "../ui/SectionLabel";
import { useEffect, useRef, useState } from "react";
import { testimonials } from "@/data/testimonials";
import { gsap } from "@/lib/gsap";

export default function Testimonials() {

    const [index, setIndex] = useState(0)
    const total = testimonials.length
    const current = testimonials[index]
    const contentRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (!contentRef.current) return
        gsap.fromTo(
            contentRef.current,
            { opacity: 0, y:12 },
            { opacity: 1, y:0, duration:0.5, ease: 'power2.out' }
        )
    }, [index])

    const next = () => setIndex((i) => (i + 1) % total)
    const prev = () => setIndex((i) => (i - 1 + total) % total)
    const pad = (n: number) => n.toString().padStart(2, '0')

    return (
        <section className="client-stories w-full min-w-0 max-w-full overflow-hidden bg-white p-5 md:p-8">

            {/* Header section */}

            <div className="flex items-center gap-6 md:gap-12 mb-8 md:mb-12 pt-3 md:pt-0 border-t border-gray-300">
                <div className="md:w-40 md:flex-shrink-0">
                    <SectionLabel label="CLIENT STORIES" dark />
                </div>

                <div className="hidden md:flex items-center md:gap-6">
                    <span aria-hidden className="invisible text-6xl font-bold leading-none">&ldquo;</span>
                    <span className="text-sm text-black/50 tracking-widest">
                        {pad(index + 1)}/{pad(total)}
                    </span>
                </div>

                <div className="flex gap-2 ml-auto">
                    <button 
                        type="button"
                        onClick={prev}
                        aria-label="Previous Testimonial"
                        className="flex h-10 w-10 items-center justify-center border border-black/30 text-black hover:bg-black hover:text-white transition-colors"
                    >
                        <span aria-hidden>←</span>
                    </button>
                    <button 
                        type="button"
                        onClick={next}
                        aria-label="Next Testimonial"
                        className="flex h-10 w-10 items-center justify-center border border-black/30 text-black hover:bg-black hover:text-white transition-colors"
                    >
                        <span aria-hidden>
                            →
                        </span>
                    </button>
                </div>               
            </div>

            {/* Content section */}
            <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-12">
                <div className="hidden md:block flex-shrink-0 w-40 h-48 relative grayscale">
                    <Image
                        src={current.photo}
                        alt={current.name}
                        fill
                        sizes="(min-width: 768px) 20vw, 33vw"
                        className="object-cover"
                    />
                </div>

                <div className="flex flex-col gap-4 md:gap-6 min-w-0 w-full">
                    <div className="flex flex-col md:flex-row md:gap-6 min-w-0">
                        <span className="text-6xl font-bold text-black leading-none">&ldquo;</span>

                        <p className="text-black text-4xl md:text-5xl font-medium leading-9 md:leading-tight max-w-4xl break-words">
                            {current.quote}
                        </p>
                    </div>

                    <div className="flex flex-row items-center gap-8 mt-2 md:mt-4 md:ml-15">
                        <div className="md:hidden w-16 h-16 relative flex-shrink-0 grayscale">
                            <Image
                                src={current.photo}
                                alt={current.name}
                                fill
                                sizes="(max-width: 768px) 10vw, 10vw"
                                className="object-cover"
                            />
                        </div>

                        <div className="flex flex-col min-w-0 gap-2">
                            <p className="text-black text-2xl truncate">
                                {current.name}
                            </p>

                            <p className="text-black/50 text-xs uppercase truncate">
                                {current.role}
                            </p>
                        </div>

                    </div>
                </div>
            </div>

        </section>
    )
}