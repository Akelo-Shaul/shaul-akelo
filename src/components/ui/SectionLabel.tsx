type Props = {
    label: string
    dark?: boolean
}

export default function SectionLabel({ label, dark = false}: Props) {
    return (
        <p className={`text-xs font-bold tracking-widest uppercase flex items-center gap-2 ${dark ? 'text-black' : 'text-white'}`}>
            <span className={dark ? "text-black" : "text-amber-400"}>◆</span>
            {label}
        </p>
    )
}
