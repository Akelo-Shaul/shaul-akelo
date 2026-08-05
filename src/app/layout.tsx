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
    default: "Shaul Akelo — Web, 3D & Animation Developer",
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
    title: "Shaul Akelo — Web, 3D & Animation Developer",
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Shaul Akelo — Web, 3D & Animation Developer",
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

// Tells Google that the site and the person are one entity, which is what earns a name search
// ("Shaul Akelo") the consolidated result rather than four competing page listings. `sameAs` is the
// signal that ties the off-site profiles to this domain — add any further profiles to that array.
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Shaul Akelo",
  url: SITE_URL,
  image: `${SITE_URL}/about.webp`,
  email: "mailto:shaulakelo@gmail.com",
  jobTitle: "Web, 3D & Animation Developer",
  description: SITE_DESCRIPTION,
  knowsAbout: [
    "Web Development",
    "3D Environments",
    "Animation",
    "UI/UX Design",
    "Three.js",
    "Next.js",
  ],
  sameAs: [
    "https://github.com/Akelo-Shaul",
    "https://www.linkedin.com/in/shaul-akelo",
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
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
