import Image from "next/image";
import SectionLabel from "../ui/SectionLabel";

export default function ContactInfo() {
    return (
        <section className="bg-white mb-15 pt-30 md:py-40 p-5 md:p-8">
            <div className="flex flex-col gap-8 my-10">
                <SectionLabel label="CONTACT" dark/>
                <p className="text-black text-4xl md:text-5xl md:font-medium  max-w-xs md:max-w-xl leading-tighter">Every great build begins with understanding</p>
            </div>

            <div className="md:my-20 flex  flex-col md:flex-row text-black border-t border-gray-300 pt-4 gap-8">
                <div className="flex-1">
                    <SectionLabel label="GET IN TOUCH" dark/>
                </div>
                <div className="flex flex-col md:flex-row flex-1 gap-4">
                    <div className="flex-1">
                        <p>Talk To Us</p>
                        <p>+254 115 089 122</p>
                    </div>
                    <div className="flex-1">
                        <p>Write Us</p>
                        <p>shaulakelo@gmail.com</p>
                    </div>
                </div>

            </div>

            <div className="my-8 md:my-20 flex flex-col md:flex-row text-black border-t border-gray-300 pt-4 gap-8">
                <div className="flex-1">
                    <SectionLabel label="ADDRESS" dark/>
                </div>
                <div className="flex flex-col md:flex-row flex-1 gap-4">
                    <div className="flex-1">
                        <p>Talk To Us</p>
                        <p>+254 115 089 122</p>
                    </div>
                    <div className="flex-1">
                        <p>Visit Us</p>
                        <p>BOOK A VISIT</p>
                    </div>
                </div>

            </div>

            <div className="flex flex-col-reverse md:flex-row text-black items-center justify-center md:p-10 gap-10">
                <div className="flex items-end flex-col gap-10 md:gap-20">
                    <h3 className="text-3xl md:text-5xl max-w-xl font-medium text-gray-900">Share your ideas, and we’ll
                        shape them into a detailed
                        proposal that reflects your
                        goals with precision and
                        care.</h3>
                    <div className="flex flex-col gap-3 max-w-none md:max-w-xs md:mr-30">
                        <SectionLabel label="Have a clear vision in mind?" dark/>
                        <p className="md:text-sm text-gray-600 mt-2">If you already have a concept or clear idea for your glazing project, you can request a tailored quote right away. Simply fill in the form with as much detail as possible—our team will translate your vision into a precise proposal that fits your needs.</p>
                    </div>
                </div>

                <Image src="/cover.png" alt="Contact Image " width={700} height={300}/>
            </div>
        </section>
    )
}