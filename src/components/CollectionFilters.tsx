'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function CollectionFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [type, setType] = useState(searchParams.get('type') || 'all')
  const [visibility, setVisibility] = useState(searchParams.get('visibility') || 'all')

  const handleSearch = (value: string) => {
    setSearch(value)
    updateFilters(value, type, visibility)
  }

  const handleTypeChange = (value: string) => {
    setType(value)
    updateFilters(search, value, visibility)
  }

  const handleVisibilityChange = (value: string) => {
    setVisibility(value)
    updateFilters(search, type, value)
  }

  const updateFilters = (searchValue: string, typeValue: string, visibilityValue: string) => {
    const params = new URLSearchParams()
    
    if (searchValue) {
      params.set('search', searchValue)
    }
    
    if (typeValue && typeValue !== 'all') {
      params.set('type', typeValue)
    }

    if (visibilityValue && visibilityValue !== 'all') {
      params.set('visibility', visibilityValue)
    }

    const query = params.toString()
    router.push(`/my-entries${query ? `?${query}` : ''}`, { scroll: false })
  }

  const clearFilters = () => {
    setSearch('')
    setType('all')
    setVisibility('all')
    router.push('/my-entries', { scroll: false })
  }

  const hasFilters = search || (type && type !== 'all') || (visibility && visibility !== 'all')

  return (
    <div className="space-y-4 mb-8">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Búsqueda */}
        <div className="flex-1">
          <div className="relative">
            <svg 
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black z-10"
              fill="none" 
              stroke="currentColor" 
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="SEARCH IN YOUR COLLECTION..."
              className="w-full pl-12 pr-12 py-4 bg-white neobrutal-border neobrutal-shadow-sm text-black font-bold text-base focus:outline-none focus:bg-[#00F5FF] focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all uppercase placeholder:text-black placeholder:opacity-70"
            />
            {search && (
              <button
                onClick={() => handleSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-black hover:bg-[#FF1744] hover:text-white w-8 h-8 neobrutal-border neobrutal-shadow-sm flex items-center justify-center transition-all"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M12 4L4 12M4 4l8 8" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Filtro por tipo */}
        <div className="sm:w-56">
          <select
            value={type}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="w-full px-4 py-4 bg-white neobrutal-border neobrutal-shadow-sm text-black font-bold text-base focus:outline-none focus:bg-[#00F5FF] focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all appearance-none cursor-pointer uppercase"
          >
            <option value="all">ALL TYPES</option>
            <option value="book">📚 BOOKS</option>
            <option value="music">🎵 MUSIC</option>
            <option value="movie">🎬 MOVIES</option>
            <option value="series">📺 SERIES</option>
          </select>
        </div>

        {/* Filtro por visibilidad */}
        <div className="sm:w-56">
          <select
            value={visibility}
            onChange={(e) => handleVisibilityChange(e.target.value)}
            className="w-full px-4 py-4 bg-white neobrutal-border neobrutal-shadow-sm text-black font-bold text-base focus:outline-none focus:bg-[#00F5FF] focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all appearance-none cursor-pointer uppercase"
          >
            <option value="all">ALL ENTRIES</option>
            <option value="public">PUBLIC ONLY</option>
            <option value="private">PRIVATE ONLY</option>
          </select>
        </div>
      </div>

      {/* Clear filters */}
      {hasFilters && (
        <div className="flex items-center gap-3">
          <button
            onClick={clearFilters}
            className="text-sm font-bold text-black bg-white px-4 py-2 neobrutal-border neobrutal-shadow-sm hover:bg-[#00F5FF] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all uppercase flex items-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M9 3L3 9M3 3l6 6" />
            </svg>
            CLEAR FILTERS
          </button>
        </div>
      )}
    </div>
  )
}