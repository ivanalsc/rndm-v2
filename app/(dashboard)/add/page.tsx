// src/app/(dashboard)/add/page.tsx
'use client'

import { createEntry } from '../../actions/entries'
import { useState } from 'react'
import Image from 'next/image'
import AutocompleteInput from '@/components/AutocompleteInput'
import { SearchResult } from '@/lib/api-search'

export default function AddEntryPage() {
  const [additionalImagePreview, setAdditionalImagePreview] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string>('')
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [coverUrl, setCoverUrl] = useState('')
  const [author, setAuthor] = useState('')

  const handleSubmit = async (formData: FormData) => {
    await createEntry(formData)
  }

  const handleAdditionalImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAdditionalImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setAdditionalImagePreview(null)
    }
  }

  const handleAutocompleteSelect = (result: SearchResult) => {
    setAuthor(result.author_artist || '')
    if (result.cover_image_url) {
      setCoverUrl(result.cover_image_url)
      setCoverPreview(result.cover_image_url)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4">
      <h1 className="text-5xl font-bold font-grotesk text-black mb-12 tracking-tight neobrutal-border bg-white px-6 py-4 inline-block neobrutal-shadow uppercase">
        Add Entry
      </h1>

      <form action={handleSubmit} className="space-y-8">
        {/* Tipo de contenido */}
        <div>
          <label htmlFor="type" className="block text-sm font-bold text-black mb-2 uppercase">
            Type
          </label>
          <select
            id="type"
            name="type"
            required
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value)
              setCoverPreview(null)
              setCoverUrl('')
              setAuthor('')
            }}
            className="w-full px-4 py-4 bg-white neobrutal-border neobrutal-shadow-sm text-black font-bold focus:outline-none focus:bg-[#00F5FF] focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all uppercase"
          >
            <option value="">Select type</option>
            <option value="book">📚 Book</option>
            <option value="music">🎵 Music</option>
            <option value="movie">🎬 Movie</option>
            <option value="series">📺 Series</option>
          </select>
        </div>

        {/* Título con autocompletado */}
        <div>
          <label htmlFor="title" className="block text-sm font-bold text-black mb-2 uppercase">
            Title {selectedType && <span className="text-black text-xs font-bold ml-2">(Start typing to search)</span>}
          </label>
          <AutocompleteInput
            key={selectedType}
            type={selectedType}
            onSelect={handleAutocompleteSelect}
          />
        </div>

        {/* Campo oculto para el autor/artista */}
        <input type="hidden" name="author_artist" value={author} />

        {/* Portada autocompletada */}
        {coverPreview && (
          <div className="bg-white neobrutal-border neobrutal-shadow-sm p-6">
            <label className="block text-sm font-bold text-black mb-3 uppercase">
              Cover {author && <span className="text-black font-bold">· {author}</span>}
            </label>
            <div className="relative h-48 w-32 mx-auto bg-white neobrutal-border neobrutal-shadow-sm overflow-hidden">
              <Image
                src={coverPreview}
                alt="Cover"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <input type="hidden" name="cover_image_url" value={coverUrl} />
          </div>
        )}

        {/* Imagen adicional opcional */}
        <div>
          <label className="block text-sm font-bold text-black mb-2 uppercase">
            Additional Image <span className="text-black text-xs font-bold">(optional)</span>
          </label>
          <p className="text-xs text-black font-bold mb-3 uppercase">
            Add a personal photo with the book/album, screenshot, etc.
          </p>
          <label className="block w-full cursor-pointer">
            <input
              type="file"
              id="additional_image"
              name="additional_image"
              accept="image/*"
              onChange={handleAdditionalImageChange}
              className="hidden"
            />
            <div className="w-full px-4 py-8 bg-white neobrutal-border neobrutal-shadow-sm hover:bg-[#00F5FF] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all text-center">
              <svg className="w-8 h-8 mx-auto mb-2 text-black" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-sm text-black font-bold uppercase">Click to upload image</span>
            </div>
          </label>
          {additionalImagePreview && (
            <div className="mt-4 relative w-full aspect-square neobrutal-border neobrutal-shadow-sm overflow-hidden bg-white">
              <Image
                src={additionalImagePreview}
                alt="Preview"
                fill
                className="object-cover"
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
            className="w-6 h-6 text-black bg-white neobrutal-border focus:ring-0 focus:ring-offset-0 transition-all"
          />
          <label htmlFor="is_public" className="text-sm font-bold text-white cursor-pointer uppercase">
            Make public <span className="text-white font-bold">(will appear in feed)</span>
          </label>
        </div>

        {/* Botón submit */}
        <button
          type="submit"
          className="w-full bg-[#00F5FF] text-black px-6 py-4 neobrutal-border neobrutal-shadow font-bold hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all uppercase"
        >
          Save Entry
        </button>
      </form>
    </div>
  )
}