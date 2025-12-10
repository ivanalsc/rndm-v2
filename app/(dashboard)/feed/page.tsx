import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'

export default async function FeedPage() {
  const supabase = await createClient()

  const { data: entries } = await supabase
    .from('entries')
    .select(`
      *,
      profiles (
        full_name,
        username
      ),
      likes (count),
      comments (count)
    `)
    .eq('is_public', true)
    .order('created_at', { ascending: false })

  return (
    <div className="px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Feed público</h1>
      
      {!entries || entries.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No hay entradas públicas todavía.</p>
          <p className="text-sm text-gray-400 mt-2">
            Sé el primero en compartir algo!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {entry.cover_image_url && (
                <div className="relative h-64 bg-gray-200">
                  <Image
                    src={entry.cover_image_url}
                    alt={entry.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-indigo-600 uppercase">
                    {entry.type === 'book' && '📚 Libro'}
                    {entry.type === 'music' && '🎵 Música'}
                    {entry.type === 'movie' && '🎬 Película'}
                    {entry.type === 'series' && '📺 Serie'}
                  </span>
                  {entry.rating && (
                    <span className="text-sm text-yellow-500">
                      {'⭐'.repeat(entry.rating)}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {entry.title}
                </h3>
                {entry.author_artist && (
                  <p className="text-sm text-gray-600 mb-2">
                    por {entry.author_artist}
                  </p>
                )}
                {entry.description && (
                  <p className="text-sm text-gray-700 mb-3 line-clamp-3">
                    {entry.description}
                  </p>
                )}
                <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t">
                  <span>Por {entry.profiles?.full_name || 'Usuario'}</span>
                  <div className="flex gap-3">
                    <span>❤️ {entry.likes?.[0]?.count || 0}</span>
                    <span>💬 {entry.comments?.[0]?.count || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}