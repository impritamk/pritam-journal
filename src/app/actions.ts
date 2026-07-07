'use server'

import { Pool, neonConfig } from '@neondatabase/serverless'
import ws from 'ws' 

// 1. Tell Neon to use this specific WebSocket tool for Node.js
neonConfig.webSocketConstructor = ws

// 2. Create ONE global direct WebSocket connection Pool for everything
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

// ==========================================
// MEDIA (MOVIES/TV)
// ==========================================
export type MediaItem = {
  id: string
  title: string
  status: 'watched' | 'watchlist' | 'recommended'
  category: 'Movie' | 'TV Show' | 'Anime' | 'Uncategorized'
  genre: string
  note?: string
}

export async function getMediaItems(): Promise<MediaItem[]> {
  if (!process.env.DATABASE_URL) return []
  const { rows } = await pool.query('SELECT * FROM media_items ORDER BY created_at DESC')
  return rows as MediaItem[]
}

export async function addMediaItem(item: Omit<MediaItem, 'id'>) {
  if (!process.env.DATABASE_URL) throw new Error("No Database URL")
  const { rows } = await pool.query(
    `INSERT INTO media_items (title, status, category, genre, note) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [item.title, item.status, item.category, item.genre, item.note]
  )
  return rows[0] as MediaItem
}

export async function updateMediaStatus(id: string, newStatus: 'watched' | 'watchlist' | 'recommended') {
  if (!process.env.DATABASE_URL) throw new Error("No Database URL")
  const { rows } = await pool.query(
    `UPDATE media_items SET status = $1 WHERE id = $2 RETURNING *`,
    [newStatus, id]
  )
  return rows[0] as MediaItem
}
export async function deleteMediaItem(id: string) {
  if (!process.env.DATABASE_URL) throw new Error("No Database URL")
  await pool.query(`DELETE FROM media_items WHERE id = $1`, [id])
  return true
}

// ==========================================
// AUDIO
// ==========================================
export type AudioItem = {
  id: string
  title: string
  artist: string
  embed_url: string
  category: string
  note?: string
}

export async function getAudioItems(): Promise<AudioItem[]> {
  if (!process.env.DATABASE_URL) return []
  const { rows } = await pool.query('SELECT * FROM audio_items ORDER BY created_at DESC')
  return rows as AudioItem[]
}

export async function addAudioItem(item: Omit<AudioItem, 'id'>) {
  if (!process.env.DATABASE_URL) throw new Error("No Database URL")
  const { rows } = await pool.query(
    `INSERT INTO audio_items (title, artist, embed_url, category, note) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [item.title, item.artist, item.embed_url, item.category, item.note]
  )
  
  return rows[0] as AudioItem
}
export async function deleteAudioItem(id: string) {
  if (!process.env.DATABASE_URL) throw new Error("No Database URL")
  await pool.query(`DELETE FROM audio_items WHERE id = $1`, [id])
  return true
}

// ==========================================
// POLAROIDS
// ==========================================
export type PolaroidItem = {
  id: string
  url: string
  caption: string
  rotate: number
  x_pos: number
  y_pos: number
}

export async function getPolaroids(): Promise<PolaroidItem[]> {
  if (!process.env.DATABASE_URL) return []
  const { rows } = await pool.query('SELECT * FROM polaroids ORDER BY created_at ASC')
  return rows as PolaroidItem[]
}

export async function addPolaroid(item: Omit<PolaroidItem, 'id'>) {
  if (!process.env.DATABASE_URL) throw new Error("No Database URL")
  const { rows } = await pool.query(
    `INSERT INTO polaroids (url, caption, rotate, x_pos, y_pos) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [item.url, item.caption, item.rotate, item.x_pos, item.y_pos]
  )
  return rows[0] as PolaroidItem
}

export async function deletePolaroid(id: string) {
  if (!process.env.DATABASE_URL) throw new Error("No Database URL")
  await pool.query(`DELETE FROM polaroids WHERE id = $1`, [id])
  return true
}

// ==========================================
// GUESTBOOK MARKS
// ==========================================
export type MarkItem = {
  id: string
  message: string
  x_pos: number
  y_pos: number
}

export async function getMarks(): Promise<MarkItem[]> {
  if (!process.env.DATABASE_URL) return []
  const { rows } = await pool.query('SELECT * FROM guestbook_marks ORDER BY created_at ASC')
  return rows as MarkItem[]
}

export async function addMark(item: Omit<MarkItem, 'id'>) {
  if (!process.env.DATABASE_URL) throw new Error("No Database URL")
  const { rows } = await pool.query(
    `INSERT INTO guestbook_marks (message, x_pos, y_pos) VALUES ($1, $2, $3) RETURNING *`,
    [item.message, item.x_pos, item.y_pos]
  )
  return rows[0] as MarkItem
}

export async function deleteMark(id: string) {
  if (!process.env.DATABASE_URL) throw new Error("No Database URL")
  await pool.query(`DELETE FROM guestbook_marks WHERE id = $1`, [id])
  return true
}