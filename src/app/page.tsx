import CafeHero from '@/components/CafeHero'
import DigitalMe from '@/components/DigitalMe'
import MemoriesScatter from '@/components/MemoriesScatter'
import MoodStation from '@/components/MoodStation'
import FilmNotes from '@/components/FilmNotes'
import CafeMagic from '@/components/CafeMagic'
import CafeGoodbye from '@/components/CafeGoodbye'

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <CafeHero />
      <DigitalMe />
      <MemoriesScatter />
      <MoodStation />
      <FilmNotes />
      <CafeMagic />
      <CafeGoodbye />
    </main>
  )
}