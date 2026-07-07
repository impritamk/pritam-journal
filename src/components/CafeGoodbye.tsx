'use client'

import { motion } from 'framer-motion'
import { ArrowUp, Camera, AtSign, Mail, Music } from 'lucide-react'

export default function CafeGoodbye() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section className="w-full py-32 px-6 md:px-16 flex flex-col items-center bg-[var(--color-ink)] border-t border-[var(--color-pencil)]/10 text-white overflow-hidden relative">
      
      {/* Subtle background texture */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")'
        }}
      />

      <div className="w-full max-w-5xl flex flex-col items-center text-center relative z-10">
        
        {/* The Massive Sign-off */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center mb-24"
        >
          <span className="font-sans text-xs tracking-[0.3em] uppercase text-white/50 mb-8">
            End of Journal
          </span>
          <h2 className="font-serif text-6xl md:text-8xl lg:text-9xl tracking-tight leading-none mb-6">
            Until next time.
          </h2>
          <p className="font-sans text-lg md:text-xl text-white/70 font-light max-w-xl mx-auto">
            Thanks for dropping by the digital living room. The coffee is always on, and the door is always open.
          </p>
        </motion.div>

        {/* The Final Navigation & Copyright */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full flex flex-col md:flex-row justify-between items-center border-t border-white/10 pt-8 gap-8"
        >
          
          {/* Copyright */}
          <div className="font-sans text-xs text-white/50 tracking-widest uppercase">
            © {new Date().getFullYear()} Pritam. All rights reserved.
          </div>

          {/* Minimalist Socials */}
          <div className="flex items-center space-x-6">
            <a href="mailto:your-im.pritamk@gmail.com" className="text-white/50 hover:text-white transition-colors" title="Email">
              <Mail size={18} />
            </a>
            <a href="https://instagram.com/pritamk_" target="_blank" rel="noreferrer" className="text-white/50 hover:text-white transition-colors" title="Photos">
              <Camera size={18} />
            </a>
            <a href="https://twitter.com/pritamk_" target="_blank" rel="noreferrer" className="text-white/50 hover:text-white transition-colors" title="Thoughts">
              <AtSign size={18} />
            </a>
            <a href="https://spotify.com" target="_blank" rel="noreferrer" className="text-white/50 hover:text-white transition-colors" title="Playlists">
              <Music size={18} />
            </a>
          </div>

          {/* Back to Top Button */}
          <button 
            onClick={scrollToTop}
            className="group flex items-center space-x-2 font-sans text-xs tracking-widest uppercase text-white hover:text-[var(--color-highlighter)] transition-colors"
          >
            <span>Back to top</span>
            <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[var(--color-highlighter)] transition-colors">
              <ArrowUp size={14} className="transform group-hover:-translate-y-1 transition-transform" />
            </div>
          </button>

        </motion.div>

      </div>
    </section>
  )
}