import { useSyncExternalStore } from "react";

// Nothing ever changes, so the subscription is a no-op.
const subscribe = () => () => {}

/**
 * False during SSR and on the first client render, true immediately after hydration.
 *
 * Use it to gate anything non-deterministic (randomness, Date.now, window measurements) so the
 * server HTML and the first client render still match — React only swaps in the client value once
 * hydration is done, which is exactly when it's safe to differ.
 */
export default function useHydrated() {
    return useSyncExternalStore(subscribe, () => true, () => false)
}
