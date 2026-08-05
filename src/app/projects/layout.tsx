import type { Metadata } from 'next'

// projects/page.tsx is a client component ('use client' — it owns the tab state), and a client
// component cannot export `metadata`. This server layout carries the metadata for the segment.
export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Selected work by Shaul Akelo — shipped software, UI/UX case studies, and 3D environments and animations, with live sites, source code, and Play Store listings.',
  alternates: {
    canonical: '/projects',
  },
  openGraph: {
    type: 'website',
    url: '/projects',
    title: 'Projects — Shaul Akelo',
    description:
      'Selected work by Shaul Akelo — shipped software, UI/UX case studies, and 3D environments and animations, with live sites, source code, and Play Store listings.',
  },
}

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children
}
