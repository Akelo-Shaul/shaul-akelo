import Link from "next/link"

type Props = {
    label: string
    href?: string
    outline?: boolean
    textColor?: string
    onClick?: () => void
    external?: boolean   // open the href in a new tab (for off-site links)
}

export default function Button({ label, href, outline, textColor = "text-white", onClick, external }: Props) {
    const classes = `w-fit px-6 py-1  ${textColor} ${outline ? null : 'bg-black'}`


    const inner = (
        <span className="text-[10px] font-semibold uppercase tracking-widest">{label}</span>
    )

    if (href) {
        return (
            <Link
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className={classes}
            >
                {inner}
            </Link>
        )
    }

    return <button className={classes} onClick={onClick}>{inner}</button>
}