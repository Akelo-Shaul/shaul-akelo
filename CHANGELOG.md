# Changelog

All notable changes to this project are documented here.
Format loosely follows [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased] — 2026-08-05

Built out the SEO surface, which was previously a single title and description
shared by the whole site. See `docs/seo.md` for the full architecture.

### Added

- **`src/lib/site.ts`** — single source of truth for the canonical origin
  (`SITE_URL`), site name, and default description. Every absolute URL in
  canonicals, Open Graph tags, the sitemap, and JSON-LD derives from it. A plain
  constant rather than an env var on purpose: preview deploys must not emit
  canonicals pointing at their own hostname and compete with production.

- **`src/app/robots.ts`** → `/robots.txt`. Allows everything except `/api/`
  (the quote-form POST handler, nothing crawlable), declares `Host`, and points
  at the sitemap.

- **`src/app/sitemap.ts`** → `/sitemap.xml`. Static routes with tuned
  priorities; case-study URLs are derived from `uiuxProjects` — the same array
  that drives `generateStaticParams` — so uncommenting a project adds its case
  study automatically. `lastModified` is captured once per build, not per
  request, so URLs don't look freshly edited on every fetch.

- **`src/app/opengraph-image.tsx`** — 1200×630 PNG generated at build time via
  `ImageResponse`, so there is no binary asset to keep in sync with the wording.
  Links shared to WhatsApp/LinkedIn/X previously rendered blank.

- **Per-route metadata** — unique title, description, and canonical for `/`,
  `/about`, `/projects`, `/contact`, and each case study. `/about` and
  `/projects` carry theirs in a new thin server `layout.tsx`, because both pages
  are `'use client'` and a client component cannot export `metadata`.

- **`generateMetadata` for `/case/[slug]`** — title, description, `keywords`
  from the project's tags, canonical, and OG/Twitter images from
  `project.image`. An unknown slug returns `robots: { index: false }` so the 404
  isn't indexed under the site-wide title.

- **`Person` JSON-LD** in the root layout, tying the site and the person into
  one entity for name searches. `sameAs` currently lists only GitHub — add
  LinkedIn and any other profiles as they exist.

- **`FAQPage` JSON-LD** on `/contact`, built from the same `faqs` array the
  `FAQ` component renders, so the markup can never describe answers that aren't
  on the page.

- **A case-study page for every project, not just UI/UX** — `/case/mazemob` and
  `/case/room` join `/case/pizza-app`. The route, sitemap, and `getProjectHref`
  all read from one new `caseStudyProjects` export so they cannot disagree about
  which pages exist.

  The `/projects` page renders one tab at a time from client state, so only the
  default "software" tab reaches the server-rendered HTML — `Room` and
  `Pizza App` appeared in no crawlable markup anywhere on the site. A dedicated
  route per project sidesteps the tabs. Case-study titles are now derived from
  `category`, so each page reads as "MazeMob Software Case Study" rather than
  every page claiming to be a UI/UX one.

- **`docs/seo.md`** documenting all of the above.

### Changed

- **Page headlines are now `<h1>` instead of `<p>`** (`home/Hero.tsx`,
  `about/Hero.tsx`, `contact/ContactInfo.tsx`). `/`, `/about`, `/projects`, and
  `/contact` previously had no `h1` at all — on `/about` and `/contact` the only
  heading on the page was the CTA text. Purely semantic: Tailwind v4's preflight
  resets headings to `font-size: inherit; font-weight: inherit`, so the utility
  classes still drive the whole appearance, and the GSAP animations bind through
  refs rather than tag selectors. `/projects` gets an `sr-only` h1 instead, since
  its header is a rotating carousel with no fixed headline.

- **Descriptive alt text.** Two images read `alt="Contact Image"` regardless of
  content. The case-study backdrop is decorative and now carries `alt=""` so
  screen readers skip it rather than announcing "case study background".

- **`sameAs` now lists Instagram and YouTube** alongside GitHub and LinkedIn,
  matching the footer's social links. A profile linked in the footer but absent
  from the schema is a wasted entity signal.

- **Project cards now link to the case page rather than straight out to the
  Play Store / live site** (`getProjectHref`). Without an inbound internal link
  a case page is orphaned, and a sitemap entry alone is a weak discovery signal.
  The outbound link still appears on the case page itself.

- **Root `metadata` gained `metadataBase`** (`src/app/layout.tsx`), required
  before any relative URL can be used in a URL-based metadata field. The
  site-wide title also became `Shaul Akelo — Web, 3D & Animation Developer`,
  and `description` now reads as prose rather than the placeholder
  "I make website and 3d environments and animations."

### Removed

- **The `keywords` meta tag on case studies**, added earlier in this same batch.
  Google's SEO starter guide states plainly that "Google Search doesn't use the
  keywords meta tag" — it was dead weight in the `<head>`.

### Fixed

- **Google Search Console verification file was unreachable.**
  `googleedcc4cbe49e1037a.html` sat in the repo root, where Next does not route
  it — the URL returned 404 and verification would have failed silently. Moved
  to `public/googleedcc4cbe49e1037a.html`.

- **Every page reported the same title and description.** All routes inherited
  `title: "Shaul Akelo"` from the root layout, so Google saw four pages of
  duplicate metadata and wrote its own snippets. The `title.template` defined at
  `layout.tsx:33` was also unused, since no page set a title for it to wrap.

## [Unreleased] — 2026-07-29

Gave every button a hover animation, and connected the last of the dead links.

### Added

- **Arrow → robot hover morph on every button**
  (`src/components/ui/Button.tsx`, `src/components/ui/morphPaths.ts`).
  An `↳` arrow sits before each label and morphs into the site's robot mascot —
  the same character as the favicon — using GSAP's **MorphSVGPlugin** (free since
  GSAP 3.13; already bundled in the installed 3.15.0, like `SplitText`).
  Implemented inside `Button` so all call sites inherit it, including the
  variable-length `.map()` in `SWProjectCard`. See
  `docs/layout-and-navigation.md` → *Buttons* for the mechanics and constraints.
  - Both paths share one `viewBox="0 0 1000 1000"`; the arrow is a **filled**
    outline (not stroked) and `fillRule="evenodd"` is required or the robot's
    eyes and mouth fill solid.
  - The plugin is **lazy-loaded on first hover** via a memoised `loadMorphSVG()`
    in `src/lib/gsap.ts`, not registered globally — it's ~20 KB and `Button`
    renders on every route.
  - Honours `prefers-reduced-motion`; `morph={false}` opts out per call site.

- **`Button` gained `fullWidth` and `morph` props**, and now forwards `onClick`
  when `href` is set — previously it was silently dropped on the link branch.

### Changed

- **The bottom-nav "Get a Quote" CTA now uses `Button`** (`BottomNav.tsx`). It
  was a bespoke `<Link>` with a literal `↳` text glyph, which is why it looked
  and behaved differently from every other button. Its `closeMenu` handler is
  what required the `onClick`-with-`href` fix above.

### Fixed

- **Dead links across the site.**
  - `CTA.tsx` — "MY APPROACH" and "GET IN TOUCH" had `href=""`. An empty string
    is falsy, so `Button` rendered them as inert `<button>` elements with no
    handler. Now `/about` and `/contact`.
  - `BottomNav.tsx` — the "News" link was `href="#"`; now
    `https://medium.com/@shaulakelo`, opening in a new tab.
  - `home/FeatureProjectsList.tsx` — every project row pointed at
    `/projects/[slug]`, a route that does not exist, so all of them 404'd. New
    `getProjectHref()` in `src/data/projects.ts` resolves, in order: the case
    study if one exists (membership in `uiuxProjects`, the same source
    `generateStaticParams` uses, so it can't drift from the generated routes);
    otherwise the live project (`website ?? playstore ?? sourceCode`) in a new
    tab; otherwise `/projects`, so a row is never dead. Verified against the
    prerendered HTML — MazeMob → Play Store (new tab), Pizza App →
    `/case/pizza-app`, Room → `/projects`.

- **Hover morph got stuck as a robot.** The first implementation played a paused
  timeline on enter and `reverse()`d it on leave; the reverse never restored the
  original `d`, so the icon never returned to an arrow. Replaced with two
  explicit tweens plus `overwrite: 'auto'` for rapid in/out hovers.

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
  - `qualities: [50, 75, 90]` — Next 16 requires an explicit allowlist (default
    `[75]`); 90 is used by the full-bleed project banner, 50 by the hero backdrop.
  - `formats: ['image/avif', 'image/webp']` — default is WebP only.

- **Hero backdrop served at `quality={50}`** (`home/Hero.tsx`) — it renders at
  40% opacity behind the hero text, so full detail was wasted on what is also the
  page's LCP element. Measured against the production server with an AVIF Accept
  header: **37,538 → 13,610 bytes (64% smaller)**, matching Lighthouse's 23.6 KiB
  estimated saving almost exactly. Verified visually at 40% opacity — no banding.

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
- **Earlier performance reports were all measured against the dev server** and
  should be disregarded. Confirmed against a production build: JS on `/` is
  **281 KB gzipped** (921 KB raw, 12 chunks). The "Minify JavaScript — 282 KiB"
  and much of the "Reduce unused JavaScript — 401 KiB" audits were dev artefacts;
  production is minified, and the single largest offender (`next-devtools`,
  212.9 KiB) does not ship at all. `three.js` (959 KB) is code-split via
  `next/dynamic({ ssr: false })` and never loads on the home page.
  Full Lighthouse metrics against production have not been captured yet.
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
