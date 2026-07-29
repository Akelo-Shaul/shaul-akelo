# Layout & Navigation Architecture

This document describes the shared site chrome (header, bottom navigation,
footer) and the page-transition system, plus the supporting context and data.

## Overview

The routed page is wrapped by persistent chrome in the root layout
(`src/app/layout.tsx`):

```
<LoaderProvider>
  <InitialLoader />
  <Lenis root>
    <LenisScrollSync />
    <PageTransition>
      <Header />
      <main>{children}</main>
    </PageTransition>
    <Footer />       {/* sticky, behind the page — reveal-on-scroll */}
    <BottomNav />    {/* fixed, above the transition layer */}
  </Lenis>
</LoaderProvider>
```

- **Smooth scrolling** is handled by Lenis (`<Lenis root>`), synced to GSAP's
  ticker in `LenisScrollSync`. Read scroll / lock-unlock via `useLenis`.
- **Shared state** lives in `LoaderContext` (`useLoader()`): `introDone` (intro
  finished) and `transitioning` (a page transition is animating).

### Stacking (z-index) map

| Layer                         | z-index |
| ----------------------------- | ------- |
| Footer (behind page)          | `0`     |
| PageTransition page layer     | `10`    |
| Header (inside PageTransition)| `30`    |
| Menu backdrop                 | `40`    |
| Menu card layer               | `50`    |
| Bottom bar / toggle           | `60`    |

---

## Data — `src/data/navigation.ts`

- `navLinks` — primary nav (`{ label, href }`): Home, About, Projects, Contact.
- `footerImages` — route → background image for the footer.
- `getFooterImage(pathname)` — returns the mapped image, with a fallback for
  dynamic routes (e.g. `/case/[slug]`).

To add a page: add it to `navLinks`, and add a `footerImages` entry (otherwise it
uses the fallback image).

---

## Header — `src/components/layout/Header.tsx`

- `absolute` at the top of the page (scrolls away with content — not sticky).
- Left/right spacers keep "Shaul Akelo" centered on desktop; the CTA is desktop-only.
- **Per-page text color**: routes in `lightRoutes` (`/about`, `/contact`) render
  dark text; everything else renders white. Add light-background routes here.
- Fades/slides in once `introDone` is true.

---

## Bottom navigation — `src/components/layout/BottomNav.tsx`

A single component that renders both the compact bar and the menu overlay.

### The bar / toggle

- Compact, centered pill: logo · current-page label · hamburger. The whole
  element is a `role="button"` (Enter/Space open the menu).
- The bar and the ✕/↑ toggle share a Framer Motion `layoutId` inside an
  `AnimatePresence`, so the bar **morphs** into the toggle when the menu opens.
- The toggle shows **✕** normally and **↑** at the page bottom; ↑ scrolls to top.

### The menu overlay

- A dimmed **backdrop** (click-opened only) + a **card** that scales up from a
  small box (`transformOrigin: bottom center`) anchored just above the toggle.
- Content is held hidden until the box has expanded (`delayChildren`), then
  staggers in: MENU label, nav links (masked line reveal), secondary block
  (News / GitHub + phone / email), and a full-width "Get a Quote" CTA — which is
  the shared `Button` with `fullWidth`, so it carries the same hover morph as
  every other button (see [Buttons](#buttons--srccomponentsuibuttontsx)).
- Nav links: hovering one **dims the others** (`group-hover/nav:text-white/40`
  with `hover:!text-white`); the active route gets an amber `◆`.

### Open modes & scroll behavior

- **Click-opened (modal):** dark backdrop, Lenis scroll **locked**. The card
  layer is `pointer-events-none`; clicks around the card fall through to the
  backdrop and close it.
- **Scroll-opened (footer):** auto-opens when the page bottom is reached
  (`limit - scroll < 40`, and only once the page is scrollable + intro done). No
  backdrop and **scroll stays live**, so the footer's socials / legal links are
  clickable. Scrolling **up** past a small margin closes it — tracked via the
  deepest scroll point (`maxScrollRef`), so continued downward scroll or
  over-scroll jitter never closes it.
- Closes on ✕, backdrop, `Escape`, and route change (`closeMenu()` resets the
  open-mode flags).

### Contact links

Real: **News** → `https://medium.com/@shaulakelo`, **GitHub** →
`https://github.com/Akelo-Shaul`, phone `+254 115 089 122`, email
`shaulakelo@gmail.com`. Both external links open in a new tab
(`target="_blank" rel="noopener noreferrer"`).

Still placeholders: the footer's **X** social and both **legal** links
(`Privacy policy`, `Terms & conditions`) are `href=""` — replace with real URLs.

---

## Buttons — `src/components/ui/Button.tsx`

Every button on the site routes through this one component, so changes here are
global. Props: `label`, `href`, `onClick`, `outline`, `textColor`, `external`,
`fullWidth`, `morph`.

- `href` renders a `next/link`, otherwise a `<button>`. **`onClick` works with
  `href`** — the bottom-nav CTA needs it to close the menu.
- `fullWidth` switches `w-fit px-6 py-1` → a centered block (`flex w-full … py-3`)
  for the bottom-nav CTA.

### Arrow → robot hover morph

An `↳` arrow sits **before** the label and morphs into the site's robot mascot
(the same character as the favicon) on hover, via GSAP's **MorphSVGPlugin**.

- **Paths** live in `src/components/ui/morphPaths.ts`. Both are authored in the
  same `viewBox="0 0 1000 1000"` — mismatched coordinate spaces make the shape
  fly across the canvas mid-tween.
- The arrow is a **filled** outline, not a stroked line: it morphs into a filled
  shape, and a stroked path would render the robot as a hairline.
- `fillRule="evenodd"` is **required** — the robot's eyes and mouth are holes cut
  from its body outline; without it the shape fills solid.
- `fill="currentColor"` makes the icon follow `textColor`, so it works on the
  dark-filled and outline variants and on light routes with no extra props.
- **Two explicit tweens**, not a paused timeline played/reversed: reversing a
  completed MorphSVG timeline did **not** restore the original `d`, leaving the
  icon stuck as a robot. `overwrite: 'auto'` handles rapid in/out hovers.
- Skipped entirely when `prefers-reduced-motion` is set (`useReducedMotion`).
- Pass `morph={false}` to opt out — worth considering where several buttons sit
  in a row, e.g. `SWProjectCard`.

**Plugin loading.** MorphSVG is *not* registered alongside `ScrollTrigger` /
`SplitText` in `src/lib/gsap.ts`. It is ~20 KB and `Button` renders on every
route, so `loadMorphSVG()` memoises a dynamic `import()` at module scope: the
first hover anywhere loads and registers it once, and every button reuses that
promise. Note the plugin ships free with GSAP 3.13+ — no Club licence needed.

---

## Footer — `src/components/layout/Footer.tsx`

- **Reveal-on-scroll parallax**: `sticky bottom-0`, `h-screen`, `z-0`, behind the
  page content (which is opaque). As you scroll to the end, the content slides up
  and off, uncovering the stationary footer. Because it's `sticky` (in flow, not
  `fixed`), it's off-screen at the top and cannot bleed through the page
  transition.
- **Per-page image** via `getFooterImage(usePathname())`.
- Large faded "Shaul Akelo" wordmark above the copyright / socials / legal row.
- **Hidden during transitions** (`invisible` while `transitioning`): during a
  transition the page layers become `position: fixed`, which would otherwise let
  the sticky footer expand to fill the viewport and show through the transition
  clip.

> Requirement: the reveal relies on **opaque page backgrounds** so the footer is
> covered until the end. All page roots set one (`bg-black`, `bg-white`,
> `bg-gray-700`). A page with a transparent bottom would let the footer peek
> through mid-page.

---

## Page transitions — `src/components/layout/PageTransition.tsx`

Framer Motion `AnimatePresence` keyed on `usePathname()`. The incoming page
slides up (`y: 100% → 0`) and a clip opens (`inset(8% 9%) → inset(0)`), revealing
it over the outgoing page.

Key mechanics (and the bugs each one fixes):

1. **Re-enter the overlay on route change.** A `prevPath` check sets
   `animating = true` during render (before paint) so the incoming page is a
   fixed overlay that reveals on top — instead of mounting in normal flow and
   flashing in.
2. **Only the entering page releases the overlay.** `onAnimationComplete` acts
   only when the completed definition is keyframed (`Array.isArray(y)`) — the
   outgoing page's `exit` isn't keyframed, so its (instant) completion is ignored.
3. **`FrozenRouter`** freezes the App Router `LayoutRouterContext` per wrapper, so
   the **outgoing page keeps rendering its own content** instead of the new route
   (Next swaps `children` on navigation).
4. **Hold the outgoing page.** Its natural exit is a no-op (`y/clip` targets equal
   current values), so Framer would unmount it immediately — leaving the incoming
   page sliding over the near-black `body`. A delayed opacity exit
   (`opacity: 0`, `delay: 1.5`) keeps it mounted as the **backdrop** for the whole
   transition, then removes it once covered.
5. **`transitioning` flag** is mirrored to `LoaderContext` so the footer hides
   during the animation.

Net effect: navigating **slides the new page in over the previous page** (its
real content), with no flash and no black background.

### Verifying a transition

Because the transition is short and GSAP-heavy, screenshots are unreliable for
mid-transition frames. Inspect the DOM instead — during a transition there should
be **two** wrappers (`div[style*="z-index: 10"]`): the outgoing one at
`opacity: 1` still showing its own text, and the incoming one with a
`translateY(...)`. `document.elementFromPoint(x, y)` at the top of the viewport
should return the outgoing page, not the body.

---

## File map

| File | Responsibility |
| ---- | -------------- |
| `src/app/layout.tsx` | Mounts the shared chrome around the routed page |
| `src/data/navigation.ts` | Nav links + route→footer-image map |
| `src/components/layout/Header.tsx` | Top header (title + CTA), per-route color |
| `src/components/layout/BottomNav.tsx` | Bottom bar + expanding menu overlay |
| `src/components/layout/Footer.tsx` | Reveal-on-scroll footer, per-page image |
| `src/components/layout/PageTransition.tsx` | Route transition + FrozenRouter |
| `src/components/layout/LoaderContext.tsx` | `introDone` + `transitioning` state |
| `src/components/ui/Button.tsx` | Shared button + arrow→robot hover morph |
| `src/components/ui/morphPaths.ts` | The two SVG paths the morph tweens between |
| `src/lib/gsap.ts` | GSAP singleton; eager plugins + lazy `loadMorphSVG()` |
| `src/hooks/useReducedMotion.ts` | `prefers-reduced-motion`, gates the morph |
| `src/hooks/useHydrated.ts` | Post-hydration flag for client-only randomness |
