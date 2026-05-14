import Link from "next/link"

type Props = {
    label: string
    href?: string
    outline?: boolean
    onClick?: () => void
}

export default function Button({ label, href, outline, onClick }: Props) {
    const classes = outline
        ? "px-6 py-3 text-white rounded-full border border-white/30"
        : "w-fit px-6 py-1 bg-black text-white"

    const inner = (
        <span className="text-[12px] font-semibold tracking-widest">{label}</span>
    )

    if (href) {
        return <Link href={href} className={classes}>{inner}</Link>
    }

    return <button className={classes} onClick={onClick}>{inner}</button>
}