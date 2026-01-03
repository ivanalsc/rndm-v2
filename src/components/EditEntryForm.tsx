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
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold font-grotesk text-black tracking-tight">
          Edit Entry
        </h1>
        <Link
          href="/my-entries"
          className="text-sm text-gray-500 hover:text-black transition-colors"
        >
          Cancel
        </Link>
      </div>

      <form action={handleSubmit} className="space-y-8">
        {/* Tipo de contenido (no editable) */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Type
          </label>
          <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-600">
            {entry.type === 'book' && '📚 Book'}
            {entry.type === 'music' && '🎵 Music'}
            {entry.type === 'movie' && '🎬 Movie'}
            {entry.type === 'series' && '📺 Series'}
          </div>
        </div>

        {/* Título (no editable) */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Title
          </label>
          <input
            type="text"
            name="title"
            defaultValue={entry.title}
            required
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-[#35553D] focus:border-transparent transition-all"
          />
        </div>

        {/* Cover (no editable, solo muestra) */}
        {entry.cover_image_url && (
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <label className="block text-sm font-medium text-black mb-3">
              Cover {entry.author_artist && <span className="text-gray-500 font-normal">· {entry.author_artist}</span>}
            </label>
            <div className="relative h-48 w-32 mx-auto bg-gray-100 rounded-lg overflow-hidden">
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
          <label className="block text-sm font-medium text-black mb-2">
            Additional Image <span className="text-gray-400 text-xs font-normal">(optional)</span>
          </label>
          <p className="text-xs text-gray-500 mb-3">
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
            <div className="w-full px-4 py-8 bg-white border-2 border-dashed border-gray-200 rounded-xl hover:border-[#35553D] hover:bg-gray-50 transition-all text-center">
              <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-sm text-gray-500">Click to upload new image</span>
            </div>
          </label>
          {additionalImagePreview && (
            <div className="mt-4 relative w-full aspect-square rounded-xl overflow-hidden bg-gray-100">
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
          <label htmlFor="description" className="block text-sm font-medium text-black mb-2">
            Thoughts <span className="text-gray-400 text-xs font-normal">(optional)</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={entry.description || ''}
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
            defaultValue={entry.rating?.toString() || ''}
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
            defaultChecked={entry.is_public}
            className="w-5 h-5 text-[#35553D] bg-white border-gray-300 rounded focus:ring-2 focus:ring-[#35553D] transition-all"
          />
          <label htmlFor="is_public" className="text-sm font-medium text-black cursor-pointer">
            Make public <span className="text-gray-500 font-normal">(will appear in feed)</span>
          </label>
        </div>

        {/* Botones */}
        <div className="flex gap-4">
          <Link
            href="/my-entries"
            className="flex-1 text-center px-6 py-4 rounded-xl font-medium border-2 border-gray-200 text-black hover:bg-gray-50 transition-all"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="flex-1 bg-[#35553D] text-white px-6 py-4 rounded-xl font-medium hover:bg-[#2a4430] transition-all shadow-sm hover:shadow-md"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}