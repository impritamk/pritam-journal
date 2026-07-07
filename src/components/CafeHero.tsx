'use client'

import { Sparkles, ArrowDown } from 'lucide-react'
import { motion } from 'framer-motion'

const topics = [
  { id: 'music', icon: '🎧', label: 'Playlists' },
  { id: 'movies', icon: '🎬', label: 'Screen Time' },
  { id: 'wall', icon: '🖋️', label: 'The Wall' }
]

export default function CafeHero() {
  
  // Smooth scroll function for the interactive buttons
  const handleScroll = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <section className="w-full min-h-[85vh] flex flex-col justify-between px-6 md:px-16 pt-32 pb-16 bg-[#F9F8F6]">
      
      {/* Top Tagline Area */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full flex justify-between items-start border-b border-[var(--color-pencil)]/15 pb-8"
      >
        <div className="flex items-center space-x-2">
          <Sparkles size={14} className="text-[var(--color-pencil)]" />
          <span className="font-sans text-xs tracking-[0.2em] uppercase text-[var(--color-pencil)]">
            A Digital Coffee Shop
          </span>
        </div>
        <span className="font-sans text-xs tracking-[0.15em] uppercase text-[var(--color-pencil)] hidden sm:inline">
          Pritam / Vol. 01
        </span>
      </motion.div>

      {/* Main Typographic Focus */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="max-w-4xl my-auto pt-20 pb-24 space-y-8"
      >
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-[var(--color-ink)] font-normal tracking-tight leading-[1.05]">
          Let's slow things down for a minute.
        </h1>
        
        <p className="font-sans text-lg md:text-xl text-[var(--color-pencil)] font-light max-w-xl leading-relaxed">
          Welcome to my corner of the internet. A quiet place to drop the noise, swap some good playlists, and keep track of the things that actually matter when the day ends.
        </p>
      </motion.div>

      {/* Navigation Topics Layout */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="w-full pt-8 border-t border-[var(--color-pencil)]/10 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
      >
        <div className="flex items-center space-x-3 text-[var(--color-pencil)]">
          <ArrowDown size={16} className="animate-bounce" />
          <p className="font-handwriting text-2xl transform -rotate-1">
            Pick a topic, let's start somewhere...
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => handleScroll(topic.id)}
              className="flex items-center space-x-2 px-5 py-2.5 bg-white border border-[var(--color-pencil)]/20 rounded-full shadow-sm hover:shadow-md hover:border-[var(--color-ink)] hover:text-[var(--color-ink)] transition-all font-sans text-sm text-[var(--color-pencil)] cursor-pointer group"
            >
              <span className="text-base group-hover:scale-110 transition-transform">{topic.icon}</span>
              <span>{topic.label}</span>
            </button>
          ))}
        </div>
      </motion.div>
      
    </section>
  )
}