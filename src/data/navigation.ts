export const navLinks = [
    { label: 'Home',     href: '/' },
    { label: 'About',    href: '/about' },
    { label: 'Projects', href: '/projects' },
    { label: 'Contact',  href: '/contact' },
]

const footerImages: Record<string, string> = {
    '/':         '/tech.webp',
    '/about':    '/poi.webp',
    '/projects': '/Frozen.webp',
    '/contact':  '/tech.webp', // placeholder — swap later
}

export function getFooterImage(path: string): string {
    return footerImages[path] || '/tech.webp'
}