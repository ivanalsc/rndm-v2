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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
    }, 300) 

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
        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-400"
        placeholder="First select a content type"
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
        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-[#35553D] focus:border-transparent transition-all"
        placeholder="Start typing..."
        autoComplete="off"
      />

      {isLoading && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <div className="animate-spin h-4 w-4 border-2 border-[#35553D] border-t-transparent rounded-full"></div>
        </div>
      )}

      {showResults && results.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-96 overflow-y-auto">
          {results.map((result, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(result)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 flex gap-3 items-start border-b last:border-b-0 transition-colors"
            >
              {result.cover_image_url ? (
                <div className="relative w-10 h-14 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                  <Image
                    src={result.cover_image_url}
                    alt={result.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="w-10 h-14 flex-shrink-0 bg-gray-100 rounded flex items-center justify-center text-xl">
                  {type === 'book' && '📚'}
                  {type === 'music' && '🎵'}
                  {type === 'movie' && '🎬'}
                  {type === 'series' && '📺'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-black truncate text-sm">
                  {result.title}
                </p>
                {result.author_artist && (
                  <p className="text-xs text-gray-500 truncate">
                    {result.author_artist}
                  </p>
                )}
                {result.year && (
                  <p className="text-xs text-gray-400">{result.year}</p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {showResults && results.length === 0 && !isLoading && query.length >= 2 && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-4 text-sm text-gray-500">
          No results found. You can type manually.
        </div>
      )}
    </div>
  )
}