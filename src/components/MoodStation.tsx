'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Loader2, Music, SkipBack, SkipForward, ListMusic, Trash2, Play, Pause } from 'lucide-react'
import ReactPlayer from 'react-player'
import { getAudioItems, addAudioItem, deleteAudioItem, type AudioItem } from '@/app/actions'
const Player = ReactPlayer as any;
export default function MoodStation() {
  const [items, setItems] = useState<AudioItem[]>([])
  
  // Player State
  const [currentIndex, setCurrentIndex] = useState(0)
  const [activeItem, setActiveItem] = useState<AudioItem | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  // 👻 GHOST ADMIN STATE
  const [isAdmin, setIsAdmin] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  
  // Form State
  const [newTitle, setNewTitle] = useState('')
  const [newArtist, setNewArtist] = useState('')
  const [newEmbedUrl, setNewEmbedUrl] = useState('')
  const [newCategory, setNewCategory] = useState('Deep Focus')
  const [newNote, setNewNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchAudio = async () => {
      try {
        const data = await getAudioItems()
        setItems(data)
        if (data.length > 0) {
          setActiveItem(data[0])
          setCurrentIndex(0)
        }
      } catch (error) {
        console.error("Failed to load audio:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAudio()
  }, [])

  // Navigation Controls
  const handleNext = () => {
    if (items.length === 0) return
    const nextIndex = (currentIndex + 1) % items.length
    setCurrentIndex(nextIndex)
    setActiveItem(items[nextIndex])
    setIsPlaying(true)
  }

  const handlePrev = () => {
    if (items.length === 0) return
    const prevIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1
    setCurrentIndex(prevIndex)
    setActiveItem(items[prevIndex])
    setIsPlaying(true)
  }

  const selectTrack = (index: number) => {
    setCurrentIndex(index)
    setActiveItem(items[index])
    setIsPlaying(true)
    if (window.innerWidth < 768) setIsPlaylistOpen(false)
  }

  // --- MAGIC FORMATTING FUNCTIONS ---
  
  // Converts your database embed URLs into clean YouTube watch URLs for the player
  const getPlayableUrl = (url: string) => {
    if (url.includes('youtube.com/embed/')) {
      const videoId = url.split('embed/')[1].split('?')[0]
      return `https://www.youtube.com/watch?v=${videoId}`
    }
    return url
  }

  // Extracts the thumbnail from the YouTube link
  const getThumbnail = (url: string) => {
    try {
      if (url.includes('youtube.com/embed/')) {
        const videoId = url.split('embed/')[1].split('?')[0]
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      }
      return 'https://images.unsplash.com/photo-1614613535308-eb51bd3d2c17?q=80&w=800&auto=format&fit=crop'
    } catch {
      return 'https://images.unsplash.com/photo-1614613535308-eb51bd3d2c17?q=80&w=800&auto=format&fit=crop'
    }
  }

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim() || !newEmbedUrl.trim()) return
    setIsSubmitting(true)

    try {
      const insertedItem = await addAudioItem({
        title: newTitle, artist: newArtist, embed_url: newEmbedUrl, category: newCategory, note: newNote
      })
      setItems(prev => [insertedItem, ...prev])
      setIsFormOpen(false)
      setNewTitle(''); setNewArtist(''); setNewEmbedUrl(''); setNewNote('')
    } catch (error) {
      console.error("Failed to add audio:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setItems(prev => prev.filter(item => item.id !== id))
    if (activeItem?.id === id) handleNext()
    try {
      await deleteAudioItem(id)
    } catch (error) {
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

  return (
    <section id="music" className="relative w-full py-32 px-6 flex flex-col items-center border-t border-[var(--color-pencil)]/10 bg-[#F9F8F6]">
      <div className="w-full max-w-lg flex flex-col items-center">
        
        {/* Editorial Header */}
        <div className="text-center mb-12">
          <span 
            onDoubleClick={() => setIsAdmin(!isAdmin)}
            className={`font-sans text-xs tracking-[0.2em] uppercase select-none cursor-pointer transition-colors ${isAdmin ? 'text-red-500 font-bold' : 'text-[var(--color-pencil)]'}`}
          >
            {isAdmin ? '👻 Audio Admin Active' : 'Sonic Archives'}
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-[var(--color-ink)] mt-4">
            Play Music.
          </h2>
        </div>

        {/* 👻 GHOST ADMIN FORM */}
        <AnimatePresence>
          {isAdmin && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="w-full overflow-hidden mb-8">
              {!isFormOpen ? (
                <button onClick={() => setIsFormOpen(true)} className="w-full flex justify-center items-center space-x-2 text-sm text-red-500 hover:text-red-600 transition-colors py-4 border border-red-200 border-dashed rounded-2xl bg-red-50/50">
                  <Plus size={16} /> <span>Add new track to database...</span>
                </button>
              ) : (
                <form onSubmit={handleAddSubmit} className="bg-red-50/50 p-6 rounded-2xl border border-red-200 shadow-sm">
                  {/* Form fields identical to previous version... */}
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-serif text-xl text-[var(--color-ink)]">Add to Rotation</h3>
                    <button type="button" onClick={() => setIsFormOpen(false)} className="text-[var(--color-pencil)] text-sm">Cancel</button>
                  </div>
                  <div className="space-y-4">
                    <input required value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Song Title" className="w-full bg-white px-4 py-2 rounded-lg font-sans text-sm outline-none border border-red-100" />
                    <input required value={newArtist} onChange={e => setNewArtist(e.target.value)} placeholder="Artist Name" className="w-full bg-white px-4 py-2 rounded-lg font-sans text-sm outline-none border border-red-100" />
                    <input required value={newEmbedUrl} onChange={e => setNewEmbedUrl(e.target.value)} placeholder="Embed URL (e.g., YT /embed/ link)" className="w-full bg-white px-4 py-2 rounded-lg font-sans text-sm outline-none border border-red-100" />
                    <div className="grid grid-cols-2 gap-4">
                      <input value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="Category" className="w-full bg-white px-4 py-2 rounded-lg font-sans text-sm outline-none border border-red-100" />
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

        {/* THE FOCUSED CUSTOM MUSIC PLAYER */}
        {activeItem && (
          <motion.div 
            layout
            key="player-card"
            className="w-full bg-white rounded-[2rem] shadow-xl border border-[var(--color-pencil)]/15 overflow-hidden relative z-10 p-8"
          >
            {/* The Invisible YouTube Player */}
            <div className="hidden absolute opacity-0 pointer-events-none">
              <Player 
                url={getPlayableUrl(activeItem.embed_url)} 
                playing={isPlaying} 
                onEnded={handleNext} 
                width="0" 
                height="0"
              />
            </div>
            
            {/* Top Badge & Count */}
            <div className="flex justify-between items-start mb-8">
              <span className="font-sans text-[10px] tracking-widest uppercase px-3 py-1 bg-[var(--color-ink)] text-white rounded-full shadow-sm">
                {activeItem.category}
              </span>
              <span className="font-sans text-xs text-[var(--color-pencil)] font-medium">
                {currentIndex + 1} / {items.length}
              </span>
            </div>

            {/* Spinning Vinyl Record Thumbnail */}
            <div className="flex justify-center mb-8 relative">
              <div 
                className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-8 border-gray-100 shadow-lg relative bg-black flex items-center justify-center animate-spin"
                style={{ 
                  animationDuration: '10s', 
                  animationPlayState: isPlaying ? 'running' : 'paused' 
                }}
              >
                {/* The album art */}
                <img 
                  src={getThumbnail(activeItem.embed_url)} 
                  alt="Cover" 
                  className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
                {/* Vinyl Record Center Hole Details */}
                <div className="w-12 h-12 rounded-full border-4 border-[#222] bg-white relative z-10 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-black"></div>
                </div>
              </div>
            </div>

            {/* Track Info */}
            <div className="text-center mb-8">
              <h3 className="font-serif text-3xl text-[var(--color-ink)] leading-tight mb-2 truncate px-4">{activeItem.title}</h3>
              <p className="font-sans text-[var(--color-pencil)] text-base truncate px-4">{activeItem.artist}</p>
              {activeItem.note && (
                <p className="font-handwriting text-lg text-[var(--color-ink)]/70 mt-4 inline-block -rotate-1">
                  "{activeItem.note}"
                </p>
              )}
            </div>

            {/* Player Controls (Play, Pause, Skip) */}
            <div className="flex items-center justify-center space-x-6 border-t border-[var(--color-pencil)]/10 pt-8 pb-4">
              <button onClick={handlePrev} className="p-3 text-[var(--color-pencil)] hover:text-[var(--color-ink)] transition-colors rounded-full hover:bg-[var(--color-paper)]">
                <SkipBack size={24} fill="currentColor" />
              </button>
              
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-16 h-16 flex items-center justify-center bg-[var(--color-ink)] text-white rounded-full shadow-md hover:scale-105 transition-transform"
              >
                {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
              </button>

              <button onClick={handleNext} className="p-3 text-[var(--color-pencil)] hover:text-[var(--color-ink)] transition-colors rounded-full hover:bg-[var(--color-paper)]">
                <SkipForward size={24} fill="currentColor" />
              </button>
            </div>

            {/* Playlist Toggle */}
            <div className="flex justify-center mt-2">
              <button 
                onClick={() => setIsPlaylistOpen(!isPlaylistOpen)}
                className="flex items-center space-x-2 font-sans text-xs tracking-widest uppercase text-[var(--color-pencil)] hover:text-[var(--color-ink)] transition-colors"
              >
                <ListMusic size={14} />
                <span>{isPlaylistOpen ? 'Hide Playlist' : 'Show Playlist'}</span>
              </button>
            </div>

          </motion.div>
        )}

        {/* THE PLAYLIST DROPDOWN */}
        <AnimatePresence>
          {isPlaylistOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              className="w-full max-w-[95%] bg-white border border-[var(--color-pencil)]/15 rounded-b-3xl shadow-lg overflow-hidden -mt-8 pt-12 z-0"
            >
              <div className="max-h-[350px] overflow-y-auto custom-scrollbar p-4 flex flex-col space-y-1">
                {items.map((item, index) => {
                  const isActive = currentIndex === index
                  return (
                    <div
                      key={item.id}
                      onClick={() => selectTrack(index)}
                      className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${isActive ? 'bg-[var(--color-paper)]' : 'hover:bg-gray-50'}`}
                    >
                      <div className="flex items-center space-x-4 overflow-hidden w-full">
                        {isActive && isPlaying ? (
                          <Music size={14} className="text-[var(--color-highlighter)] shrink-0 animate-bounce" />
                        ) : (
                          <span className="text-[10px] text-[var(--color-pencil)]/50 w-4 font-mono shrink-0 text-center">{index + 1}</span>
                        )}
                        
                        {/* Tiny thumbnail for playlist */}
                        <img src={getThumbnail(item.embed_url)} className="w-10 h-10 rounded-md object-cover opacity-80" alt="" />
                        
                        <div className="flex flex-col truncate w-full pr-2">
                          <span className={`font-serif text-sm truncate ${isActive ? 'text-[var(--color-ink)]' : 'text-[var(--color-ink)]/70 group-hover:text-[var(--color-ink)]'}`}>
                            {item.title}
                          </span>
                          <span className="font-sans text-[10px] text-[var(--color-pencil)] truncate">
                            {item.artist}
                          </span>
                        </div>
                      </div>

                      {isAdmin && (
                        <button onClick={(e) => handleDelete(e, item.id)} className="text-red-400 hover:text-red-600 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  )
}