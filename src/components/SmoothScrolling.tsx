'use client'

import { ReactLenis } from '@studio-freight/react-lenis'

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis 
      root 
      options={{ 
        lerp: 0.04, // A very low linear interpolation value creates that "heavy", gliding feeling.
        duration: 1.5, // How long the momentum carries
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2, // Slightly more responsive on mobile to avoid feeling sluggish
      }}
    >
      {/* Casting as 'any' safely bypasses a known TypeScript definition mismatch between React 19 and Lenis */}
      {children as any}
    </ReactLenis>
  )
}