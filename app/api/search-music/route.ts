import { NextRequest, NextResponse } from 'next/server'

interface DeezerAlbum {
  title: string
  artist?: { name?: string }
  cover_big?: string
  cover_medium?: string
  release_date?: string
}

interface MusicBrainzRelease {
  title: string
  ['artist-credit']?: { name?: string }[]
  date?: string
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')

  if (!query || query.length < 2) {
    return NextResponse.json({ data: [] })
  }

  try {
    // Intentar con Deezer primero
    const deezerResponse = await fetch(
      `https://api.deezer.com/search/album?q=${encodeURIComponent(query)}&limit=5`
    )
    const deezerData: { data?: DeezerAlbum[] } = await deezerResponse.json()

    if (deezerData.data && deezerData.data.length > 0) {
      const results = deezerData.data.slice(0, 5).map((album: DeezerAlbum) => ({
        title: album.title,
        author_artist: album.artist?.name || undefined,
        cover_image_url: album.cover_big || album.cover_medium || undefined,
        year: album.release_date?.split('-')[0],
      }))
      
      return NextResponse.json({ data: results })
    }

    // Fallback a MusicBrainz si Deezer no devuelve resultados
    const mbResponse = await fetch(
      `https://musicbrainz.org/ws/2/release?query=${encodeURIComponent(query)}&fmt=json&limit=5`,
      {
        headers: {
          'User-Agent': 'RNDM/1.0.0 (contact@rndm.app)',
        },
      }
    )
    const mbData: { releases?: MusicBrainzRelease[] } = await mbResponse.json()

    const results = mbData.releases?.slice(0, 5).map((release: MusicBrainzRelease) => ({
      title: release.title,
      author_artist: release['artist-credit']?.[0]?.name || undefined,
      cover_image_url: undefined,
      year: release.date?.split('-')[0],
    })) || []

    return NextResponse.json({ data: results })
  } catch (error) {
    console.error('Error searching music:', error)
    return NextResponse.json({ data: [] })
  }
}