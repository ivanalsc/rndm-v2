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
        className="w-full px-4 py-3 bg-gray-300 neobrutal-border neobrutal-shadow-sm text-gray-500 font-bold uppercase"
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
        className="w-full px-4 py-4 bg-white neobrutal-border neobrutal-shadow-sm text-black font-bold focus:outline-none focus:bg-[#00F5FF] focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all uppercase placeholder:text-black placeholder:opacity-70"
        placeholder="Start typing..."
        autoComplete="off"
      />

      {isLoading && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <div className="animate-spin h-5 w-5 border-3 border-black border-t-transparent"></div>
        </div>
      )}

      {showResults && results.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white neobrutal-border neobrutal-shadow max-h-96 overflow-y-auto">
          {results.map((result, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(result)}
              className="w-full text-left px-4 py-3 flex gap-3 items-start border-b-4 border-black last:border-b-0 transition-all hover:bg-[#00F5FF] hover:translate-x-1 bg-white"
            >
              {result.cover_image_url ? (
                <div className="relative w-12 h-16 flex-shrink-0 bg-white neobrutal-border neobrutal-shadow-sm overflow-hidden">
                  <Image
                    src={result.cover_image_url}
                    alt={result.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="w-12 h-16 flex-shrink-0 bg-white neobrutal-border neobrutal-shadow-sm flex items-center justify-center text-xl">
                  {type === 'book' && '📚'}
                  {type === 'music' && '🎵'}
                  {type === 'movie' && '🎬'}
                  {type === 'series' && '📺'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-black truncate text-sm uppercase">
                  {result.title}
                </p>
                {result.author_artist && (
                  <p className="text-xs text-black font-bold truncate">
                    {result.author_artist}
                  </p>
                )}
                {result.year && (
                  <p className="text-xs text-black font-bold">{result.year}</p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {showResults && results.length === 0 && !isLoading && query.length >= 2 && (
        <div className="absolute z-10 w-full mt-2 bg-white neobrutal-border neobrutal-shadow-sm p-4 text-sm text-black font-bold uppercase">
          No results found. You can type manually.
        </div>
      )}
    </div>
  )
}