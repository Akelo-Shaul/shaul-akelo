'use client'
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { getFooterImage, navLinks } from "@/data/navigation"
import { useLoader } from "./LoaderContext"

const socials = [
  { label: "Instagram", href: "https://www.instagram.com/official_shaul_/" },
  { label: "YouTube",   href: "https://www.youtube.com/@shaulakelo" },
  { label: "LinkedIn",  href: "https://www.linkedin.com/in/shaul-akelo/" },
  { label: "X",         href: "https://x.com/AkeloShaul21681" },
]

const legal = [
  { label: "Privacy policy",     href: "" },
  { label: "Terms & conditions", href: "" },
]

export default function Footer() {
  const pathname = usePathname()
  const { transitioning } = useLoader()
  const image = getFooterImage(pathname)

  return (
    // Sticky at the bottom, behind the page content (z-0). The content scrolls up off it so
    // the footer stays still and is "revealed". Hidden while a page transition animates —
    // during a transition the page layers go position:fixed, which would let this fill the
    // viewport and bleed through the transition's clip.
    <footer
      className={`sticky bottom-0 z-0 flex h-screen w-full flex-col justify-end overflow-hidden text-white ${
        transitioning ? "invisible" : "visible"
      }`}
    >
      {/* Per-page background image */}
      <div className="absolute inset-0">
        <Image
          key={image}
          src={image}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      {/* Legibility overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Oversized, faded wordmark spanning the full width above the footer row */}
      <div className="relative z-10 w-full overflow-hidden">
        <p className="select-none whitespace-nowrap text-center font-medium leading-[1.5] tracking-tight text-white/10 text-[19vw]">
          Shaul Akelo
        </p>
      </div>

      {/* Page links. These are the site's only server-rendered internal navigation: navLinks
          otherwise feeds the BottomNav menu, which is closed by default and so contributes no
          crawlable links. Without this row /services would be reachable only from the sitemap,
          which is a weak discovery signal on its own. */}
      <nav aria-label="Footer" className="relative z-10 w-full px-5 md:px-8 pb-4">
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs uppercase tracking-widest">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="opacity-70 transition-opacity hover:opacity-100"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom row: copyright · socials · legal */}
      <div className="relative z-10 w-full px-5 md:px-8 pb-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between text-xs uppercase tracking-widest">
          {/* left: copyright + socials. On mobile the copyright gets its own line and the socials
              sit together on the next, so they can't break mid-list into a ragged block. From md up
              they're all inline siblings again, matching the original single-row layout. */}
          <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:gap-x-6 md:gap-y-2">
            <span>©{new Date().getFullYear()}, Shaul Akelo</span>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {socials.map((s) => (
                <Link
                  key={s.label}
                  href={s.href || "#"}
                  target={s.href ? "_blank" : undefined}
                  rel={s.href ? "noopener noreferrer" : undefined}
                  className="opacity-70 transition-opacity hover:opacity-100"
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </div>

          {/* right: legal — same mobile treatment, so the links stay on one row and the
              "Crafted by" credit drops below instead of wrapping into them. */}
          <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:gap-x-6 md:gap-y-2">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {legal.map((l) => (
                <Link key={l.label} href={l.href || "#"} className="opacity-70 transition-opacity hover:opacity-100">
                  {l.label}
                </Link>
              ))}
            </div>
            <span className="flex items-center gap-2 opacity-70">
              Crafted by
              <a
                href="https://github.com/Akelo-Shaul"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Shaul on GitHub"
                className="transition-opacity hover:opacity-100"
              >
                <Image
                  src="/shaul.gif"
                  alt="Shaul"
                  width={1000}
                  height={1000}
                  unoptimized
                  className="h-6 w-6 object-contain"
                />
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
