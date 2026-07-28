'use client'
import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLoader } from "./LoaderContext"
import Button from "../ui/Button"

// Routes whose top section has a light background — the header needs dark text there.
const lightRoutes = ["/about", "/contact"]

export default function Header() {
  const { introDone } = useLoader()
  const pathname = usePathname()
  const onLight = lightRoutes.includes(pathname)

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: introDone ? 1 : 0, y: introDone ? 0 : -16 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`absolute inset-x-0 top-0 z-30 flex items-center px-5 pt-5 md:px-8 ${
        onLight ? "text-black" : "text-white"
      }`}
    >
      {/* spacer keeps the title centered on desktop */}
      <div className="hidden flex-1 md:block" />

      <div className="flex flex-1 justify-center">
        <Link href="/" className="text-xl md:text-2xl">
          Shaul Akelo
        </Link>
      </div>

      <div className="hidden flex-1 justify-end md:flex">
        <Button
          label="Get a Quote"
          href="/contact"
          outline
          textColor={onLight ? "text-black" : "text-white"}
        />
      </div>
    </motion.header>
  )
}
