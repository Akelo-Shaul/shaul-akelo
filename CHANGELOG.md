# Changelog

All notable changes to this project are documented here.
Format loosely follows [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased] — 2026-07-28

Shipped the first real project (MazeMob on Google Play), replaced the remaining
placeholder content with live data, cut `public/` from ~19 MB to under 1 MB, and
added CI.

### Added

- **MazeMob — first published project** (`src/data/projects.ts`)
  - Android maze game, live on Google Play as `com.shaulakelo.mazemob`.
  - `Project` gained a `sourceCode` field alongside `website` / `playstore`.
  - New `getProjectLinks()` returns **every** applicable link rather than one:
    _Open in Play Store_ · _Visit Site_ · _View Code_, rendered side by side.
    `getProjectLink()` is kept for surfaces with room for only one (the UI/UX
    case-study screen).
  - `SWProjectCard` now maps over that list, replacing a hardcoded pair that
    included a dead "Source Code" button with no `href`.

- **`public/app-ads.txt`** — IAB-spec authorised-sellers file for AdMob
  verification. Served at the domain root by Next's `public/` folder.
  **Outstanding:** the developer website in Play Console must exactly match the
  deployed domain, or the crawl will fail regardless of this file.

- **CI workflow** (`.github/workflows/ci.yml`) — typecheck, lint and build on
  pushes and PRs to `main`, Node 24 with npm caching and `concurrency`
  cancellation. Deployment stays with Vercel's Git integration; this is a gate,
  not a deploy pipeline.

- **Room 3D project** — `roomProject` in `projects.ts` plus a caption overlaid
  inside the canvas (`RoomScene.tsx`), with a gradient scrim and
  `pointer-events-none` so orbit/zoom still work through it. The room is
  rendered directly by `AnimationProjectsList`, so it deliberately lives outside
  the `animationProjects` array — listing it there would render it twice.

- **`useHydrated`** (`src/hooks/useHydrated.ts`) — `useSyncExternalStore`-based
  flag, false during SSR and the first client render, true after. Gates
  client-only non-determinism without a hydration mismatch.

### Changed

- **Featured projects are now random, across all categories.** Both the home
  list (`home/FeatureProjectsList.tsx`) and the projects-page header
  (`projects/FeatureProjects.tsx`) shuffle the live `projects` pool on each page
  load instead of reading the hardcoded `featureProjects` placeholders. The
  shuffle is deferred behind `useHydrated` because both pages prerender to
  static HTML. `FeatureProjects` also guards against an empty pool.

- **Images converted to WebP** — the eight source PNG/JPEGs in `public/` were
  photographs stored losslessly. Re-encoded at q82: **11.7 MB → 0.9 MB (92%
  smaller)**. Dimensions were already fine; format was the whole problem. Nine
  reference sites updated across `about/Hero`, `about/Manifesto`,
  `contact/ContactInfo`, `home/Hero` and `data/navigation.ts`.

- **`next.config.ts` image settings**
  - `qualities: [75, 90]` — Next 16 requires an explicit allowlist (default
    `[75]`); 90 is used by the full-bleed project banner.
  - `formats: ['image/avif', 'image/webp']` — default is WebP only.

- **Project banner no longer renders soft.** `projects/FeatureProjects.tsx` had
  `sizes="260px"` on a `fill` image spanning the full viewport — the width of
  the *home page* hover preview, pasted into a full-bleed banner. Now
  `sizes="100vw"` at `quality={90}`.

- **Animated favicon** (`src/components/layout/AnimatedFavicon.tsx`) — the site
  now has a favicon, and it actually moves.
  - Declared via `metadata.icons` pointing at `/shaul.gif`, since Next's `icon`
    file convention only accepts `.ico/.jpg/.jpeg/.png/.svg`.
  - Chrome, Edge and Safari render only the **first frame** of an animated GIF
    favicon (Firefox is the only engine that animates one natively), so the tab
    icon is cycled from JS instead: a 1 Hz interval swaps `<link rel="icon">`
    between the GIF's two frames, pre-extracted to PNG. The GIF stays declared as
    the no-JS fallback and is restored on unmount. Respects
    `prefers-reduced-motion`.
  - Frames are cropped to the **union** of both frames' content bounds — the
    source is 1000×1000 with ~17% transparent padding per edge, so cropping is
    what makes the mark fill the tab. One shared box keeps the character
    anchored rather than jumping between frames.
  - **Caution:** an attempt at cropped **64×64** frames stopped the animation
    playing (cause never identified); cropped 32×32 works. Regenerate with fresh
    filenames so a cached icon can't be mistaken for a working one. The exact
    sharp recipe is documented in the component.

- **Placeholder data commented out, not deleted** — the four placeholder
  software projects, both placeholder animation projects, and `featureProjects`
  (now superseded and unimported). Kept inline for reference; note their image
  paths point at files since removed from `public/projects/`.

### Fixed

- **Footer wrapped raggedly on mobile** (`layout/Footer.tsx`) — the copyright and
  all four socials were flat siblings in one `flex-wrap` row, breaking wherever
  they fit ("©2026, SHAUL AKELO INSTAGRAM" / "YOUTUBE LINKEDIN X"). The socials
  and legal links now sit in their own wrappers, stacking below `md` and
  restoring the original single row above it.

- **Carousel arrows shared one white block** — `bg-white` sat on the flex
  wrapper, so the `gap-2` between the two buttons painted white too. Moved onto
  each button, leaving the gap transparent.

- **Progress bar forced a reflow every frame** — it tweened `width` (a layout
  property) from 0→100% over 3 s on a permanent loop, via the `.progress-fill`
  selector string. Now tweens `scaleX` on a ref: compositor-only, and one fewer
  DOM query per cycle.

- **All 7 ESLint errors** (the lint gate was red on day one):
  - `home/Hero.tsx` — unescaped apostrophe.
  - `CaseSections.tsx` — three `as any` casts that were suppressing narrowing
    which already worked; the `screen` early-return narrows the union on its own.
  - `PageTransition.tsx` — reading a ref during render; `useState`'s initializer
    gives the same freeze legally.
  - `BottomNav.tsx` — `setState` in an effect on route change, now a render-phase
    reset (matching the existing pattern in `PageTransition`). Closes the menu
    before paint, so the new route can't flash with it open.
  - `useReducedMotion.ts` — rewritten on `useSyncExternalStore`, removing the
    setState-in-effect cascade. SSR value unchanged.

- **`UIUXProjectCard` fell back to a deleted placeholder** — `project.image ??
  '/projects/ashmead.jpg'`. The image now renders conditionally.

### Removed

- **~18 MB of unused/superseded images**: `cover.png`, `tech-bnr.png` (both
  unreferenced), the four `public/projects/*.jpg` placeholders, and the eight
  original PNG/JPEGs superseded by WebP. `public/` is now under 1 MB.

### Known issues / deferred

- **LCP ~9.2 s is gated by the intro choreography, not bundle size.** The loader
  overlay runs ~2.8 s, the page slide another 1.5 s, and the hero title reveal
  3 s — content isn't settled until ~6.2 s. These are wall-clock animation
  durations and will **not** shrink in a production build. Reducing it means
  shortening those durations or skipping the intro on repeat visits
  (`sessionStorage`); both were deliberately deferred as design decisions.
  Note the loader's trailing 1600 ms is *not* dead time — it is the backdrop the
  page slides across (`PageTransition` z-10 over loader z-9).
- **Performance has still only been measured against the dev server.** TBT
  ~2,250 ms and Speed Index ~4.1 s are inflated by unminified bundles and
  react-refresh. Re-measure with `npm run build && npm run start`.
- **13 ESLint warnings remain** (non-blocking) — mostly `<img>` vs `next/image`
  and unused imports. `CaseSections.tsx` still uses raw `<img>`, bypassing the
  optimizer.
- **MazeMob's description and tags are placeholder copy** pending real detail.

## [Unreleased] — 2026-07-10

Introduced shared site chrome (header, bottom navigation, footer) and hardened
the page-transition system. See `docs/layout-and-navigation.md` for the full
architecture write-up.

### Added

- **Shared bottom navigation** (`src/components/layout/BottomNav.tsx`)
  - Compact, centered floating bar (logo · current-page label · hamburger). The
    whole bar is clickable and keyboard-accessible.
  - Opens a menu overlay that **expands from a small box**, then the items
    stagger in, while the bar **morphs into a toggle button** (shared
    `layoutId`).
  - Menu contains the primary nav (Home / About / Projects / Contact — hovering
    one link dims the others), a News / GitHub + phone / email block, and a
    full-width "Get a Quote" CTA.
  - Toggle shows **✕ mid-page** and **↑ (scroll-to-top) at the page bottom**.
  - **Auto-opens when the user scrolls to the bottom** of a page and reverses
    when they scroll back up. Continued downward scroll / over-scroll never
    closes it (tracks the deepest scroll point instead of per-frame direction).
  - Two open modes: a **click-opened modal** (dims the page, locks scroll) and a
    **scroll-opened** state at the footer (no backdrop, scroll stays live, and
    the footer's socials / legal links remain clickable).
  - Closes on ✕, backdrop click, `Escape`, and route change.

- **Shared footer** (`src/components/layout/Footer.tsx`)
  - **Reveal-on-scroll parallax**: the footer is pinned at the bottom (`sticky`)
    and the page content scrolls up off it, so it appears to stay still while
    being uncovered.
  - **Per-page background image** driven by the current route.
  - Oversized, faded "Shaul Akelo" wordmark above the copyright / socials / legal
    row.
  - Hidden while a page transition animates so it can't bleed through the
    transition clip.

- **Shared header** (`src/components/layout/Header.tsx`)
  - "Shaul Akelo" (links to home) + outline "Get a Quote" CTA (→ `/contact`).
  - Sits at the top of every page and scrolls away with the content.
  - Picks **dark text on light pages** (`/about`, `/contact`) and white text
    elsewhere.

- **Navigation data** (`src/data/navigation.ts`)
  - `navLinks`, a route → footer-image map, and `getFooterImage(pathname)` with a
    fallback for dynamic routes.

- **Documentation**: `docs/layout-and-navigation.md` and this changelog.

### Changed

- **Root layout** (`src/app/layout.tsx`): mounts `<Header />`, `<Footer />` and
  `<BottomNav />` as persistent chrome around the routed page. Footer sits behind
  the page content for the reveal; BottomNav sits above the transition layer.
- **Home hero** (`src/components/home/Hero.tsx`): removed the inline
  "Shaul Akelo" title + "Get a Quote" row — that content now lives in the shared
  `Header`.
- **Contact info section** (`src/components/contact/ContactInfo.tsx`): the
  text + image block is now a **centered flex with capped, content-sized
  columns** instead of fixed pixel widths.

### Fixed

- **Page-transition flash**: the incoming page briefly flashed before the reveal.
  `PageTransition` now re-enters the fixed-overlay state on every route change
  (before paint), and only the entering page's keyframed reveal releases it.
- **Contact section skew**: the fixed-width flex (`w-[900px]` text /
  `w-[700px] shrink-0` image) tilted the layout as the viewport narrowed; the new
  content-sized/centered layout keeps it balanced.
- **Footer bleeding through the page transition**: hidden during transitions via
  a shared `transitioning` flag (`src/components/layout/LoaderContext.tsx`).
- **Menu opening under the intro loader**: auto-open now waits until the page is
  actually scrollable (`limit > 40`) and the intro has finished.
- **New page sliding in over a black background**: the outgoing page was being
  unmounted instantly (its exit animation was a no-op) and the incoming page slid
  over the near-black `body`. Fixed with:
  - a **`FrozenRouter`** that keeps the exiting page rendering its own content
    (not the new route), and
  - an **exit hold** (delayed opacity) that keeps the outgoing page mounted as the
    backdrop for the full transition.
  Verified via DOM inspection: two transition wrappers now coexist and the
  outgoing page is what's visible behind the incoming slide.
