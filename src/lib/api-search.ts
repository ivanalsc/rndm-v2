// src/lib/api-search.ts

export interface SearchResult {
  title: string
  author_artist?: string
  cover_image_url?: string
  year?: string
}

interface OpenLibraryDoc {
  title: string
  author_name?: string[]
  cover_i?: number
  first_publish_year?: number
}

// Open Library API - Buscar libros
export async function searchBooks(query: string): Promise<SearchResult[]> {
  if (!query || query.length < 2) return []

  try {
    const response = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=5`
    )
    const data: { docs?: OpenLibraryDoc[] } = await response.json()

    return (
      data.docs
        ?.slice(0, 5)
        .map((book: OpenLibraryDoc) => ({
          title: book.title,
          author_artist: book.author_name?.[0] || undefined,
          cover_image_url: book.cover_i
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
            : undefined,
          year: book.first_publish_year?.toString(),
        })) || []
    )
  } catch (error) {
    console.error('Error searching books:', error)
    return []
  }
}
  
interface TmdbMovie {
  title: string
  poster_path?: string | null
  release_date?: string
}

// TMDB API - Buscar películas
export async function searchMovies(query: string): Promise<SearchResult[]> {
  if (!query || query.length < 2) return []

  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY
  if (!apiKey) {
    console.error('TMDB API key not configured')
    return []
  }

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
        query
      )}&language=es-ES`
    )
    const data: { results?: TmdbMovie[] } = await response.json()

    return (
      data.results
        ?.slice(0, 5)
        .map((movie: TmdbMovie) => ({
          title: movie.title,
          author_artist: undefined,
          cover_image_url: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : undefined,
          year: movie.release_date?.split('-')[0],
        })) || []
    )
  } catch (error) {
    console.error('Error searching movies:', error)
    return []
  }
}
  
interface TmdbSeries {
  name: string
  poster_path?: string | null
  first_air_date?: string
}

// TMDB API - Buscar series
export async function searchSeries(query: string): Promise<SearchResult[]> {
  if (!query || query.length < 2) return []

  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY
  if (!apiKey) {
    console.error('TMDB API key not configured')
    return []
  }

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&query=${encodeURIComponent(
        query
      )}&language=es-ES`
    )
    const data: { results?: TmdbSeries[] } = await response.json()

    return (
      data.results
        ?.slice(0, 5)
        .map((series: TmdbSeries) => ({
          title: series.name,
          author_artist: undefined,
          cover_image_url: series.poster_path
            ? `https://image.tmdb.org/t/p/w500${series.poster_path}`
            : undefined,
          year: series.first_air_date?.split('-')[0],
        })) || []
    )
  } catch (error) {
    console.error('Error searching series:', error)
    return []
  }
}
  
  // API Route interna - Buscar música (álbumes)
  export async function searchMusic(query: string): Promise<SearchResult[]> {
    if (!query || query.length < 2) return []
    
    try {
      const response = await fetch(
        `/api/search-music?q=${encodeURIComponent(query)}`
      )
      const data = await response.json()
      return data.data || []
    } catch (error) {
      console.error('Error searching music:', error)
      return []
    }
  }
  
  // Función principal que decide qué API usar según el tipo
  export async function searchContent(type: string, query: string): Promise<SearchResult[]> {
    switch (type) {
      case 'book':
        return searchBooks(query)
      case 'movie':
        return searchMovies(query)
      case 'series':
        return searchSeries(query)
      case 'music':
        return searchMusic(query)
      default:
        return []
    }
  }