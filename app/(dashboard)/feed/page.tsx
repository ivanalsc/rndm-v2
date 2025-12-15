import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import LikeButton from '@/components/LikeButton'
import CommentsSection from '@/components/CommentsSection'

export default async function FeedPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Obtener entradas públicas con información completa
  const { data: entries } = await supabase
    .from('entries')
    .select(`
      *,
      profiles (
        full_name,
        username
      )
    `)
    .eq('is_public', true)
    .order('created_at', { ascending: false })

  // Para cada entrada, obtener likes y comentarios
  const entriesWithInteractions = await Promise.all(
    (entries || []).map(async (entry) => {
      const { data: likes, count: likesCount } = await supabase
        .from('likes')
        .select('user_id', { count: 'exact' })
        .eq('entry_id', entry.id)

      const { data: comments } = await supabase
        .from('comments')
        .select(`
          *,
          profiles (
            full_name
          )
        `)
        .eq('entry_id', entry.id)
        .order('created_at', { ascending: true })

      const userLiked = likes?.some(like => like.user_id === user?.id) || false

      return {
        ...entry,
        likesCount: likesCount || 0,
        userLiked,
        comments: comments || [],
      }
    })
  )

  return (
    <div className="px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Feed público</h1>
      
      {!entriesWithInteractions || entriesWithInteractions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No hay entradas públicas todavía.</p>
          <p className="text-sm text-gray-400 mt-2">
            Sé el primero en compartir algo!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {entriesWithInteractions.map((entry) => (
            <div
              key={entry.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Mostrar imagen adicional si existe, sino mostrar cover */}
              {entry.additional_image_url ? (
                <div className="relative h-64 bg-gray-200">
                  <Image
                    src={entry.additional_image_url}
                    alt={entry.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : entry.cover_image_url ? (
                <div className="relative h-64 bg-gray-200">
                  <Image
                    src={entry.cover_image_url}
                    alt={entry.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="h-64 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                  <span className="text-6xl">
                    {entry.type === 'book' && '📚'}
                    {entry.type === 'music' && '🎵'}
                    {entry.type === 'movie' && '🎬'}
                    {entry.type === 'series' && '📺'}
                  </span>
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
                <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t mb-3">
                  <span>Por {entry.profiles?.full_name || 'Usuario'}</span>
                </div>
                
                {/* Likes y Comentarios */}
                <div className="flex items-center gap-4 pt-3 border-t">
                  <LikeButton
                    entryId={entry.id}
                    initialLiked={entry.userLiked}
                    initialCount={entry.likesCount}
                  />
                  <CommentsSection
                    entryId={entry.id}
                    comments={entry.comments}
                    currentUserId={user?.id || ''}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}