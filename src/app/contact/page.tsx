import type { Metadata } from "next";
import ContactInfo from "@/components/contact/ContactInfo";
import FAQ from "@/components/contact/FAQ";
import { faqs } from "@/data/FAQs";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
    title: 'Contact',
    description:
        'Get in touch with Shaul Akelo about a website, 3D environment, or animation project. Request a tailored quote, or book a consultation.',
    alternates: {
        canonical: '/contact',
    },
    openGraph: {
        type: 'website',
        url: '/contact',
        title: 'Contact — Shaul Akelo',
        description:
            'Get in touch with Shaul Akelo about a website, 3D environment, or animation project. Request a tailored quote, or book a consultation.',
    },
}

// Built from the same `faqs` array the FAQ component renders, so the structured data can never drift
// from the visible answers — Google discounts FAQ markup that isn't present on the page.
const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${SITE_URL}/contact#faq`,
    mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
        },
    })),
}

export default function ContactPage() {
    return (
        <div className="bg-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <ContactInfo />
            <FAQ />
        </div>
    )
}
