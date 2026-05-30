'use client'

import { faqs } from "@/data/FAQs";
import SectionLabel from "../ui/SectionLabel";
import FAQItem from "./FAQItem";
import { useState } from "react";

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    const handleToggle = (index: number) => {
        setOpenIndex (prev => prev === index ? null : index)
    }

    return (
        <section className="border-t border-gray-300 text-black py-4 mx-5 md:mx-8">
            <SectionLabel label="FAQ" dark/>
            <div className="flex flex-col md:flex-row py-2 items-start my-10 md:my-20 gap-8">
                <div className="flex flex-1">
                    <p className="text-3xl md:text-4xl md:font-medium  max-w-xs leading-tighter">The questions with honest answers</p>
                </div>
                <div className="flex flex-1 flex-col border-t border-gray-300">
                    {faqs.map((faq,i) =>
                        <FAQItem 
                            faq={faq} 
                            isOpen={openIndex == i}
                            onToggle={() => handleToggle(i)}
                            key={faq.question}/>
                    )}
                </div>

            </div>

        </section>
    )
}