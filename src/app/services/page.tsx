import type { Metadata } from "next"
import Link from "next/link"
import { services } from "@/data/services"
import Button from "@/components/ui/Button"
import SectionLabel from "@/components/ui/SectionLabel"
import { SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
    title: 'Services',
    description:
        'Web and software development, UI/UX design, and 3D environments and animation — built end to end, for brands and products that need to be shown rather than described.',
    alternates: {
        canonical: '/services',
    },
    openGraph: {
        type: 'website',
        url: '/services',
        title: 'Services — Shaul Akelo',
        description:
            'Web and software development, UI/UX design, and 3D environments and animation — built end to end, for brands and products that need to be shown rather than described.',
    },
}

// An ItemList of the three service pages. This is the hub Google crawls to find them, and it
// mirrors the visible list below rather than describing anything that isn't on the page.
const listSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${SITE_URL}/services#list`,
    itemListElement: services.map((service, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: service.name,
        url: `${SITE_URL}/services/${service.slug}`,
    })),
}

export default function ServicesPage() {
    return (
        <div className="bg-white text-black">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }}
            />

            <section className="px-5 md:px-8 pt-30 md:pt-40 pb-16 flex flex-col gap-8">
                <SectionLabel label="Services" dark />
                <h1 className="text-4xl md:text-5xl md:font-medium max-w-xs md:max-w-2xl leading-tighter">
                    What we build
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl">
                    Three disciplines, one engagement. Research, design, and engineering tailored to
                    what you actually need.
                </p>
            </section>

            <section className="px-5 md:px-8 pb-16 flex flex-col">
                {services.map((service) => (
                    <Link
                        key={service.slug}
                        href={`/services/${service.slug}`}
                        className="group flex flex-col gap-3 border-t border-black/10 py-10"
                    >
                        <h2 className="text-3xl md:text-4xl md:font-medium leading-tighter group-hover:underline underline-offset-4">
                            {service.name}
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl">{service.description}</p>
                    </Link>
                ))}
            </section>

            <section className="px-5 md:px-8 py-16 border-t border-black/10 flex flex-col gap-6">
                <h2 className="text-3xl md:text-4xl md:font-medium max-w-xl leading-tighter">
                    Not sure which one you need?
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl">
                    Most projects touch more than one. Share your idea and we&apos;ll shape it into a
                    proposal that covers the whole scope.
                </p>
                <div>
                    <Button label="GET IN TOUCH" href="/contact" />
                </div>
            </section>
        </div>
    )
}
