/**
 * The three things the studio sells, as pages someone can land on with hiring intent.
 *
 * Case studies rank for *projects* ("pizza app case study"); these rank for *hiring* ("3d
 * animation for brands"). They are different queries from different people at different stages,
 * which is why both exist.
 *
 * The copy here is drafted from what the site already claims elsewhere — the manifesto, the FAQs,
 * and the project descriptions — rather than inventing new promises. Edit freely: this is
 * marketing copy, and it should sound like you.
 */

export type ServiceSection = {
    heading: string
    body: string
}

export type Service = {
    slug: string
    /** Page headline and the name used in schema. */
    name: string
    /** One line under the headline. */
    tagline: string
    /** Meta description, and the schema `description`. Keep to ~155 characters. */
    description: string
    /** What the engagement actually includes — the scannable list. */
    includes: string[]
    /** Longer prose blocks. Each becomes an h2 plus a paragraph. */
    sections: ServiceSection[]
    /** Case-study slugs that demonstrate this service. Drives the "related work" links. */
    relatedProjects: string[]
}

export const services: Service[] = [
    {
        slug: 'web-development',
        name: 'Web & Software Development',
        tagline: 'Sites and systems built to hold up under real use.',
        description:
            'Custom web and software development — marketing sites, web apps, and mobile builds, engineered for performance and shipped end to end.',
        includes: [
            'Marketing sites and landing pages',
            'Web applications and dashboards',
            'Mobile applications, shipped to the store',
            'API and backend architecture',
            'Performance, accessibility, and SEO groundwork',
        ],
        sections: [
            {
                heading: 'What you get',
                body: 'A build that is fast on real devices and real connections, structured so the next person to touch it can. We work from research and design through engineering to delivery, and the handover includes the reasoning, not just the repository.',
            },
            {
                heading: 'How we work',
                body: 'Every phase carries the same intent: understand before we create, refine before we build, and craft with care that lasts. That means the scope is agreed before code is written, and you see progress as it happens rather than at the end.',
            },
            {
                heading: 'Who this is for',
                body: 'Founders shaping a first product, and established teams that need reliable systems at scale. If you already have a clear concept, we can skip the discovery phase and quote directly from your scope.',
            },
        ],
        relatedProjects: ['mazemob'],
    },
    {
        slug: 'ui-ux-design',
        name: 'UI/UX Design',
        tagline: 'Interfaces people move through without thinking about them.',
        description:
            'UI/UX design grounded in research and prototyping — user flows, interface design, and design systems that reduce friction and get built.',
        includes: [
            'User research and journey mapping',
            'Wireframes and interactive prototypes',
            'Interface design and visual systems',
            'Design systems and component libraries',
            'Usability testing and iteration',
        ],
        sections: [
            {
                heading: 'What you get',
                body: 'Designs that survive contact with engineering, because they are built with how they will be implemented in mind. You get the flows, the screens, and the reasoning behind each decision — not a folder of unconnected mockups.',
            },
            {
                heading: 'How we work',
                body: 'We map the full journey first, then prototype each interaction to minimise taps and cognitive load. Testing with real users guides the refinements, so choices are settled by evidence rather than opinion.',
            },
            {
                heading: 'Who this is for',
                body: 'Teams with a product that works but feels harder to use than it should, and teams starting something new who want the structure right before the build begins.',
            },
        ],
        relatedProjects: ['pizza-app'],
    },
    {
        slug: '3d-animation',
        name: '3D Environments & Animation',
        tagline: 'Real-time 3D and motion work for brand and product awareness.',
        description:
            'Explorable 3D environments and animation for the web — modelled in Blender, rendered in the browser with React Three Fiber, and tuned to load fast.',
        includes: [
            'Real-time 3D environments in the browser',
            'Product and architectural visualisation',
            'Motion graphics and brand reveal sequences',
            'Blender modelling, lighting, and rendering',
            'Performance optimisation for web delivery',
        ],
        sections: [
            {
                heading: 'What you get',
                body: 'Interactive 3D that runs in a browser tab rather than a download — modelled in Blender and delivered with React Three Fiber. Assets are optimised so the experience holds its frame rate away from a high-end desktop.',
            },
            {
                heading: 'How we work',
                body: 'The scene is built for the story it needs to tell, then reduced until it loads quickly without visibly losing fidelity. That optimisation pass is the difference between a demo and something you can put in front of customers.',
            },
            {
                heading: 'Who this is for',
                body: 'Brands and products that need to be shown rather than described — where letting someone move through a space communicates more than a page of copy.',
            },
        ],
        relatedProjects: ['room'],
    },
]

export function getService(slug: string): Service | undefined {
    return services.find((s) => s.slug === slug)
}
