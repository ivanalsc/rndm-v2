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
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Búsqueda */}
        <div className="flex-1">
          <div className="relative">
            <svg 
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search in your collection..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-[#35553D] focus:border-transparent transition-all"
            />
            {search && (
              <button
                onClick={() => handleSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 4L4 12M4 4l8 8" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Filtro por tipo */}
        <div className="sm:w-48">
          <select
            value={type}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-[#35553D] focus:border-transparent transition-all appearance-none cursor-pointer"
          >
            <option value="all">All types</option>
            <option value="book">📚 Books</option>
            <option value="music">🎵 Music</option>
            <option value="movie">🎬 Movies</option>
            <option value="series">📺 Series</option>
          </select>
        </div>

        {/* Filtro por visibilidad */}
        <div className="sm:w-48">
          <select
            value={visibility}
            onChange={(e) => handleVisibilityChange(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-[#35553D] focus:border-transparent transition-all appearance-none cursor-pointer"
          >
            <option value="all">All entries</option>
            <option value="public">Public only</option>
            <option value="private">Private only</option>
          </select>
        </div>
      </div>

      {/* Clear filters */}
      {hasFilters && (
        <div className="flex items-center gap-2">
          <button
            onClick={clearFilters}
            className="text-xs text-gray-500 hover:text-[#35553D] transition-colors flex items-center gap-1"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 3L3 9M3 3l6 6" />
            </svg>
            Clear filters
          </button>
        </div>
      )}
    </div>
  )
}