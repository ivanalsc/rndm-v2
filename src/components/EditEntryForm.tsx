'use client'

import { updateEntry } from '../../app/actions/entries'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Entry {
  id: string
  type: string
  title: string
  author_artist: string | null
  cover_image_url: string | null
  additional_image_url: string | null
  description: string | null
  rating: number | null
  is_public: boolean
}

export default function EditEntryForm({ entry }: { entry: Entry }) {
  const [additionalImagePreview, setAdditionalImagePreview] = useState<string | null>(
    entry.additional_image_url
  )

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAdditionalImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setAdditionalImagePreview(entry.additional_image_url)
    }
  }

  const handleSubmit = async (formData: FormData) => {
    await updateEntry(entry.id, formData)
  }

  return (
    <div className="max-w-2xl mx-auto px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-5xl font-bold font-grotesk text-black tracking-tight neobrutal-border bg-white px-6 py-4 inline-block neobrutal-shadow uppercase">
          Edit Entry
        </h1>
        <Link
          href="/my-entries"
          className="text-sm font-bold text-black bg-white px-4 py-2 neobrutal-border neobrutal-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all uppercase"
        >
          Cancel
        </Link>
      </div>

      <form action={handleSubmit} className="space-y-8">
        {/* Tipo de contenido (no editable) */}
        <div>
          <label className="block text-sm font-bold text-black mb-2 uppercase">
            Type
          </label>
          <div className="px-4 py-3 bg-white neobrutal-border neobrutal-shadow-sm text-black font-bold uppercase">
            {entry.type === 'book' && '📚 Book'}
            {entry.type === 'music' && '🎵 Music'}
            {entry.type === 'movie' && '🎬 Movie'}
            {entry.type === 'series' && '📺 Series'}
          </div>
        </div>

        {/* Título (no editable) */}
        <div>
          <label className="block text-sm font-bold text-black mb-2 uppercase">
            Title
          </label>
          <input
            type="text"
            name="title"
            defaultValue={entry.title}
            required
            className="w-full px-4 py-3 bg-white neobrutal-border neobrutal-shadow-sm text-black font-bold focus:outline-none focus:bg-[#00F5FF] focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all uppercase"
          />
        </div>

        {/* Cover (no editable, solo muestra) */}
        {entry.cover_image_url && (
          <div className="bg-white neobrutal-border neobrutal-shadow-sm p-6">
            <label className="block text-sm font-bold text-white mb-3 uppercase">
              Cover {entry.author_artist && <span className="text-white font-bold">· {entry.author_artist}</span>}
            </label>
            <div className="relative h-48 w-32 mx-auto bg-white neobrutal-border neobrutal-shadow-sm overflow-hidden">
              <Image
                src={entry.cover_image_url}
                alt="Cover"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        )}

        {/* Imagen adicional */}
        <div>
          <label className="block text-sm font-bold text-black mb-2 uppercase">
            Additional Image <span className="text-black text-xs font-bold">(optional)</span>
          </label>
          <p className="text-xs text-black font-bold mb-3 uppercase">
            Upload a new image to replace the current one
          </p>
          <label className="block w-full cursor-pointer">
            <input
              type="file"
              name="additional_image"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <div className="w-full px-4 py-8 bg-white neobrutal-border neobrutal-shadow-sm hover:bg-[#00F5FF] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all text-center">
              <svg className="w-8 h-8 mx-auto mb-2 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-sm text-white font-bold uppercase">Click to upload new image</span>
            </div>
          </label>
          {additionalImagePreview && (
            <div className="mt-4 relative w-full aspect-square neobrutal-border neobrutal-shadow-sm overflow-hidden bg-white">
              <Image
                src={additionalImagePreview}
                alt="Preview"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}
        </div>

        {/* Descripción */}
        <div>
          <label htmlFor="description" className="block text-sm font-bold text-black mb-2 uppercase">
            Thoughts <span className="text-black text-xs font-bold">(optional)</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={entry.description || ''}
            className="w-full px-4 py-3 bg-white neobrutal-border neobrutal-shadow-sm text-black font-bold focus:outline-none focus:bg-[#00F5FF] focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all resize-none uppercase placeholder:text-black placeholder:opacity-70"
            placeholder="What did you think?"
          />
        </div>

        {/* Calificación */}
        <div>
          <label htmlFor="rating" className="block text-sm font-bold text-black mb-2 uppercase">
            Rating <span className="text-black text-xs font-bold">(optional)</span>
          </label>
          <select
            id="rating"
            name="rating"
            defaultValue={entry.rating?.toString() || ''}
            className="w-full px-4 py-4 bg-white neobrutal-border neobrutal-shadow-sm text-black font-bold focus:outline-none focus:bg-[#00F5FF] focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all uppercase"
          >
            <option value="">No rating</option>
            <option value="1">⬤ ○ ○ ○ ○</option>
            <option value="2">⬤ ⬤ ○ ○ ○</option>
            <option value="3">⬤ ⬤ ⬤ ○ ○</option>
            <option value="4">⬤ ⬤ ⬤ ⬤ ○</option>
            <option value="5">⬤ ⬤ ⬤ ⬤ ⬤</option>
          </select>
        </div>

        {/* Público/Privado */}
        <div className="flex items-center gap-3 p-4 bg-white neobrutal-border neobrutal-shadow-sm">
          <input
            id="is_public"
            name="is_public"
            type="checkbox"
            defaultChecked={entry.is_public}
            className="w-6 h-6 text-black bg-white neobrutal-border focus:ring-0 focus:ring-offset-0 transition-all"
          />
          <label htmlFor="is_public" className="text-sm font-bold text-black cursor-pointer uppercase">
            Make public <span className="text-black font-bold">(will appear in feed)</span>
          </label>
        </div>

        {/* Botones */}
        <div className="flex gap-4">
          <Link
            href="/my-entries"
            className="flex-1 text-center px-6 py-4 neobrutal-border neobrutal-shadow-sm font-bold bg-white text-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all uppercase"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="flex-1 bg-[#00F5FF] text-black px-6 py-4 neobrutal-border neobrutal-shadow font-bold hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all uppercase"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}