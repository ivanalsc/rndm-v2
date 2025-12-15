'use client'

import { useState, useEffect, useRef } from 'react'
import { searchContent, SearchResult } from '@/lib/api-search'
import Image from 'next/image'

interface AutocompleteInputProps {
  type: string
  onSelect: (result: SearchResult) => void
  initialValue?: string
}

export default function AutocompleteInput({ 
  type, 
  onSelect,
  initialValue = '' 
}: AutocompleteInputProps) {
  const [query, setQuery] = useState(initialValue)
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Buscar cuando el usuario escribe
  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (query.length >= 2 && type) {
        setIsLoading(true)
        const searchResults = await searchContent(type, query)
        setResults(searchResults)
        setIsLoading(false)
        setShowResults(true)
      } else {
        setResults([])
        setShowResults(false)
      }
    }, 300) // Debounce de 300ms

    return () => clearTimeout(delaySearch)
  }, [query, type])

  const handleSelect = (result: SearchResult) => {
    setQuery(result.title)
    setShowResults(false)
    onSelect(result)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  if (!type) {
    return (
      <input
        type="text"
        name="title"
        disabled
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500"
        placeholder="Primero selecciona un tipo de contenido"
      />
    )
  }

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        name="title"
        required
        value={query}
        onChange={handleChange}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        placeholder="Empieza a escribir para buscar..."
        autoComplete="off"
      />

      {isLoading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="animate-spin h-5 w-5 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
        </div>
      )}

      {showResults && results.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-96 overflow-y-auto">
          {results.map((result, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(result)}
              className="w-full text-left px-3 py-3 hover:bg-gray-50 flex gap-3 items-start border-b last:border-b-0"
            >
              {result.cover_image_url ? (
                <div className="relative w-12 h-16 flex-shrink-0 bg-gray-200 rounded overflow-hidden">
                  <Image
                    src={result.cover_image_url}
                    alt={result.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="w-12 h-16 flex-shrink-0 bg-gray-200 rounded flex items-center justify-center text-2xl">
                  {type === 'book' && '📚'}
                  {type === 'music' && '🎵'}
                  {type === 'movie' && '🎬'}
                  {type === 'series' && '📺'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {result.title}
                </p>
                {result.author_artist && (
                  <p className="text-sm text-gray-600 truncate">
                    {result.author_artist}
                  </p>
                )}
                {result.year && (
                  <p className="text-xs text-gray-500">{result.year}</p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {showResults && results.length === 0 && !isLoading && query.length >= 2 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-3 text-sm text-gray-500">
          No se encontraron resultados. Puedes escribir manualmente.
        </div>
      )}
    </div>
  )
}