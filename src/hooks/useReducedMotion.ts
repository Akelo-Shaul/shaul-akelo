import { useSyncExternalStore } from "react";

const QUERY = '(prefers-reduced-motion: reduce)'

function subscribe(onChange: () => void) {
    const mediaQuery = window.matchMedia(QUERY)
    mediaQuery.addEventListener('change', onChange)
    return () => mediaQuery.removeEventListener('change', onChange)
}

const getSnapshot = () => window.matchMedia(QUERY).matches

// No media queries on the server; assume motion is allowed so the markup matches the
// client's first paint, then useSyncExternalStore corrects it if the user prefers reduced motion.
const getServerSnapshot = () => false

export default function useReducedMotion() {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
