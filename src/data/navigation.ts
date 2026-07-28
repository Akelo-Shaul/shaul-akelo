export const navLinks = [
    { label: 'Home',     href: '/' },
    { label: 'About',    href: '/about' },
    { label: 'Projects', href: '/projects' },
    { label: 'Contact',  href: '/contact' },
]

const footerImages: Record<string, string> = {
    '/':         '/tech.jpg',
    '/about':    '/poi.png',
    '/projects': '/Frozen.png',
    '/contact':  '/tech.jpg', // placeholder — swap later
}

export function getFooterImage(path: string): string {
    return footerImages[path] || '/tech.jpg'
}