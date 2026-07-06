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
}

export const softwareProjects: Project[] = [
  {
    slug: 'ashmead-barn',
    name: 'Ashmead Barn',
    category: 'Software',
    subCategory: 'mobile',
    description: 'A modular software platform for managing modern construction workflows, with bespoke dashboards and collaborative tools.',
    tags: ['PROJECT TRACKING', 'CUSTOM WORKFLOWS', 'CLIENT PORTAL'],
    icon: 'monitor',
    image: '/projects/ashmead.jpg',
  },
  {
    slug: 'sea-breeze',
    name: 'Sea Breeze',
    category: 'Software',
    subCategory: 'web',
    description: 'A responsive web app for dynamic lighting and environment control across residential and commercial properties.',
    tags: ['REAL-TIME ANALYTICS', 'SMART UI', 'API INTEGRATION'],
    icon: 'globe',
    image: '/projects/seabreeze.jpg',
  },
  {
    slug: 'rusty-house',
    name: 'Rusty House',
    category: 'Software',
    subCategory: 'desktop',
    description: 'An engineering dashboard that visualizes custom glazing performance data and automates maintenance workflows.',
    tags: ['DATA VISUALIZATION', 'AUTOMATION', 'SAFETY METRICS'],
    icon: 'fileText',
    image: '/projects/rusty.jpg',
  },
  {
    slug: 'kensington',
    name: 'Kensington',
    category: 'Software',
    subCategory: 'iot',
    description: 'A high-end client experience platform for specification, approvals, and custom fabrication tracking.',
    tags: ['CLIENT ONBOARDING', 'DOCUMENT MANAGEMENT', 'REAL-TIME UPDATES'],
    icon: 'layers',
    image: '/projects/kensington.jpg',
  },
]

export const uiuxProjects: Project[] = [
  {
    slug: 'flux-ux-suite',
    name: 'Flux UX Suite',
    category: 'UI/UX',
    description: 'A design system focused on tactile interactions, elegant screen layouts, and user journeys for design-led product experiences.',
    tags: ['INTERACTION DESIGN', 'PROTOTYPING', 'USER TESTING'],
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1200&q=80',
    ],
    sections: [
      { type: 'problem',  body: 'Design teams working across multiple projects faced inconsistent component libraries, fragmented design patterns, and repetitive development cycles. This lack of standardization led to longer implementation times, UI/UX misalignment, and difficulty maintaining visual coherence across products.' },
      { type: 'solution', body: 'We developed Flux UX Suite, a comprehensive design system combining reusable components, unified design tokens, and interactive guidelines. The system provides a single source of truth for design and development, reducing friction and accelerating product delivery while maintaining brand consistency.' },
      { type: 'designApproach', body: 'Our approach focused on creating a living documentation system with real interactive components. We mapped user workflows, conducted extensive user testing, and iterated based on feedback. The system emphasizes tactile interactions and elegant screen layouts that feel natural to users while maintaining technical scalability.', image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80' },
      { type: 'screen', name: 'Dashboard', description: 'A centralized hub displaying component inventory, design tokens, usage guidelines, and real-time analytics. Team members can instantly search for components, view implementation examples, and track adoption metrics across projects.', image: 'https://images.unsplash.com/photo-1507925921917-a3b63939dcb9?auto=format&fit=crop&w=1200&q=80' },
      { type: 'screen', name: 'Component Library', description: 'An interactive explorer of all available components with live code examples, prop documentation, and accessibility details. Designers and developers can filter by category, preview states, and copy implementation snippets directly.', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80' },
      { type: 'result',   body: 'Component adoption reached 85% across product teams within three months. Design-to-development handoff time decreased by 60%, and design consistency scores improved significantly. The system became the foundation for scaling design practices across the organization, with ongoing contributions from all teams.' },
    ]
  },
  {
    slug: 'aero-interface',
    name: 'Aero Interface',
    category: 'UI/UX',
    description: 'A polished digital interface concept for immersive product discovery and seamless navigation across complex content ecosystems.',
    tags: ['VISUAL HIERARCHY', 'MOTION UI', 'ACCESSIBILITY'],
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1200&q=80',
    ],
    sections: [
      { type: 'problem',  body: 'E-commerce platforms struggled with complex navigation patterns causing high bounce rates and reduced conversion. Users faced cognitive overload from poorly organized content hierarchies and inconsistent interaction patterns, leading to abandoned shopping carts and frustrated experiences.' },
      { type: 'solution', body: 'Aero Interface reimagines digital product discovery through a polished, layered interface emphasizing visual hierarchy and intuitive navigation. By combining elegant motion design with accessible interaction patterns, we created an experience that guides users naturally through complex content ecosystems.' },
      { type: 'designApproach', body: 'We employed motion as a wayfinding tool, using subtle animations to clarify relationships between elements. Extensive accessibility testing ensured the experience remains inclusive. We conducted user research with diverse audiences to validate interaction patterns and refined based on eye-tracking studies.', image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80' },
      { type: 'screen', name: 'Product Discovery', description: 'An immersive exploration interface featuring dynamic filtering, smart recommendations, and smooth transitions between product categories. Users can refine searches intuitively while maintaining context about their current position in the catalog.', image: 'https://images.unsplash.com/photo-1542744095-fcf47b53fe63?auto=format&fit=crop&w=1200&q=80' },
      { type: 'screen', name: 'Checkout Flow', description: 'A streamlined multi-step checkout process with progressive disclosure, real-time validation, and contextual help. The interface reduces cognitive load through clear visual indicators and reassuring micro-interactions at each step.', image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=1200&q=80' },
      { type: 'result',   body: 'The redesigned interface increased average session duration by 45% and improved conversion rates by 32%. User satisfaction scores improved dramatically, and bounce rates on product pages decreased significantly. The motion design patterns became a benchmark for the industry.' },
    ]
  },
]

export const animationProjects: Project[] = [
  {
    slug: 'liquid-motion',
    name: 'Liquid Motion',
    category: '3D Animation',
    description: 'A cinematic 3D animation piece with fluid motion and architectural storytelling for brand reveal sequences.',
    tags: ['3D RENDER', 'CINEMATIC LIGHTING', 'MOTION GRAPHICS'],
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'horizon-render',
    name: 'Horizon Render',
    category: '3D Animation',
    description: 'A stylized animation study exploring volumetric lighting, reflective surfaces, and spatial camera moves.',
    tags: ['VOLUMETRICS', '3D ENVIRONMENT', 'CAMERA ANIMATION'],
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
  },
]

export const projects: Project[] = [
  ...softwareProjects,
  ...uiuxProjects,
  ...animationProjects,
]

export const featureProjects: Project[] = [
  {
    slug: 'sea-breeze',
    name: 'Sea Breeze',
    category: 'Residential',
    description: 'Coastal home featuring structural glazing systems designed to maximize ocean views while providing exceptional durability.',
    tags: ['FLUID X VERTICAL (STRUCTURAL GLAZING)', 'FLUID X SLIDING DOOR', 'FLUID WINDOW'],
    image: '/projects/seabreeze.jpg',
  },
  {
    slug: 'ashmead-barn',
    name: 'Ashmead Barn',
    category: 'Residential',
    description: 'A stunning residential conversion featuring bespoke fluid glass systems, combining modern aesthetics with period architecture.',
    tags: ['FLUID SLIDING DOOR', 'FLUID GLASS BALUSTRADE', 'FLUID X PIVOT DOOR', 'FLUID WINDOW'],
    image: '/projects/ashmead.jpg',
  },
  {
    slug: 'kensington',
    name: 'Kensington',
    category: 'Commercial',
    description: 'Premium commercial development featuring high-performance glass box systems for a striking architectural presence.',
    tags: ['FLUID X SLIDING DOOR', 'FLUID GLASS BOX'],
    image: '/projects/kensington.jpg',
  },
]