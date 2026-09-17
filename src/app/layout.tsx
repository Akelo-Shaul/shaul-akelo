import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import InitialLoader from "@/components/layout/InitialLoader";
import { Lenis } from "lenis/react";
import PageTransition from "@/components/layout/PageTransition";
import { LoaderProvider } from "@/components/layout/LoaderContext";
import LenisScrollSync from "@/components/layout/LenisScrollSync";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import Header from "@/components/layout/Header";
import AnimatedFavicon from "@/components/layout/AnimatedFavicon";
import { QuoteProvider } from "@/components/quote/QuoteContext";
import QuoteShift from "@/components/quote/QuoteShift";
import QuoteDrawer from "@/components/quote/QuoteDrawer";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";


const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
});

const body = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Resolves every relative URL in this file and in child segments (canonicals, OG images) to an
  // absolute one. Without it, relative values in URL-based metadata fields are a build error.
  metadataBase: new URL(SITE_URL),
  // `default` is the tab title for any page that doesn't set its own; `template` wraps ones
  // that do, so a future `title: 'About'` renders as "About — Shaul Akelo".
  title: {
    default: "Shaul Akelo — Software Developer, Animator & UI/UX Designer",
    template: "%s — Shaul Akelo",
  },
  description: SITE_DESCRIPTION,
  // The home page is the only route that doesn't override this; every other segment sets its own.
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    url: "/",
    title: "Shaul Akelo — Software Developer, Animator & UI/UX Designer",
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Shaul Akelo — Software Developer, Animator & UI/UX Designer",
    description: SITE_DESCRIPTION,
  },
  // Declared here rather than as app/icon.gif — Next's icon file convention only accepts
  // .ico/.jpg/.jpeg/.png/.svg, so the GIF is served straight out of /public instead.
  // Keep this pointing at the ORIGINAL /shaul.gif: it is the only version confirmed to actually
  // animate in the tab. A cropped/rescaled re-encode (via sharp) reported 2 frames but did not
  // play, and swapping frames from JS did not repaint the icon either. Size < animation here.
  icons: {
    icon: [{ url: "/shaul.gif", type: "image/gif" }],
  },
};

// Kept in sync with the social links in Footer.tsx — a profile linked in the footer but missing
// here is a wasted entity signal.
const PROFILES = [
  "https://github.com/Akelo-Shaul",
  "https://www.linkedin.com/in/shaul-akelo/",
  "https://www.instagram.com/official_shaul_/",
  "https://www.youtube.com/@shaulakelo",
  "https://x.com/AkeloShaul21681",
];

/**
 * The studio and the person share a name, so they are modelled as two linked nodes rather than one
 * merged blob: an Organization that sells the services, and the Person who founded it. Each has a
 * stable `@id` so the Service schema on /services/[slug] can point `provider` at the organisation,
 * and so Google resolves "Shaul Akelo the studio" and "Shaul Akelo the person" to one entity
 * instead of two competing ones.
 *
 * Both carry the same `sameAs` profiles deliberately — the profiles represent both.
 */
const graphSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Shaul Akelo",
      url: SITE_URL,
      image: `${SITE_URL}/about.webp`,
      email: "mailto:shaulakelo@gmail.com",
      jobTitle: "Software Developer, Animator & UI/UX Designer",
      description: SITE_DESCRIPTION,
      knowsAbout: [
        "Web Development",
        "3D Environments",
        "Animation",
        "UI/UX Design",
        "Three.js",
        "Next.js",
      ],
      sameAs: PROFILES,
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/opengraph-image`,
      email: "mailto:shaulakelo@gmail.com",
      telephone: "+254115089122",
      description: SITE_DESCRIPTION,
      founder: { "@id": `${SITE_URL}/#person` },
      // Global by choice — the studio works remotely rather than targeting a local market.
      areaServed: "Worldwide",
      sameAs: PROFILES,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          // Structured data has to reach the HTML as a raw JSON string. The content is a local
          // constant with no user input, so there is nothing here to escape against.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(graphSchema) }}
        />
        <AnimatedFavicon />
        <LoaderProvider>
          <QuoteProvider>
            <InitialLoader />
            <Lenis root>
              {/* QuoteShift slides everything inside it left when the quote drawer opens. */}
              <QuoteShift>
                <LenisScrollSync />
                <PageTransition>
                  <Header />
                  <main>{children}</main>
                </PageTransition>
                {/* Footer in flow after the page. It sticks to the viewport bottom (z-0) so the
                    page content (z-10) scrolls up and reveals it, without bleeding into the
                    page transition (it's below the fold during a transition). */}
                <Footer />
                <BottomNav />
              </QuoteShift>
            </Lenis>
            {/* Outside QuoteShift on purpose: the drawer is position:fixed and must anchor to
                the viewport, not to the transformed (shifted) wrapper. */}
            <QuoteDrawer />
          </QuoteProvider>
        </LoaderProvider>
      </body>
    </html>
  );
}
