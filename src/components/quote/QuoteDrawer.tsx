'use client'
import { AnimatePresence, motion } from "framer-motion"
import { useLenis } from "lenis/react"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useQuote } from "./QuoteContext"
import {
    ACCEPTED_FILE_TYPES,
    MAX_FILE_BYTES,
    MAX_TOTAL_BYTES,
    budgets,
    designStatus,
    platforms,
    projectStages,
    services,
    timelines,
} from "@/data/quote"

const EASE = [0.16, 1, 0.3, 1] as const

type Status = 'idle' | 'sending' | 'sent' | 'error'

/** Selectable chip — the reference's bordered option buttons. */
function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={`border px-4 py-3 text-[11px] uppercase tracking-widest transition-colors ${
                active
                    ? 'border-black bg-black text-white'
                    : 'border-black/25 text-black hover:border-black'
            }`}
        >
            {label}
        </button>
    )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="mb-10">
            <p className="mb-4 text-[11px] uppercase tracking-widest text-black/60">{label}</p>
            {children}
        </div>
    )
}

const inputClass =
    'w-full border border-black/25 bg-transparent px-4 py-4 text-sm text-black placeholder:text-[11px] placeholder:uppercase placeholder:tracking-widest placeholder:text-black/45 focus:border-black focus:outline-none'

export default function QuoteDrawer() {
    const { open, closeQuote } = useQuote()
    const lenis = useLenis()
    const pathname = usePathname()
    const panelRef = useRef<HTMLDivElement>(null)

    const [selectedServices, setSelectedServices] = useState<string[]>([])
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
    const [stage, setStage] = useState('')
    const [design, setDesign] = useState('')
    const [budget, setBudget] = useState('')
    const [timeline, setTimeline] = useState('')
    const [files, setFiles] = useState<File[]>([])
    const [fileError, setFileError] = useState('')
    const [status, setStatus] = useState<Status>('idle')
    const [errorMsg, setErrorMsg] = useState('')

    const toggle = (list: string[], set: (v: string[]) => void, value: string) =>
        set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value])

    // Lock background scrolling while the drawer is open.
    useEffect(() => {
        if (!lenis) return
        if (open) lenis.stop()
        else lenis.start()
        return () => lenis.start()
    }, [open, lenis])

    // Close on Escape.
    useEffect(() => {
        if (!open) return
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeQuote() }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [open, closeQuote])

    // Close on route change. Render-phase reset would fight the exit animation, so this is an
    // effect — the drawer is already closed visually before the new route paints.
    const prevPath = useRef(pathname)
    useEffect(() => {
        if (prevPath.current !== pathname) {
            prevPath.current = pathname
            closeQuote()
        }
    }, [pathname, closeQuote])

    // Move focus into the panel when it opens, for keyboard and screen-reader users.
    useEffect(() => {
        if (open) panelRef.current?.focus()
    }, [open])

    const handleFiles = (list: FileList | null) => {
        if (!list) return
        const picked = Array.from(list)
        const tooBig = picked.find((f) => f.size > MAX_FILE_BYTES)
        if (tooBig) {
            setFileError(`"${tooBig.name}" is over the ${MAX_FILE_BYTES / 1024 / 1024}MB per-file limit.`)
            return
        }
        const total = picked.reduce((sum, f) => sum + f.size, 0)
        if (total > MAX_TOTAL_BYTES) {
            setFileError(`Those files total more than ${MAX_TOTAL_BYTES / 1024 / 1024}MB.`)
            return
        }
        setFileError('')
        setFiles(picked)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setStatus('sending')
        setErrorMsg('')

        const form = new FormData(e.currentTarget)
        // Chip selections live in React state, not native inputs, so append them manually.
        form.set('services', selectedServices.join(', '))
        form.set('platforms', selectedPlatforms.join(', '))
        form.set('stage', stage)
        form.set('design', design)
        form.set('budget', budget)
        form.set('timeline', timeline)

        try {
            const res = await fetch('/api/quote', { method: 'POST', body: form })
            if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                throw new Error(data.error ?? `Request failed (${res.status})`)
            }
            setStatus('sent')
        } catch (err) {
            setStatus('error')
            setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.')
        }
    }

    return (
        <AnimatePresence>
            {open && (
                <motion.aside
                    ref={panelRef}
                    tabIndex={-1}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Get a quote"
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ duration: 0.7, ease: EASE }}
                    // data-lenis-prevent is essential: Lenis is mounted at the root and swallows
                    // wheel/touch events, so without it the panel cannot scroll at all while
                    // lenis.stop() holds the page still. `overscroll-contain` then stops scroll
                    // chaining back to the page when the panel hits its end.
                    data-lenis-prevent
                    className="fixed inset-y-0 right-0 z-50 h-dvh w-full overflow-y-auto overscroll-contain bg-[#f1efea] text-black outline-none md:w-[min(1100px,78vw)]"
                >
                    {/* Close button tracks the scroll position of the panel, as in the reference. */}
                    <button
                        type="button"
                        onClick={closeQuote}
                        aria-label="Close quote form"
                        className="sticky top-6 z-10 ml-auto mr-6 flex h-12 w-12 items-center justify-center bg-neutral-900 text-white transition-colors hover:bg-black"
                    >
                        ✕
                    </button>

                    <div className="px-6 pb-24 md:px-14">
                        <header className="grid gap-6 md:grid-cols-2">
                            <h2 className="text-5xl leading-none tracking-tight md:text-6xl">Get a quote</h2>
                            <p className="max-w-sm text-sm text-black/60 md:pt-4">
                                Tell me about what you&apos;re building and I&apos;ll come back with scope,
                                timeline and a detailed proposal.
                            </p>
                        </header>

                        <div className="my-10 h-px bg-black/15" />

                        {status === 'sent' ? (
                            <div className="py-20">
                                <p className="text-3xl">Thanks — that&apos;s through.</p>
                                <p className="mt-4 max-w-md text-sm text-black/60">
                                    I&apos;ll review the details and get back to you by email, usually within
                                    two working days.
                                </p>
                                <button
                                    type="button"
                                    onClick={closeQuote}
                                    className="mt-8 bg-black px-6 py-3 text-[10px] font-semibold uppercase tracking-widest text-white"
                                >
                                    Close
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="grid gap-10 md:grid-cols-2">
                                <p className="text-2xl md:text-3xl">Tell me about your project.</p>

                                <div>
                                    <Field label="What do you need?">
                                        <div className="flex flex-wrap gap-3">
                                            {services.map((s) => (
                                                <Chip
                                                    key={s}
                                                    label={s}
                                                    active={selectedServices.includes(s)}
                                                    onClick={() => toggle(selectedServices, setSelectedServices, s)}
                                                />
                                            ))}
                                        </div>
                                    </Field>

                                    {/* Only relevant once they've asked for software. */}
                                    {selectedServices.includes('Software Development') && (
                                        <Field label="Platform">
                                            <div className="flex flex-wrap gap-3">
                                                {platforms.map((p) => (
                                                    <Chip
                                                        key={p}
                                                        label={p}
                                                        active={selectedPlatforms.includes(p)}
                                                        onClick={() => toggle(selectedPlatforms, setSelectedPlatforms, p)}
                                                    />
                                                ))}
                                            </div>
                                        </Field>
                                    )}

                                    <Field label="Where are you in the process?">
                                        <div className="flex flex-wrap gap-3">
                                            {projectStages.map((s) => (
                                                <Chip key={s} label={s} active={stage === s} onClick={() => setStage(s)} />
                                            ))}
                                        </div>
                                    </Field>

                                    <Field label="Do you have designs?">
                                        <div className="flex flex-wrap gap-3">
                                            {designStatus.map((d) => (
                                                <Chip key={d} label={d} active={design === d} onClick={() => setDesign(d)} />
                                            ))}
                                        </div>
                                    </Field>

                                    <Field label="Tell me what you're building *">
                                        <textarea
                                            name="brief"
                                            required
                                            rows={6}
                                            className={inputClass}
                                            placeholder="Goals, users, features, anything already decided"
                                        />
                                    </Field>

                                    <Field label="Budget">
                                        <div className="flex flex-wrap gap-3">
                                            {budgets.map((b) => (
                                                <Chip key={b} label={b} active={budget === b} onClick={() => setBudget(b)} />
                                            ))}
                                        </div>
                                    </Field>

                                    <Field label="Timeline">
                                        <div className="flex flex-wrap gap-3">
                                            {timelines.map((t) => (
                                                <Chip key={t} label={t} active={timeline === t} onClick={() => setTimeline(t)} />
                                            ))}
                                        </div>
                                    </Field>

                                    <Field label="Links">
                                        <input
                                            name="links"
                                            className={inputClass}
                                            placeholder="Figma, repo, existing site, references"
                                        />
                                    </Field>

                                    <Field label="Attachments">
                                        {/* `file:` targets ::file-selector-button — the native
                                            "Choose Files" control, which is otherwise unstyleable.
                                            Given a border matching the option chips, filling on
                                            hover so it reads as a button. */}
                                        <div className="border border-dashed border-black/30 p-6 transition-colors hover:border-black/60">
                                            <input
                                                type="file"
                                                name="files"
                                                multiple
                                                accept={ACCEPTED_FILE_TYPES}
                                                onChange={(e) => handleFiles(e.target.files)}
                                                className="w-full cursor-pointer text-sm text-black/60
                                                    file:mr-4 file:cursor-pointer file:border file:border-black/30
                                                    file:bg-transparent file:px-4 file:py-2 file:text-[11px]
                                                    file:uppercase file:tracking-widest file:text-black
                                                    file:transition-colors
                                                    hover:file:border-black hover:file:bg-black hover:file:text-white"
                                            />
                                        </div>
                                        <p className="mt-3 text-[11px] uppercase tracking-widest text-black/45">
                                            Max {MAX_FILE_BYTES / 1024 / 1024}MB per file, {MAX_TOTAL_BYTES / 1024 / 1024}MB total.
                                            Accepted: {ACCEPTED_FILE_TYPES.replaceAll(',', ', ')}
                                        </p>
                                        {fileError && <p className="mt-2 text-xs text-red-700">{fileError}</p>}
                                        {files.length > 0 && !fileError && (
                                            <p className="mt-2 text-xs text-black/60">{files.length} file(s) attached</p>
                                        )}
                                    </Field>
                                </div>

                                <div className="mt-6 h-px bg-black/15 md:col-span-2" />

                                <p className="text-2xl md:text-3xl">Tell me about you.</p>

                                <div>
                                    <div className="grid gap-4">
                                        <input name="fullName" required className={inputClass} placeholder="Full name *" />
                                        <input name="company" className={inputClass} placeholder="Company" />
                                        <input name="email" type="email" required className={inputClass} placeholder="Email address *" />
                                        <input name="phone" className={inputClass} placeholder="Phone number" />
                                        <input name="location" className={inputClass} placeholder="Location" />
                                    </div>

                                    {status === 'error' && (
                                        <p className="mt-6 text-sm text-red-700">{errorMsg}</p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={status === 'sending'}
                                        className="mt-8 bg-black px-8 py-4 text-[10px] font-semibold uppercase tracking-widest text-white transition-opacity disabled:opacity-50"
                                    >
                                        {status === 'sending' ? 'Sending…' : 'Submit'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </motion.aside>
            )}
        </AnimatePresence>
    )
}
