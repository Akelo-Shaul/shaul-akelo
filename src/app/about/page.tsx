'use client'
import Hero from "@/components/about/Hero";
import Manifesto from "@/components/about/Manifesto";
import CTA from "@/components/home/CTA";
import Testimonials from "@/components/home/Testimonials";

export default function AboutPage() {
    return(
        <div className="bg-white">
            <Hero />
            <Manifesto />
            {/* Find another section to add here. */}
            <Testimonials />
            <CTA />
        </div>
    )
}