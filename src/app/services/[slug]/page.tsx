import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { services, getService } from "@/data/services"
import { caseStudyProjects } from "@/data/projects"
import Button from "@/components/ui/Button"
import SectionLabel from "@/components/ui/SectionLabel"
import { SITE_URL, SITE_NAME } from "@/lib/site"

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
    return services.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const service = getService(slug)

    if (!service) {
        return { title: 'Service not found', robots: { index: false, follow: false } }
    }

    return {
        title: service.name,
        description: service.description,
        alternates: {
            canonical: `/services/${service.slug}`,
        },
        openGraph: {
            type: 'website',
            url: `/services/${service.slug}`,
            title: `${service.name} — ${SITE_NAME}`,
            description: service.description,
        },
    }
}

export default async function ServicePage({ params }: Props) {
    const { slug } = await params
    const service = getService(slug)
    if (!service) notFound()

    const related = caseStudyProjects.filter((p) => service.relatedProjects.includes(p.slug))

    // `Service` schema describes what is offered, distinct from the `Person`/`Organization` pair in
    // the root layout — `provider` points back at the organisation by @id so Google reads them as
    // one entity offering three services, not three unrelated things.
    const serviceSchema = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        '@id': `${SITE_URL}/services/${service.slug}#service`,
        name: service.name,
        description: service.description,
        serviceType: service.name,
        provider: { '@id': `${SITE_URL}/#organization` },
        areaServed: 'Worldwide',
        url: `${SITE_URL}/services/${service.slug}`,
        hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: `${service.name} — what's included`,
            itemListElement: service.includes.map((item) => ({
                '@type': 'Offer',
                itemOffered: { '@type': 'Service', name: item },
            })),
        },
    }

    return (
        <div className="bg-white text-black">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
            />

            <section className="px-5 md:px-8 pt-30 md:pt-40 pb-16 flex flex-col gap-8">
                <nav aria-label="Breadcrumb">
                    <ol className="flex flex-row items-center gap-6 text-xs font-bold tracking-widest uppercase">
                        <li>
                            <Link href="/services" className="text-black/60 transition-colors hover:text-black">
                                Services
                            </Link>
                        </li>
                        <li>
                            <span aria-current="page" className="underline underline-offset-4">
                                {service.name}
                            </span>
                        </li>
                    </ol>
                </nav>

                <h1 className="text-4xl md:text-5xl md:font-medium max-w-xs md:max-w-2xl leading-tighter">
                    {service.name}
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl">{service.tagline}</p>

                <div className="flex gap-8 items-start">
                    <Button label="GET A QUOTE" href="/contact" />
                    <Button label="SEE THE WORK" href="/projects" outline textColor="text-black" />
                </div>
            </section>

            <section className="px-5 md:px-8 py-16 border-t border-black/10 flex flex-col gap-8">
                <SectionLabel label="What's included" dark />
                <ul className="flex flex-col gap-4 max-w-2xl">
                    {service.includes.map((item) => (
                        <li key={item} className="text-xl border-b border-black/10 pb-4">
                            {item}
                        </li>
                    ))}
                </ul>
            </section>

            {service.sections.map((section) => (
                <section
                    key={section.heading}
                    className="px-5 md:px-8 py-16 border-t border-black/10 flex flex-col gap-6"
                >
                    <h2 className="text-3xl md:text-4xl md:font-medium max-w-xl leading-tighter">
                        {section.heading}
                    </h2>
                    <p className="text-lg text-gray-600 max-w-3xl">{section.body}</p>
                </section>
            ))}

            {related.length > 0 && (
                <section className="px-5 md:px-8 py-16 border-t border-black/10 flex flex-col gap-8">
                    <SectionLabel label="Related work" dark />
                    <div className="flex flex-col gap-6">
                        {related.map((project) => (
                            <Link
                                key={project.slug}
                                href={`/case/${project.slug}`}
                                className="group flex flex-col gap-2 border-b border-black/10 pb-6"
                            >
                                <h2 className="text-2xl md:text-3xl group-hover:underline underline-offset-4">
                                    {project.name}
                                </h2>
                                <p className="text-gray-600 max-w-3xl">{project.description}</p>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            <section className="px-5 md:px-8 py-16 border-t border-black/10 flex flex-col gap-6">
                <h2 className="text-3xl md:text-4xl md:font-medium max-w-xl leading-tighter">
                    Start a {service.name.toLowerCase()} project
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl">
                    Share your idea with as much detail as you have, and we&apos;ll translate it into a
                    precise, tailored proposal that reflects your goals.
                </p>
                <div>
                    <Button label="GET IN TOUCH" href="/contact" />
                </div>
            </section>
        </div>
    )
}
