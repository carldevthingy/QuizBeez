import { Suspense } from 'react'
import { lazyNamed } from '@/utils/lazyNamed'
import { LoadingOverlay } from '@/components/home/overlay/LoadingOverlay'

const HeroSection = lazyNamed(() => import('@/components/home/HeroSection'), 'HeroSection')
const ScrollSection = lazyNamed(() => import('@/components/home/ScrollSection'), 'ScrollSection')
const Cards = lazyNamed(() => import('@/components/home/Cards'), 'Cards')
const FAQ = lazyNamed(() => import('@/components/home/FAQ'), 'FAQ')
const Footer = lazyNamed(() => import('@/components/home/Footer'), 'Footer')

export default function Home() {
  return (
    <Suspense
      fallback={
        <LoadingOverlay />
      }
    >
      <HeroSection />
      <ScrollSection />
      <Cards />
      <FAQ />
      <Footer />
    </Suspense>
  )
}