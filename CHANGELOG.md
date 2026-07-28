# Changelog

All notable changes to this project are documented here.
Format loosely follows [Keep a Changelog](https://keepachangelog.com/).

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
