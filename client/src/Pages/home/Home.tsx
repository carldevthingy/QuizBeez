import { Suspense } from 'react'
import { lazyNamed } from '@/utils/lazyNamed'

const HeroSection = lazyNamed(() => import('@/components/home/HeroSection'), 'HeroSection')
const ScrollSection = lazyNamed(() => import('@/components/home/ScrollSection'), 'ScrollSection')
const Cards = lazyNamed(() => import('@/components/home/Cards'), 'Cards')
const FAQ = lazyNamed(() => import('@/components/home/FAQ'), 'FAQ')
const Footer = lazyNamed(() => import('@/components/home/Footer'), 'Footer')

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col h-screen bg-light-yellow items-center justify-center">
          <img
            src="/game/loader.png"
            alt="Loading..."
            className="w-lg h-lg"
          />
          <h1 className='font-title text-5xl text-dark-yellow'>Loading...</h1>
        </div>
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