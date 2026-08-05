export type SoftwareSubCategory = 'mobile' | 'web' | 'desktop' | 'iot'

export type UIUXSection =
  | { type: 'problem';         body: string }
  | { type: 'solution';        body: string }
  | { type: 'myRole';          body: string }
  | { type: 'designApproach';  body: string; image?: string }
  | { type: 'screen';          name: string; description: string; image?: string }
  | { type: 'result';          body: string }

export type Project = {
    slug: string
    name: string
    category: string
    description: string
    tags: string[]
    image?: string
    images?: string[]
    icon?: 'monitor' | 'globe' | 'fileText' | 'layers'
    subCategory?: SoftwareSubCategory
    sections?: UIUXSection[]   // only used by UI/UX projects
    website?: string           // live site — shows a "Visit Site" button when set
    playstore?: string         // Play Store listing — shows an "Open in Play Store" button
    sourceCode?: string        // public repo — shows a "View Code" button when set
}

export type ProjectLink = { label: string; href: string }

// Every external link a project card should surface, in display order.
// A project can have any combination — all three render side by side.
export function getProjectLinks(project: Project): ProjectLink[] {
    const links: ProjectLink[] = []
    if (project.playstore)  links.push({ label: 'Play Store',         href: project.playstore })
    if (project.website)    links.push({ label: 'Visit Site',         href: project.website })
    if (project.sourceCode) links.push({ label: 'View Code',          href: project.sourceCode })
    return links
}

// Single primary link, for surfaces that only have room for one (website preferred, else Play Store).
export function getProjectLink(project: Project): string | undefined {
    return project.website || project.playstore
}

export const softwareProjects: Project[] = [
  {
    slug: 'mazemob',
    name: 'MazeMob',
    category: 'Software',
    subCategory: 'mobile',
    description: 'A published Android maze game — procedurally generated levels, touch-first controls, and a lightweight ad-supported build shipped end to end on Google Play.',
    tags: ['ANDROID', 'GAME DEVELOPMENT', 'GOOGLE PLAY'],
    icon: 'monitor',
    image: 'https://res.cloudinary.com/ddtzd3o9n/image/upload/v1785231263/maze_ksuh5g.png',
    playstore: 'https://play.google.com/store/apps/details?id=com.shaulakelo.mazemob',
  },
  // Placeholder projects — kept for reference, uncomment to restore.
  // {
  //   slug: 'ashmead-barn',
  //   name: 'Ashmead Barn',
  //   category: 'Software',
  //   subCategory: 'mobile',
  //   description: 'A modular software platform for managing modern construction workflows, with bespoke dashboards and collaborative tools.',
  //   tags: ['PROJECT TRACKING', 'CUSTOM WORKFLOWS', 'CLIENT PORTAL'],
  //   icon: 'monitor',
  //   image: '/projects/ashmead.jpg',
  // },
  // {
  //   slug: 'sea-breeze',
  //   name: 'Sea Breeze',
  //   category: 'Software',
  //   subCategory: 'web',
  //   description: 'A responsive web app for dynamic lighting and environment control across residential and commercial properties.',
  //   tags: ['REAL-TIME ANALYTICS', 'SMART UI', 'API INTEGRATION'],
  //   icon: 'globe',
  //   image: '/projects/seabreeze.jpg',
  // },
  // {
  //   slug: 'rusty-house',
  //   name: 'Rusty House',
  //   category: 'Software',
  //   subCategory: 'desktop',
  //   description: 'An engineering dashboard that visualizes custom glazing performance data and automates maintenance workflows.',
  //   tags: ['DATA VISUALIZATION', 'AUTOMATION', 'SAFETY METRICS'],
  //   icon: 'fileText',
  //   image: '/projects/rusty.jpg',
  // },
  // {
  //   slug: 'kensington',
  //   name: 'Kensington',
  //   category: 'Software',
  //   subCategory: 'iot',
  //   description: 'A high-end client experience platform for specification, approvals, and custom fabrication tracking.',
  //   tags: ['CLIENT ONBOARDING', 'DOCUMENT MANAGEMENT', 'REAL-TIME UPDATES'],
  //   icon: 'layers',
  //   image: '/projects/kensington.jpg',
  // },
]

export const uiuxProjects: Project[] = [
  {
    slug: 'pizza-app',
    name: 'Pizza App',
    category: 'UI/UX',
    description: 'A mouth-watering mobile ordering experience that turns pizza customization into a fast, playful, and frictionless journey from craving to checkout.',
    tags: ['MOBILE ORDERING', 'UI DESIGN', 'PROTOTYPING'],
    image: 'https://res.cloudinary.com/ddtzd3o9n/image/upload/v1785075688/pizza_oazrkp.png',
    sections: [
      { type: 'problem',  body: 'Ordering pizza online often meant navigating cluttered menus, confusing customization options, and lengthy checkout forms. Customers abandoned orders midway due to unclear pricing, slow flows, and a lack of visual feedback about what they were actually building.' },
      { type: 'solution', body: 'Slice Order Flow reimagines mobile pizza ordering around speed and delight. A visual builder lets users assemble their pie tap-by-tap with live pricing, while a streamlined single-screen checkout removes friction. Playful micro-interactions keep the experience appetizing from first tap to confirmation.' },
      { type: 'designApproach', body: 'We mapped the full craving-to-checkout journey, prototyping each interaction to minimize taps and cognitive load. Real-time visual feedback shows the pizza taking shape as choices are made, and progressive disclosure keeps advanced options out of the way until needed. Usability testing with hungry users guided every refinement.', image: 'https://res.cloudinary.com/ddtzd3o9n/image/upload/v1785077265/pizzaonboarding_jc0a12.png' },
      { type: 'screen', name: 'Pizza Builder', description: 'An interactive, visual customization screen where users add crusts, sauces, and toppings with instant preview and live price updates. Smart defaults and popular combos help first-time users decide quickly.', image: 'https://res.cloudinary.com/ddtzd3o9n/image/upload/v1785077266/pizzaui_lcni4c.png' },
      { type: 'screen', name: 'Express Checkout', description: 'A single-screen checkout with saved addresses, one-tap payment, and clear delivery-time estimates. Reassuring confirmation states and order tracking keep customers informed after they hit order.', image: 'https://res.cloudinary.com/ddtzd3o9n/image/upload/v1785077265/pizzashop_tpqbia.png' },
      { type: 'result',   body: 'The streamlined flow cut average time-to-order in half and reduced cart abandonment significantly. Customers praised the playful, visual builder, and repeat-order rates climbed as the experience became something people actually enjoyed using.' },
    ]
  },
]

// The interactive Room scene. It's rendered directly by AnimationProjectsList as <RoomScene />
// rather than as a card, so it lives outside `animationProjects` — otherwise it would show up
// twice, once as the live canvas and once as a static card beside it.
export const roomProject: Project = {
  slug: 'room',
  name: 'Room',
  category: '3D Animation',
  description: 'An explorable real-time interior built in Blender and rendered in the browser with React Three Fiber. Drag to orbit, scroll to zoom.',
  tags: ['BLENDER', 'REACT THREE FIBER', 'REAL-TIME 3D'],
  image: 'https://res.cloudinary.com/ddtzd3o9n/image/upload/v1785258073/roompic_imlivb.png',
}

// Only the Room scene ships for now, and it isn't listed here (see `roomProject` above), so this
// array holds just the supporting cards beside it. Placeholders kept for reference.
export const animationProjects: Project[] = [
  // {
  //   slug: 'liquid-motion',
  //   name: 'Liquid Motion',
  //   category: '3D Animation',
  //   description: 'A cinematic 3D animation piece with fluid motion and architectural storytelling for brand reveal sequences.',
  //   tags: ['3D RENDER', 'CINEMATIC LIGHTING', 'MOTION GRAPHICS'],
  //   image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  // },
  // {
  //   slug: 'horizon-render',
  //   name: 'Horizon Render',
  //   category: '3D Animation',
  //   description: 'A stylized animation study exploring volumetric lighting, reflective surfaces, and spatial camera moves.',
  //   tags: ['VOLUMETRICS', '3D ENVIRONMENT', 'CAMERA ANIMATION'],
  //   image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
  // },
]

// Every live project, across all categories. This is the pool the home page list and the
// projects-page header draw their featured picks from.
export const projects: Project[] = [
  ...softwareProjects,
  ...uiuxProjects,
  ...animationProjects,
  roomProject,
]

/**
 * Every project that gets its own `/case/[slug]` page — currently all of them, across all three
 * categories.
 *
 * This is the only way the software and 3D work reaches Google. The /projects page renders one
 * tab at a time from client state, so anything outside the default ("software") tab never appears
 * in the server-rendered HTML: Room and Pizza App were invisible to crawlers on that page. A
 * dedicated route per project sidesteps the tabs entirely.
 *
 * Deliberately a named alias of `projects` so the route, the sitemap, and `getProjectHref` can
 * never disagree about which case pages exist.
 */
export const caseStudyProjects: Project[] = projects

/**
 * Where a project row/card should navigate to, in order of preference:
 *   1. its case-study page — every project in `caseStudyProjects` has one
 *      (see `generateStaticParams` in src/app/case/[slug]/page.tsx)
 *   2. otherwise the live project itself — Play Store, site, or repo — in a new tab
 *   3. otherwise the projects index, so the link is never dead
 *
 * Preferring the internal case page over the external link is intentional: it keeps the crawl on
 * the site and gives each case page an inbound internal link, without which the page is orphaned
 * and a sitemap entry alone is a weak discovery signal. The outbound Play Store / site / repo link
 * still appears on the case page itself, via `getProjectLink`.
 */
export function getProjectHref(project: Project): { href: string; external: boolean } {
    if (caseStudyProjects.some((p) => p.slug === project.slug)) {
        return { href: `/case/${project.slug}`, external: false }
    }

    const live = project.website ?? project.playstore ?? project.sourceCode
    if (live) return { href: live, external: true }

    return { href: '/projects', external: false }
}

// Fisher–Yates. Returns a new array so the source stays untouched.
export function shuffle<T>(items: readonly T[]): T[] {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

// Superseded — the home list and the projects-page header now draw random picks from `projects`
// instead. Nothing imports this. Note the image paths below point at files that have since been
// deleted from public/projects/, so restore artwork before re-enabling any of it.
// export const featureProjects: Project[] = [
//   {
//     slug: 'sea-breeze',
//     name: 'Sea Breeze',
//     category: 'Residential',
//     description: 'Coastal home featuring structural glazing systems designed to maximize ocean views while providing exceptional durability.',
//     tags: ['FLUID X VERTICAL (STRUCTURAL GLAZING)', 'FLUID X SLIDING DOOR', 'FLUID WINDOW'],
//     image: '/projects/seabreeze.jpg',
//   },
//   {
//     slug: 'ashmead-barn',
//     name: 'Ashmead Barn',
//     category: 'Residential',
//     description: 'A stunning residential conversion featuring bespoke fluid glass systems, combining modern aesthetics with period architecture.',
//     tags: ['FLUID SLIDING DOOR', 'FLUID GLASS BALUSTRADE', 'FLUID X PIVOT DOOR', 'FLUID WINDOW'],
//     image: '/projects/ashmead.jpg',
//   },
//   {
//     slug: 'kensington',
//     name: 'Kensington',
//     category: 'Commercial',
//     description: 'Premium commercial development featuring high-performance glass box systems for a striking architectural presence.',
//     tags: ['FLUID X SLIDING DOOR', 'FLUID GLASS BOX'],
//     image: '/projects/kensington.jpg',
//   },
// ]