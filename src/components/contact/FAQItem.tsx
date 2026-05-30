'use client'
import { FAQ } from "@/data/FAQs"
import { gsap } from "@/lib/gsap"
import { useRef, useState, useEffect } from "react"
import { FiPlus } from "react-icons/fi"

interface FAQItemProps{
    faq: FAQ
    isOpen: boolean
    onToggle: () => void
}

export default function FAQItem({ faq, isOpen, onToggle }: FAQItemProps) {
    const contentRef = useRef<HTMLDivElement | null>(null)
    
    useEffect(() =>{
        if (!contentRef.current) return

        if (isOpen){
            gsap.set(contentRef.current, {height: "auto"})
            gsap.from(contentRef.current, {
                height: 0,
                duration: 0.5,
                ease: 'power3.inOut'
            })
        } else {
            gsap.to(contentRef.current, {
                height: 0,
                duration: 0.5,
                ease: 'power3.inOut'
            })
        }

    }, [isOpen])

    return (
        <div className="border-b border-gray-300">
            <button 
            className="w-full flex items-center max-w-xs md:max-w-none justify-between py-6"
            onClick={onToggle}
            >
                <span className="font-bold text-start text-sm">{faq.question}</span>
                <FiPlus className={`transition-transform ${isOpen ? "rotate-45" : ""}`}/>
            </button>
            <div className="overflow-hidden h-0" ref={contentRef}>
                <p className=" pb-3">
                    {faq.answer}
                </p>
            </div>
        </div>
    )
}