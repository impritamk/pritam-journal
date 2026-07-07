import type { Metadata } from "next";
import { Inter, Newsreader, Caveat } from "next/font/google";
import "./globals.css";


// 1. The everyday conversation font
const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

// 2. The romantic, editorial font
const newsreader = Newsreader({ 
  subsets: ["latin"],
  variable: "--font-newsreader",
  style: ['normal', 'italic'],
  display: 'swap',
});

// 3. The messy, human handwriting
const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Pritam | Let's Talk",
  description: "A digital coffee shop. Pull up a chair.",
};

// The Fix: Explicitly telling TypeScript that this layout accepts React children
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body 
        className={`
          ${inter.variable} ${newsreader.variable} ${caveat.variable}
          font-sans bg-[#F9F8F6] text-[#1C1B1A] 
          antialiased selection:bg-[#FFD966]/40 selection:text-[#1C1B1A]
          min-h-screen flex flex-col overflow-x-hidden
        `}
      >
        {/* The Tactile Paper Overlay:
          Lighter and warmer than the old film grain. 
          It makes the screen feel like a page in a sketchbook.
        */}
        <svg 
          className="pointer-events-none fixed inset-0 z-50 h-full w-full opacity-[0.4] mix-blend-overlay"
          xmlns="http://www.w3.org/2000/svg"
        >
          <filter id="paper-texture">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="1 0 0 0 0, 0 0.98 0 0 0, 0 0.96 0 0 0, 0 0 0 0.15 0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#paper-texture)" />
        </svg>

        <main className="relative z-10 flex-grow">
          {/* The Fireflies & The Hidden Duck */}
          
          {/* The rest of your pages (like page.tsx) load inside here */}
          {children}
        </main>

      </body>
    </html>
  );
}