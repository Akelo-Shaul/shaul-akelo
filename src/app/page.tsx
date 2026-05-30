'use client'
import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import FeatureProjects from "@/components/home/FeatureProjects";
import Testimonials from "@/components/home/Testimonials";
import CTA from "@/components/home/CTA";


export default function Home() {

  return (
    <div className="w-full flex flex-col relative bg-black">
      <Hero />
      <About />
      <FeatureProjects />
      <Testimonials />
      <CTA />
    </div>
  );
}
