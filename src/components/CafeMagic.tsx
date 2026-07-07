'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Loader2, MousePointerClick } from 'lucide-react'
import { getMarks, addMark, deleteMark, type MarkItem } from '@/app/actions'

export default function CafeMagic() {
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const [marks, setMarks] = useState<MarkItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // 👻 GHOST ADMIN STATE
  const [isAdmin, setIsAdmin] = useState(false)
  
  // Interaction State
  const [isTyping, setIsTyping] = useState(false)
  const [tempPos, setTempPos] = useState({ x: 0, y: 0 }) // Stored as percentages
  const [newMessage, setNewMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchMarks = async () => {
      try {
        const data = await getMarks()
        setMarks(data)
      } catch (error) {
        console.error("Failed to load marks:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchMarks()
  }, [])

  // Auto-focus input when it opens
  useEffect(() => {
    if (isTyping && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isTyping])

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // If they are already typing, close it (cancel)
    if (isTyping) {
      setIsTyping(false)
      setNewMessage('')
      return
    }

    // Get the exact click coordinates relative to the canvas container
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return

    // Convert pixel click to percentages so it scales on mobile/desktop perfectly
    const percentX = ((e.clientX - rect.left) / rect.width) * 100
    const percentY = ((e.clientY - rect.top) / rect.height) * 100

    setTempPos({ x: percentX, y: percentY })
    setIsTyping(true)
  }

  const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsTyping(false)
      setNewMessage('')
    }
    
    if (e.key === 'Enter' && newMessage.trim()) {
      setIsSubmitting(true)
      try {
        const newMark = await addMark({
          message: newMessage.trim(),
          x_pos: tempPos.x,
          y_pos: tempPos.y
        })
        setMarks(prev => [...prev, newMark])
        setIsTyping(false)
        setNewMessage('')
      } catch (error) {
        console.error("Failed to add mark:", error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation() // Prevent triggering the canvas click
    setMarks(prev => prev.filter(mark => mark.id !== id))
    try {
      await deleteMark(id)
    } catch (error) {
      const data = await getMarks()
      setMarks(data)
    }
  }

  if (isLoading) {
    return (
      <div className="w-full py-32 flex justify-center items-center text-[var(--color-pencil)]">
        <Loader2 className="animate-spin mr-2" size={24} />
        <span className="font-sans">Loading the wall...</span>
      </div>
    )
  }

  return (
    <section id="wall" className="w-full py-32 px-6 md:px-16 flex flex-col items-center bg-[#F9F8F6] border-t border-[var(--color-pencil)]/10">
      <div className="w-full max-w-6xl flex flex-col items-center">
        
        {/* Section Header */}
        <div className="text-center mb-12 flex flex-col items-center">
          <span 
            onDoubleClick={() => setIsAdmin(!isAdmin)}
            className={`font-sans text-xs tracking-[0.2em] uppercase select-none cursor-pointer transition-colors ${isAdmin ? 'text-red-500 font-bold' : 'text-[var(--color-pencil)]'}`}
            title="Double click for Ghost Mode"
          >
            {isAdmin ? '👻 Canvas Admin Active' : 'The Wall'}
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-[var(--color-ink)] mt-4">
            Leave a mark.
          </h2>
          <p className="font-sans text-sm text-[var(--color-pencil)] mt-4 flex items-center justify-center space-x-2">
            <MousePointerClick size={14} />
            <span>Click anywhere to write something.</span>
          </p>
        </div>

        {/* The Digital Canvas */}
        <div 
          ref={containerRef}
          onClick={handleCanvasClick}
          className="relative w-full h-[500px] md:h-[700px] bg-white rounded-3xl border border-[var(--color-pencil)]/20 shadow-sm overflow-hidden cursor-crosshair"
          style={{
            backgroundImage: 'radial-gradient(circle, var(--color-pencil) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0',
            opacity: 0.8
          }}
        >
          
          {/* Render Existing Marks */}
          <AnimatePresence>
            {marks.map((mark) => (
              <motion.div
                key={mark.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                style={{ left: `${mark.x_pos}%`, top: `${mark.y_pos}%` }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
              >
                <span className="inline-block px-3 py-1 bg-[var(--color-ink)] text-white font-handwriting text-lg md:text-xl rounded-sm whitespace-nowrap shadow-md -rotate-2 select-none pointer-events-none">
                  {mark.message}
                </span>
                
                {/* Delete Button (Only in Admin Mode) */}
                {isAdmin && (
                  <button 
                    onClick={(e) => handleDelete(e, mark.id)}
                    className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-50 hover:bg-red-600 cursor-pointer pointer-events-auto"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* The Active Input Box */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                style={{ left: `${tempPos.x}%`, top: `${tempPos.y}%` }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-50"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the input
              >
                <div className="bg-white p-2 rounded-lg shadow-xl border border-[var(--color-pencil)]/30 flex items-center space-x-2">
                  <input
                    ref={inputRef}
                    type="text"
                    maxLength={35}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    disabled={isSubmitting}
                    placeholder="Type and hit Enter..."
                    className="bg-transparent border-none outline-none font-handwriting text-xl text-[var(--color-ink)] w-[200px] placeholder:text-[var(--color-pencil)]/40"
                  />
                  {isSubmitting && <Loader2 size={14} className="text-[var(--color-pencil)] animate-spin" />}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </section>
  )
}