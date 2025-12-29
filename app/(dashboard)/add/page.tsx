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
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold font-grotesk text-black mb-12 tracking-tight">
        Add Entry
      </h1>

      <form action={handleSubmit} className="space-y-8">
        {/* Tipo de contenido */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-black mb-2">
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
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-[#35553D] focus:border-transparent transition-all"
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
          <label htmlFor="title" className="block text-sm font-medium text-black mb-2">
            Title {selectedType && <span className="text-gray-400 text-xs font-normal ml-2">Start typing to search</span>}
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
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <label className="block text-sm font-medium text-black mb-3">
              Cover {author && <span className="text-gray-500 font-normal">· {author}</span>}
            </label>
            <div className="relative h-48 w-32 mx-auto bg-gray-100 rounded-lg overflow-hidden">
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
          <label className="block text-sm font-medium text-black mb-2">
            Additional Image <span className="text-gray-400 text-xs font-normal">(optional)</span>
          </label>
          <p className="text-xs text-gray-500 mb-3">
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
            <div className="w-full px-4 py-8 bg-white border-2 border-dashed border-gray-200 rounded-xl hover:border-[#35553D] hover:bg-gray-50 transition-all text-center">
              <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-sm text-gray-500">Click to upload image</span>
            </div>
          </label>
          {additionalImagePreview && (
            <div className="mt-4 relative w-full aspect-square rounded-xl overflow-hidden bg-gray-100">
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
          <label htmlFor="description" className="block text-sm font-medium text-black mb-2">
            Thoughts <span className="text-gray-400 text-xs font-normal">(optional)</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-[#35553D] focus:border-transparent transition-all resize-none"
            placeholder="What did you think?"
          />
        </div>

        {/* Calificación */}
        <div>
          <label htmlFor="rating" className="block text-sm font-medium text-black mb-2">
            Rating <span className="text-gray-400 text-xs font-normal">(optional)</span>
          </label>
          <select
            id="rating"
            name="rating"
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-[#35553D] focus:border-transparent transition-all"
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
        <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200">
          <input
            id="is_public"
            name="is_public"
            type="checkbox"
            className="w-5 h-5 text-[#35553D] bg-white border-gray-300 rounded focus:ring-2 focus:ring-[#35553D] transition-all"
          />
          <label htmlFor="is_public" className="text-sm font-medium text-black cursor-pointer">
            Make public <span className="text-gray-500 font-normal">(will appear in feed)</span>
          </label>
        </div>

        {/* Botón submit */}
        <button
          type="submit"
          className="w-full bg-[#35553D] text-white px-6 py-4 rounded-xl font-medium hover:bg-[#2a4430] transition-all shadow-sm hover:shadow-md"
        >
          Save Entry
        </button>
      </form>
    </div>
  )
}