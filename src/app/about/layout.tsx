import type { Metadata } from 'next'

// about/page.tsx is a client component ('use client' — it renders the animated Hero), and a client
// component cannot export `metadata`. This server layout carries the metadata for the segment
// instead; it renders nothing of its own.
export const metadata: Metadata = {
  title: 'About',
  description:
    'Shaul Akelo is a developer and designer building websites, 3D environments, and animations. Read the approach behind the work, and what clients say about it.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    type: 'profile',
    url: '/about',
    title: 'About — Shaul Akelo',
    description:
      'Shaul Akelo is a developer and designer building websites, 3D environments, and animations. Read the approach behind the work, and what clients say about it.',
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
