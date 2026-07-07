'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Loader2, Trash2 } from 'lucide-react'
import { getPolaroids, addPolaroid, deletePolaroid, type PolaroidItem } from '@/app/actions'

export default function MemoriesScatter() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [items, setItems] = useState<PolaroidItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // 👻 GHOST ADMIN STATE
  const [isAdmin, setIsAdmin] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  
  // Form State
  const [newUrl, setNewUrl] = useState('')
  const [newCaption, setNewCaption] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const data = await getPolaroids()
        setItems(data)
      } catch (error) {
        console.error("Failed to load polaroids:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPhotos()
  }, [])

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUrl.trim() || !newCaption.trim()) return
    setIsSubmitting(true)

    // Generate random scatter math
    const randomRotate = Math.floor(Math.random() * 20) - 10 // Between -10 and 10 degrees
    const randomX = Math.floor(Math.random() * 200) - 100 // Between -100 and 100 px
    const randomY = Math.floor(Math.random() * 200) - 100 // Between -100 and 100 px

    try {
      const insertedItem = await addPolaroid({
        url: newUrl,
        caption: newCaption,
        rotate: randomRotate,
        x_pos: randomX,
        y_pos: randomY
      })

      setItems(prev => [...prev, insertedItem])
      setNewUrl('')
      setNewCaption('')
      setIsFormOpen(false)
    } catch (error) {
      console.error("Failed to add polaroid:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    // Optimistic UI update
    setItems(prev => prev.filter(item => item.id !== id))
    try {
      await deletePolaroid(id)
    } catch (error) {
      console.error("Failed to delete polaroid:", error)
      // Revert on failure
      const data = await getPolaroids()
      setItems(data)
    }
  }

  if (isLoading) {
    return (
      <div className="w-full py-32 flex justify-center items-center text-[var(--color-pencil)]">
        <Loader2 className="animate-spin mr-2" size={24} />
        <span className="font-sans">Developing photos...</span>
      </div>
    )
  }

  return (
    <section className="w-full py-32 px-6 md:px-16 flex flex-col items-center overflow-hidden border-t border-[var(--color-pencil)]/10 bg-white">
      <div className="w-full max-w-5xl flex flex-col items-center">
        
        {/* Section Header */}
        <div className="text-center mb-16 flex flex-col items-center">
          <span 
            onDoubleClick={() => setIsAdmin(!isAdmin)}
            className={`font-sans text-xs tracking-[0.2em] uppercase select-none cursor-pointer transition-colors ${isAdmin ? 'text-red-500 font-bold' : 'text-[var(--color-pencil)]'}`}
            title="Double click for Ghost Mode"
          >
            {isAdmin ? '👻 Photo Admin Active' : 'Moments'}
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-[var(--color-ink)] mt-4">
            Scattered pieces.
          </h2>
          <p className="font-sans text-sm text-[var(--color-pencil)] mt-4 opacity-60 italic">
            (Feel free to drag them around)
          </p>
        </div>

        {/* 👻 GHOST ADMIN FORM */}
        <AnimatePresence>
          {isAdmin && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full max-w-lg mb-8 overflow-hidden"
            >
              {!isFormOpen ? (
                <button onClick={() => setIsFormOpen(true)} className="flex items-center justify-center w-full space-x-2 text-sm text-red-500 hover:text-red-600 transition-colors py-4 border border-red-200 border-dashed rounded-xl bg-red-50/50">
                  <Plus size={16} /> <span>Toss a new photo on the table...</span>
                </button>
              ) : (
                <form onSubmit={handleAddSubmit} className="bg-red-50/50 p-6 rounded-2xl border border-red-200 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-serif text-xl text-[var(--color-ink)]">New Polaroid</h3>
                    <button type="button" onClick={() => setIsFormOpen(false)} className="text-[var(--color-pencil)] text-sm">Cancel</button>
                  </div>
                  
                  <div className="space-y-4">
                    <input required value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="Image URL (e.g. Unsplash or Imgur link)" className="w-full bg-white px-4 py-2 rounded-lg font-sans text-sm outline-none border border-red-100" />
                    <input required value={newCaption} onChange={e => setNewCaption(e.target.value)} placeholder="Handwritten Caption" className="w-full bg-white px-4 py-2 rounded-lg font-sans text-sm outline-none border border-red-100" />
                    
                    <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-red-500 text-white rounded-lg font-sans text-sm hover:bg-red-600 transition-colors flex justify-center items-center">
                      {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : 'Drop on Table'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* The Interactive Desk Area */}
        <div 
          ref={containerRef} 
          className="relative w-full h-[600px] bg-[#F9F8F6] rounded-3xl border border-[var(--color-pencil)]/10 flex items-center justify-center shadow-inner overflow-hidden"
        >
          <AnimatePresence>
            {items.map((polaroid, index) => (
              <motion.div
                key={polaroid.id}
                drag
                dragConstraints={containerRef}
                dragElastic={0.2}
                dragMomentum={false}
                whileDrag={{ scale: 1.05, cursor: "grabbing", zIndex: 50, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1, rotate: polaroid.rotate, x: polaroid.x_pos, y: polaroid.y_pos }}
                exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                transition={{ 
                  type: "spring", 
                  stiffness: 260, 
                  damping: 20,
                  opacity: { duration: 0.3 }
                }}
                style={{ zIndex: index + 10 }} // Stacks newer photos on top naturally
                className="absolute p-3 pb-10 bg-white shadow-xl border border-gray-100 rounded-sm cursor-grab active:cursor-grabbing w-[220px] md:w-[260px] group"
              >
                
                {/* Delete Button (Only in Admin Mode) */}
                {isAdmin && (
                  <button 
                    onClick={() => handleDelete(polaroid.id)}
                    className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-50 hover:bg-red-600 hover:scale-110"
                    title="Remove Photo"
                  >
                    <Trash2 size={14} />
                  </button>
                )}

                <div className="w-full aspect-square bg-gray-100 overflow-hidden pointer-events-none">
                  <img 
                    src={polaroid.url} 
                    alt={polaroid.caption}
                    className="w-full h-full object-cover select-none"
                    draggable={false}
                  />
                </div>
                <div className="absolute bottom-3 left-0 w-full text-center pointer-events-none">
                  <span className="font-handwriting text-xl text-[var(--color-ink)]/90 -rotate-2 inline-block">
                    {polaroid.caption}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </section>
  )
}