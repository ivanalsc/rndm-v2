// src/app/(dashboard)/add/page.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import AutocompleteInput from '@/components/AutocompleteInput'
import { SearchResult } from '@/lib/api-search'
import { createEntry } from '../../actions/entries'

export default function AddEntryPage() {
  const [additionalImagePreview, setAdditionalImagePreview] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string>('')
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [coverUrl, setCoverUrl] = useState('')
  const [author, setAuthor] = useState('')

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
    <div className="px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Agregar nueva entrada
        </h1>

        <form action={createEntry} className="space-y-6">
          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700"
            >
              Tipo de contenido *
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Selecciona un tipo</option>
              <option value="book">📚 Libro</option>
              <option value="music">🎵 Música</option>
              <option value="movie">🎬 Película</option>
              <option value="series">📺 Serie</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Título * {selectedType && <span className="text-xs text-gray-500">(empieza a escribir para buscar)</span>}
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Portada {author && <span className="text-gray-600">· {author}</span>}
              </label>
              <div className="relative h-64 w-48 mx-auto border rounded-lg overflow-hidden">
                <Image
                  src={coverPreview}
                  alt="Portada"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagen adicional (opcional)
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Puedes agregar una foto tuya con el libro/álbum, una captura de pantalla, etc.
            </p>
            <input
              type="file"
              id="additional_image"
              name="additional_image"
              accept="image/*"
              onChange={handleAdditionalImageChange}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100"
            />
            {additionalImagePreview && (
              <div className="mt-4 relative h-64 w-full">
                <Image
                  src={additionalImagePreview}
                  alt="Vista previa"
                  fill
                  className="object-contain rounded-md"
                />
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Descripción o comentario
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="¿Qué te pareció?"
            />
          </div>

          <div>
            <label
              htmlFor="rating"
              className="block text-sm font-medium text-gray-700"
            >
              Calificación
            </label>
            <select
              id="rating"
              name="rating"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Sin calificación</option>
              <option value="1">⭐ 1 estrella</option>
              <option value="2">⭐⭐ 2 estrellas</option>
              <option value="3">⭐⭐⭐ 3 estrellas</option>
              <option value="4">⭐⭐⭐⭐ 4 estrellas</option>
              <option value="5">⭐⭐⭐⭐⭐ 5 estrellas</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              id="is_public"
              name="is_public"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label
              htmlFor="is_public"
              className="ml-2 block text-sm text-gray-900"
            >
              Hacer pública (aparecerá en el feed)
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Guardar entrada
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}