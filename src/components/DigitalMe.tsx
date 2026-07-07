'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight, Camera, AtSign, Mail, Music, Coffee, Headphones } from 'lucide-react'

export default function DigitalMe() {
  return (
    <section className="w-full py-32 px-6 md:px-16 flex flex-col items-center bg-[#F9F8F6] border-t border-[var(--color-pencil)]/10">
      <div className="w-full max-w-4xl">
        
        {/* Elegant Header & Welcome */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-5xl md:text-6xl text-[var(--color-ink)] mb-6">
            Hi, I'm Pritam.
          </h2>
          <p className="font-sans text-lg md:text-xl text-[var(--color-pencil)] font-light max-w-2xl mx-auto leading-relaxed">
            Welcome to my digital living room. This is just a quiet corner of the internet to share a few thoughts, swap good playlists, and document the things that make me pause. Make yourself at home.
          </p>
        </motion.div>

        {/* The Vibe Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          <div className="p-8 rounded-2xl bg-white border border-[var(--color-pencil)]/15 shadow-sm text-center flex flex-col items-center hover:shadow-md transition-shadow">
            <Coffee size={24} className="text-[var(--color-ink)] mb-4" />
            <h3 className="font-serif text-xl text-[var(--color-ink)] mb-2">The Fuel</h3>
            <p className="font-sans text-sm text-[var(--color-pencil)] leading-relaxed">
              Running on dangerously strong coffee and the pursuit of good conversations.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-[var(--color-pencil)]/15 shadow-sm text-center flex flex-col items-center hover:shadow-md transition-shadow">
            <div className="text-2xl mb-4">🏏</div>
            <h3 className="font-serif text-xl text-[var(--color-ink)] mb-2">The Loyalty</h3>
            <p className="font-sans text-sm text-[var(--color-pencil)] leading-relaxed">
              Unapologetically backing RCB through every single season, no matter what.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-[var(--color-pencil)]/15 shadow-sm text-center flex flex-col items-center hover:shadow-md transition-shadow">
            <Headphones size={24} className="text-[var(--color-ink)] mb-4" />
            <h3 className="font-serif text-xl text-[var(--color-ink)] mb-2">The Soundtrack</h3>
            <p className="font-sans text-sm text-[var(--color-pencil)] leading-relaxed">
              Always curating the perfect playlist for late-night drives and rainy evenings.
            </p>
          </div>
        </motion.div>

        {/* Socials / Let's Connect */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex justify-center flex-wrap gap-4"
        >
          <a href="mailto:your-email@example.com" className="flex items-center space-x-2 px-6 py-3 bg-[var(--color-ink)] text-white rounded-full hover:opacity-90 transition-all text-sm font-sans group">
            <Mail size={16} />
            <span>Say Hello</span>
            <ArrowUpRight size={14} className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex items-center space-x-2 px-6 py-3 rounded-full bg-white border border-[var(--color-pencil)]/20 hover:border-[var(--color-ink)] hover:text-[var(--color-ink)] text-[var(--color-pencil)] transition-all text-sm font-sans">
            <Camera size={16} />
            <span>Photos</span>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="flex items-center space-x-2 px-6 py-3 rounded-full bg-white border border-[var(--color-pencil)]/20 hover:border-[var(--color-ink)] hover:text-[var(--color-ink)] text-[var(--color-pencil)] transition-all text-sm font-sans">
            <AtSign size={16} />
            <span>Thoughts</span>
          </a>
          <a href="https://spotify.com" target="_blank" rel="noreferrer" className="flex items-center space-x-2 px-6 py-3 rounded-full bg-white border border-[var(--color-pencil)]/20 hover:border-[var(--color-ink)] hover:text-[var(--color-ink)] text-[var(--color-pencil)] transition-all text-sm font-sans">
            <Music size={16} />
            <span>Playlists</span>
          </a>
        </motion.div>

      </div>
    </section>
  )
}