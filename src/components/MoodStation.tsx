'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Disc3, Plus, Check, Loader2, Music, Headphones, Radio, Trash2 } from 'lucide-react'
import { getAudioItems, addAudioItem, deleteAudioItem, type AudioItem } from '@/app/actions'

export default function MoodStation() {
  const [items, setItems] = useState<AudioItem[]>([])
  const [activeItem, setActiveItem] = useState<AudioItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // 👻 GHOST ADMIN STATE
  const [isAdmin, setIsAdmin] = useState(false)
  
  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newArtist, setNewArtist] = useState('')
  const [newEmbedUrl, setNewEmbedUrl] = useState('')
  const [newCategory, setNewCategory] = useState('Deep Focus')
  const [newNote, setNewNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Fetch data
  useEffect(() => {
    const fetchAudio = async () => {
      try {
        const data = await getAudioItems()
        setItems(data)
        if (data.length > 0) setActiveItem(data[0])
      } catch (error) {
        console.error("Failed to load audio:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAudio()
  }, [])

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim() || !newEmbedUrl.trim()) return
    setIsSubmitting(true)

    try {
      const insertedItem = await addAudioItem({
        title: newTitle,
        artist: newArtist,
        embed_url: newEmbedUrl,
        category: newCategory,
        note: newNote
      })

      setItems(prev => [insertedItem, ...prev])
      setNewTitle('')
      setNewArtist('')
      setNewEmbedUrl('')
      setNewNote('')
      setIsFormOpen(false)
      setIsSubmitted(true)
      
      setTimeout(() => setIsSubmitted(false), 3000)
    } catch (error) {
      console.error("Failed to add audio:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Ghost Admin: Delete Track
  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation() // Stop the card from playing the song when you click delete
    setItems(prev => prev.filter(item => item.id !== id))
    
    // If they delete the song that is currently playing, clear the player
    if (activeItem?.id === id) setActiveItem(null)
    
    try {
      await deleteAudioItem(id)
    } catch (error) {
      console.error("Failed to delete track:", error)
      const data = await getAudioItems()
      setItems(data)
    }
  }

  if (isLoading) {
    return (
      <div className="w-full py-32 flex justify-center items-center text-[var(--color-pencil)]">
        <Loader2 className="animate-spin mr-2" size={24} />
        <span className="font-sans">Tuning the radio...</span>
      </div>
    )
  }

  // Helper to check if the embed is valid or just our placeholder
  const hasValidEmbed = activeItem?.embed_url && !activeItem.embed_url.includes('YOUR_YT_ID_HERE');

  return (
    <section id="music" className="relative w-full py-32 px-6 md:px-16 flex flex-col items-center border-t border-[var(--color-pencil)]/10 bg-[#F9F8F6]">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* LEFT COLUMN: The Player & Admin Form */}
        <div className="lg:col-span-5 flex flex-col space-y-8">
          
          <div className="flex flex-col items-start space-y-4">
            <span 
              onDoubleClick={() => setIsAdmin(!isAdmin)}
              className={`font-sans text-xs tracking-[0.2em] uppercase select-none cursor-pointer transition-colors ${isAdmin ? 'text-red-500 font-bold' : 'text-[var(--color-pencil)]'}`}
              title="Double click for Ghost Mode"
            >
              {isAdmin ? '👻 Audio Admin Active' : 'Sonic Archives'}
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-[var(--color-ink)]">
              Play Music.
            </h2>
            <p className="font-sans text-lg text-[var(--color-pencil)] font-light">
              What is currently playing in my earphones.
            </p>
          </div>

          {/* The Master Embedded Player */}
          {activeItem && (
            <motion.div 
              key={activeItem.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full bg-white p-4 rounded-3xl shadow-sm border border-[var(--color-pencil)]/20 relative overflow-hidden group"
            >
              {/* Spinning Vinyl Decoration */}
              <div className="absolute -top-16 -right-16 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}>
                  <Disc3 size={250} strokeWidth={0.5} />
                </motion.div>
              </div>

              <div className="relative z-10">
                <div className="mb-4">
                  <h3 className="font-serif text-2xl text-[var(--color-ink)] leading-tight">{activeItem.title}</h3>
                  <p className="font-sans text-[var(--color-pencil)]">{activeItem.artist}</p>
                </div>

                {/* The Actual Iframe OR The Placeholder */}
                <div className="w-full rounded-xl overflow-hidden bg-[var(--color-paper)] h-[152px] md:h-[352px] border border-[var(--color-pencil)]/10">
                  {hasValidEmbed ? (
                    <iframe 
                      src={activeItem.embed_url} 
                      width="100%" 
                      height="100%" 
                      frameBorder="0" 
                      allowFullScreen 
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                      loading="lazy"
                      className="w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-[var(--color-pencil)]/20 rounded-xl">
                      <Radio size={32} className="text-[var(--color-pencil)]/50 mb-4" />
                      <p className="font-sans text-sm tracking-widest uppercase text-[var(--color-pencil)] mb-2">Tape Deck Offline</p>
                      <p className="font-sans text-xs text-[var(--color-pencil)]/70">
                        I haven't wired up the audio stream for this track yet.<br/>Imagine it playing beautifully in your head.
                      </p>
                    </div>
                  )}
                </div>

                {activeItem.note && (
                  <div className="mt-6 pt-4 border-t border-[var(--color-pencil)]/10">
                    <p className="font-handwriting text-xl text-[var(--color-ink)] leading-snug transform -rotate-1">
                      "{activeItem.note}"
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* 👻 GHOST ADMIN FORM */}
          <AnimatePresence>
            {isAdmin && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                {!isFormOpen ? (
                  <button onClick={() => setIsFormOpen(true)} className="flex items-center space-x-2 text-sm text-red-500 hover:text-red-600 transition-colors py-4">
                    <Plus size={16} /> <span>Add new track to database...</span>
                  </button>
                ) : (
                  <form onSubmit={handleAddSubmit} className="bg-red-50/50 p-6 rounded-2xl border border-red-200 shadow-sm mt-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-serif text-xl text-[var(--color-ink)]">Add to Rotation</h3>
                      <button type="button" onClick={() => setIsFormOpen(false)} className="text-[var(--color-pencil)] text-sm">Cancel</button>
                    </div>
                    
                    <div className="space-y-4">
                      <input required value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Song Title" className="w-full bg-white px-4 py-2 rounded-lg font-sans text-sm outline-none border border-red-100" />
                      <input required value={newArtist} onChange={e => setNewArtist(e.target.value)} placeholder="Artist Name" className="w-full bg-white px-4 py-2 rounded-lg font-sans text-sm outline-none border border-red-100" />
                      
                      <div>
                        <input required value={newEmbedUrl} onChange={e => setNewEmbedUrl(e.target.value)} placeholder="Embed URL (e.g., YT /embed/ link)" className="w-full bg-white px-4 py-2 rounded-lg font-sans text-sm outline-none border border-red-100" />
                        <p className="text-[10px] text-red-400 mt-1 pl-1">Use the iframe src URL (e.g. https://www.youtube.com/embed/ID)</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <input value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="Category (e.g. Focus)" className="w-full bg-white px-4 py-2 rounded-lg font-sans text-sm outline-none border border-red-100" />
                        <input value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Journal Note..." className="w-full bg-white px-4 py-2 rounded-lg font-sans text-sm outline-none border border-red-100" />
                      </div>
                      
                      <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-red-500 text-white rounded-lg font-sans text-sm hover:bg-red-600 transition-colors flex justify-center items-center">
                        {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : 'Save to Neon DB'}
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* RIGHT COLUMN: The Tracklist */}
        <div className="lg:col-span-7 flex flex-col pt-8 lg:pt-0">
          <div className="flex items-center space-x-2 mb-8 border-b border-[var(--color-pencil)]/10 pb-4">
            <Headphones size={18} className="text-[var(--color-pencil)]" />
            <h3 className="font-sans text-sm tracking-widest uppercase text-[var(--color-pencil)]">
              The Collection ({items.length})
            </h3>
          </div>

          {/* MOBILE FRIENDLY HEIGHT RESTRICTION HERE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-[400px] md:h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {items.map((item) => {
              const isActive = activeItem?.id === item.id
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveItem(item)}
                  role="button"
                  tabIndex={0}
                  className={`group text-left p-5 rounded-xl border transition-all duration-300 flex flex-col h-full min-h-[120px] relative cursor-pointer ${
                    isActive 
                      ? 'bg-white border-[var(--color-ink)]/20 shadow-md transform scale-[1.02] z-10' 
                      : 'bg-transparent border-[var(--color-pencil)]/15 hover:bg-white hover:border-[var(--color-pencil)]/30 hover:shadow-sm'
                  }`}
                >
                  
                  {/* DELETE BUTTON (Ghost Admin Only) */}
                  {isAdmin && (
                    <button 
                      onClick={(e) => handleDelete(e, item.id)}
                      className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-50 hover:bg-red-600 hover:scale-110"
                      title="Remove Track"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}

                  <div className="flex justify-between items-start mb-3 w-full">
                    <span className={`font-sans text-[10px] tracking-widest uppercase px-2 py-1 rounded-sm ${isActive ? 'bg-[var(--color-ink)] text-white' : 'bg-[var(--color-paper)] text-[var(--color-pencil)]'}`}>
                      {item.category}
                    </span>
                    {isActive && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <Music size={14} className="text-[var(--color-highlighter)]" />
                      </motion.div>
                    )}
                  </div>
                  
                  <h4 className={`font-serif text-xl mb-1 truncate w-full ${isActive ? 'text-[var(--color-ink)]' : 'text-[var(--color-ink)]/70 group-hover:text-[var(--color-ink)]'}`}>
                    {item.title}
                  </h4>
                  <p className="font-sans text-sm text-[var(--color-pencil)] truncate w-full">
                    {item.artist}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </section>
  )
}