import Button from "../ui/Button";
import SectionLabel from "../ui/SectionLabel";

export default function CTA() {
    return(
        <div className="flex flex-col bg-gray-100 gap-8 p-5 md:p-8 h-[50vh] md:h-[80vh] justify-center">
            <SectionLabel label="WHERE VISION MEETS EXECUTION" dark />
            <p className="text-black text-4xl md:text-5xl md:font-medium  max-w-xs md:max-w-xl leading-tighter">Every great build begins with understanding</p>
            <div className="flex gap-8 items-start">
                <Button label="OUR APPROACH" href="" outline textColor="text-black" />
                <Button label="GET IN TOUCH" href="" />
            </div>
        </div>
    )
}