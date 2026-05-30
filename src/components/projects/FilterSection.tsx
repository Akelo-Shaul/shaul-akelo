import { CiSearch } from "react-icons/ci";
import { LuChevronsUpDown } from "react-icons/lu";
import { TbArrowsShuffle } from "react-icons/tb";

export default function FilterSection() {
    return (
        <div className="flex flex-col md:flex-row md:text-lg max-w-4xl gap-4 p-2 md:px-8">
            <div className="flex-2 flex items-center border border-white p-2 gap-3">
                <CiSearch  size={24}/>
                <p>Search 0 projects</p>
            </div>

            <div className="flex justify-between gap-4">
                    
                <div className="flex flex-1 items-center justify-between border border-white p-2 gap-3">
                    <p>Filter by platform</p>
                    <LuChevronsUpDown size={24} />
                </div>
                <div className="flex items-center border border-white bg-white text-black hover:bg-black hover:text-white p-2 gap-3">
                    <TbArrowsShuffle size={24}/>
                    <p>Randomize</p>
                </div>
            </div>
        </div>
    )
}