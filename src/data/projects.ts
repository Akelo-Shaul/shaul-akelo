export type SoftwareSubCategory = 'mobile' | 'web' | 'desktop' | 'iot'

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
    images: [
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    slug: 'aero-interface',
    name: 'Aero Interface',
    category: 'UI/UX',
    description: 'A polished digital interface concept for immersive product discovery and seamless navigation across complex content ecosystems.',
    tags: ['VISUAL HIERARCHY', 'MOTION UI', 'ACCESSIBILITY'],
    images: [
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1200&q=80',
    ],
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