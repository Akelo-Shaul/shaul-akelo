import Button from "../ui/Button";
import SectionLabel from "../ui/SectionLabel";
import Image from "next/image";

export default function Hero() {
    return (
        <section className="flex flex-col about h-[80vh] md:h-[130vh] w-full gap-10 bg-white justify-end items-center p-5 md:p-8">
            <div className="flex flex-col  gap-5 items-center">
                <SectionLabel label="ABOUT SHAUL AKELO" dark />

                <p className="text-center text-black text-4xl md:text-5xl font-medium max-w-xl">
                Passionately shaping code
                into timeless design
                </p>
            </div>
            <div className="relative w-full h-[200px] md:h-[500px] mb-10">
                <Image src="/tech.jpg" alt="" fill className="object-cover" />
            </div>

        </section>
    )
}