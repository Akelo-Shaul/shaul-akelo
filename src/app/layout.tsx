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


const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
});

const body = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shaul Portfolio",
  description: "I make website and 3d environments and animations. For brand or product awareness.",
  // Declared here rather than as app/icon.gif — Next's icon file convention only accepts
  // .ico/.jpg/.jpeg/.png/.svg, so the GIF is served straight out of /public instead.
  icons: {
    icon: [{ url: "/shaul.gif", type: "image/gif" }],
  },
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
        <LoaderProvider>
          <InitialLoader />
          <Lenis root>
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
          </Lenis>
        </LoaderProvider>
      </body>
    </html>
  );
}
