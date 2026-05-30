import Button from "../ui/Button";
import SectionLabel from "../ui/SectionLabel";

export default function About() {
    return (
        <section className="about h-[60vh] md:h-[80vh] w-full bg-white flex flex-col md:items-center justify-center gap-4 md:gap-10 p-5 md:p-8">
            <SectionLabel label="ABOUT SHAUL AKELO" dark />

            <p className="md:text-center text-black text-3xl md:text-5xl font-medium max-w-3xl">
            We bring architecture to life through
            craft and innovation. Trusted by
            architects who demand precision,
            beauty, and care.
            </p>

            <Button label="WHO I AM" href="/about" />
        </section>
    )
}