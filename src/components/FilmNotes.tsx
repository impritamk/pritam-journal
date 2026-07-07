'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Film, PlayCircle, Plus, Inbox, Check, ChevronDown, Loader2, Eye, ListPlus, Trash2 } from 'lucide-react'
import { getMediaItems, addMediaItem, updateMediaStatus, deleteMediaItem, type MediaItem } from '@/app/actions'

const predefinedGenres = [
  'Action', 'Sci-Fi', 'Thriller', 'Drama', 'Comedy', 'Dark Comedy', 
  'Horror', 'Romance', 'Mystery', 'Fantasy', 'Psychological', 'Crime', 'Documentary'
]

export default function FilmNotes() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'watched' | 'watchlist' | 'recommended'>('watched')
  
  // 👻 THE SECRET GHOST MODE STATE
  const [isAdmin, setIsAdmin] = useState(false)
  
  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newCategory, setNewCategory] = useState<MediaItem['category']>('Movie')
  const [newGenre, setNewGenre] = useState(predefinedGenres[0])
  const [newStatus, setNewStatus] = useState<MediaItem['status']>('watched') // Admin can choose
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Fetch from Neon DB on load
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await getMediaItems()
        setItems(data)
      } catch (error) {
        console.error("Failed to load movies:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchMovies()
  }, [])

  const displayedItems = items.filter(item => item.status === activeTab)

  // Add a new item
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    setIsSubmitting(true)

    // If visitor, force status to 'recommended'. If Admin, use selected status.
    const finalStatus = isAdmin ? newStatus : 'recommended'

    try {
      const insertedItem = await addMediaItem({
        title: newTitle,
        status: finalStatus,
        category: newCategory,
        genre: newGenre,
        note: isAdmin ? '' : 'Recommended by a visitor.'
      })

      setItems(prev => [insertedItem, ...prev])
      setNewTitle('')
      setNewGenre(predefinedGenres[0])
      setNewCategory('Movie')
      setIsFormOpen(false)
      setIsSubmitted(true)
      
      setActiveTab(finalStatus)
      setTimeout(() => setIsSubmitted(false), 3000)
    } catch (error) {
      console.error("Failed to add movie:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Update existing item status (Admin Only)
  const handleMoveItem = async (id: string, targetStatus: 'watched' | 'watchlist' | 'recommended') => {
    // Optimistic UI update for instant feedback
    setItems(prev => prev.map(item => item.id === id ? { ...item, status: targetStatus } : item))
    
    try {
      // Actually update the Neon DB in the background
      await updateMediaStatus(id, targetStatus)
    } catch (error) {
      console.error("Failed to move item:", error)
      // Revert if it fails
      const data = await getMediaItems()
      setItems(data)
    }
  }

  // Ghost Admin: Delete Track
  const handleDelete = async (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
    try {
      await deleteMediaItem(id)
    } catch (error) {
      console.error("Failed to delete movie:", error)
      const data = await getMediaItems()
      setItems(data)
    }
  }

  const renderCategoryBlock = (title: string, categoryData: MediaItem[]) => {
    if (categoryData.length === 0) return null
    return (
      <div className="mb-16 w-full">
        <h3 className="font-sans text-xs tracking-[0.2em] uppercase text-[var(--color-pencil)] mb-8 border-b border-[var(--color-pencil)]/10 pb-4">
          {title} <span className="opacity-50 ml-2">({categoryData.length})</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryData.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="group relative bg-white p-6 rounded-xl border border-[var(--color-pencil)]/15 shadow-sm hover:shadow-md transition-all flex flex-col h-full overflow-hidden"
            >
              
              {/* 👻 GHOST ADMIN DELETE BUTTON */}
              {isAdmin && (
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="absolute top-3 right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-50 hover:bg-red-600 hover:scale-110"
                  title="Remove from DB"
                >
                  <Trash2 size={14} />
                </button>
              )}

              <div className="flex justify-between items-start mb-4">
                <span className="font-sans text-[10px] tracking-widest uppercase bg-[var(--color-paper)] text-[var(--color-pencil)] px-3 py-1 rounded-sm">
                  {item.category}
                </span>
                <span className="font-sans text-xs text-[var(--color-pencil)]/60 text-right pr-6 group-hover:pr-0 transition-all">
                  {item.genre}
                </span>
              </div>
              <h4 className="font-serif text-2xl text-[var(--color-ink)] mb-2 leading-tight group-hover:text-[var(--color-highlighter)] transition-colors duration-300">
                {item.title}
              </h4>
              {item.note && (
                <div className="mt-auto pt-6 border-t border-[var(--color-pencil)]/10">
                  <p className="font-handwriting text-xl text-[var(--color-ink)]/90 leading-snug transform -rotate-1">
                    "{item.note}"
                  </p>
                </div>
              )}

              {/* 👻 GHOST ADMIN STATUS CONTROLS */}
              <AnimatePresence>
                {isAdmin && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-[var(--color-pencil)]/20 p-3 flex justify-around shadow-[0_-10px_20px_rgba(0,0,0,0.05)] transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-40"
                  >
                    {item.status !== 'watched' && (
                      <button onClick={() => handleMoveItem(item.id, 'watched')} className="p-2 text-[var(--color-pencil)] hover:text-green-600 transition-colors" title="Mark as Watched">
                        <Eye size={18} />
                      </button>
                    )}
                    {item.status !== 'watchlist' && (
                      <button onClick={() => handleMoveItem(item.id, 'watchlist')} className="p-2 text-[var(--color-pencil)] hover:text-blue-600 transition-colors" title="Move to Up Next">
                        <ListPlus size={18} />
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="w-full py-32 flex justify-center items-center text-[var(--color-pencil)]">
        <Loader2 className="animate-spin mr-2" size={24} />
        <span className="font-sans">Loading Archives...</span>
      </div>
    )
  }

  return (
    <section id="movies" className="w-full py-32 px-6 md:px-16 flex flex-col items-center border-t border-[var(--color-pencil)]/10">
      <div className="w-full max-w-5xl">
        
        {/* Editorial Header */}
        <div className="flex flex-col items-start mb-16 space-y-4">
          <span 
            onDoubleClick={() => setIsAdmin(!isAdmin)}
            className={`font-sans text-xs tracking-[0.2em] uppercase select-none cursor-pointer transition-colors ${isAdmin ? 'text-red-500 font-bold' : 'text-[var(--color-pencil)]'}`}
            title="Double click for Ghost Mode"
          >
            {isAdmin ? '👻 Admin Mode Active' : 'The Archives'}
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-[var(--color-ink)]">
            Screen Time Gallery.
          </h2>
          <p className="font-sans text-lg text-[var(--color-pencil)] max-w-xl font-light">
            Albums of things I've seen, things I need to see, and things you think I should see.
          </p>
        </div>

        {/* ... (The rest of the component remains exactly the same as above) ... */}
        {/* The Album Tabs */}
        <div className="flex flex-wrap gap-4 mb-12 border-b border-[var(--color-pencil)]/15 pb-6">
          {[
            { id: 'watched', label: 'Already Watched', icon: Film },
            { id: 'watchlist', label: 'Up Next', icon: PlayCircle },
            { id: 'recommended', label: 'Visitor Recommendations', icon: Inbox }
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-full font-sans text-sm transition-all duration-300 ${
                  isActive 
                    ? 'bg-[var(--color-ink)] text-white shadow-md' 
                    : 'bg-white text-[var(--color-pencil)] border border-[var(--color-pencil)]/20 hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${isActive ? 'bg-white/20' : 'bg-[var(--color-paper)]'}`}>
                  {items.filter(i => i.status === tab.id).length}
                </span>
              </button>
            )
          })}
        </div>

        {/* The Interactive Form */}
        <div className="mb-16">
          {!isFormOpen ? (
            <button 
              onClick={() => setIsFormOpen(true)}
              className="group flex items-center space-x-2 font-sans text-sm text-[var(--color-pencil)] hover:text-[var(--color-ink)] transition-colors"
            >
              <div className="w-8 h-8 rounded-full border border-[var(--color-pencil)]/30 flex items-center justify-center group-hover:bg-[var(--color-ink)] group-hover:border-[var(--color-ink)] group-hover:text-white transition-all">
                {isSubmitted ? <Check size={14} /> : <Plus size={14} />}
              </div>
              <span>{isSubmitted ? 'Added!' : isAdmin ? 'Add directly to gallery...' : 'Leave a recommendation...'}</span>
            </button>
          ) : (
            <motion.form 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleAddSubmit}
              className={`p-6 rounded-2xl border shadow-sm max-w-2xl ${isAdmin ? 'bg-red-50/50 border-red-200' : 'bg-white border-[var(--color-pencil)]/20'}`}
            >
              <div className="flex justify-between items-center mb-6 border-b border-[var(--color-pencil)]/10 pb-4">
                <h3 className="font-serif text-2xl text-[var(--color-ink)]">
                  {isAdmin ? '👻 Owner Panel' : 'Slip me a note.'}
                </h3>
                <button type="button" onClick={() => setIsFormOpen(false)} className="text-[var(--color-pencil)] hover:text-[var(--color-ink)] text-sm">Cancel</button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex flex-col space-y-2">
                  <label className="font-sans text-xs tracking-wider uppercase text-[var(--color-pencil)]">Title</label>
                  <input required value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="e.g. Severance" className="bg-[var(--color-paper)] px-4 py-3 rounded-lg font-sans text-sm outline-none focus:ring-1 focus:ring-[var(--color-ink)]" />
                </div>
                
                <div className="flex flex-col space-y-2 relative">
                  <label className="font-sans text-xs tracking-wider uppercase text-[var(--color-pencil)]">Genre</label>
                  <div className="relative">
                    <select 
                      value={newGenre} 
                      onChange={e => setNewGenre(e.target.value)} 
                      className="w-full bg-[var(--color-paper)] px-4 py-3 rounded-lg font-sans text-sm outline-none focus:ring-1 focus:ring-[var(--color-ink)] appearance-none cursor-pointer"
                    >
                      {predefinedGenres.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[var(--color-pencil)] pointer-events-none" />
                  </div>
                </div>

                {/* GHOST ADMIN ONLY: Choose where it goes */}
                {isAdmin && (
                   <div className="flex flex-col space-y-2 relative md:col-span-2 border-t border-[var(--color-pencil)]/10 pt-4 mt-2">
                     <label className="font-sans text-xs tracking-wider uppercase text-red-500">Destination Album</label>
                     <div className="relative">
                       <select 
                         value={newStatus} 
                         onChange={e => setNewStatus(e.target.value as any)} 
                         className="w-full bg-[var(--color-paper)] px-4 py-3 rounded-lg font-sans text-sm outline-none border border-red-200 focus:ring-1 focus:ring-red-400 appearance-none cursor-pointer"
                       >
                         <option value="watched">Already Watched</option>
                         <option value="watchlist">Up Next</option>
                         <option value="recommended">Visitor Recommendations</option>
                       </select>
                       <ChevronDown size={16} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[var(--color-pencil)] pointer-events-none" />
                     </div>
                   </div>
                )}
                
                <div className="flex flex-col space-y-2 md:col-span-2">
                  <label className="font-sans text-xs tracking-wider uppercase text-[var(--color-pencil)]">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {['Movie', 'TV Show', 'Anime', 'Uncategorized'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setNewCategory(cat as any)}
                        className={`px-4 py-2 rounded-full font-sans text-xs transition-colors border ${newCategory === cat ? 'bg-[var(--color-ink)] text-white border-[var(--color-ink)]' : 'bg-transparent text-[var(--color-pencil)] border-[var(--color-pencil)]/20 hover:border-[var(--color-ink)]'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full py-3 text-white rounded-lg font-sans text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex justify-center items-center ${isAdmin ? 'bg-red-500' : 'bg-[var(--color-ink)]'}`}
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : isAdmin ? 'Force Add to Database' : 'Add to Archive'}
              </button>
            </motion.form>
          )}
        </div>

        {/* The Categorized Gallery Grid */}
        <motion.div layout className="w-full flex flex-col">
          <AnimatePresence mode="popLayout">
            {displayedItems.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="w-full py-12 flex justify-center border border-dashed border-[var(--color-pencil)]/20 rounded-2xl"
              >
                <p className="font-sans text-[var(--color-pencil)]">This album is currently empty.</p>
              </motion.div>
            ) : (
              <>
                {renderCategoryBlock("Cinematic", displayedItems.filter(i => i.category === 'Movie'))}
                {renderCategoryBlock("Television & Series", displayedItems.filter(i => i.category === 'TV Show'))}
                {renderCategoryBlock("Anime", displayedItems.filter(i => i.category === 'Anime'))}
                {renderCategoryBlock("Unsorted", displayedItems.filter(i => i.category === 'Uncategorized'))}
              </>
            )}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  )
}