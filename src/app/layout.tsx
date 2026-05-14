import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import InitialLoader from "@/components/layout/InitialLoader";
import { Lenis } from "lenis/react";
import PageTransition from "@/components/layout/PageTransition";
import { LoaderProvider } from "@/components/layout/LoaderContext";
import LenisScrollSync from "@/components/layout/LenisScrollSync";


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
              <main>{children}</main>
            </PageTransition>
          </Lenis>
        </LoaderProvider>
      </body>
    </html>
  );
}
