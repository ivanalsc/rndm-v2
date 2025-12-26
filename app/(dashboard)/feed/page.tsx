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
    <div>
      <h1 className="text-4xl font-bold font-grotesk text-black mb-12 tracking-tight">
        Feed
      </h1>
      
      {!entriesWithInteractions || entriesWithInteractions.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-gray-400 text-sm">No public entries yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {entriesWithInteractions.map((entry) => (
            <article
              key={entry.id}
              className="group cursor-pointer"
            >
              {/* Imagen principal solo si existe */}
              {entry.additional_image_url && (
                <div className="relative aspect-square bg-gray-100 mb-4 overflow-hidden">
                  <Image
                    src={entry.additional_image_url}
                    alt={entry.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                  />
                </div>
              )}
              
              {/* Contenido */}
              <div className="space-y-3">
                {/* Header con cover thumbnail y rating */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3 flex-1 min-w-0">
                    {entry.cover_image_url && (
                      <div className="relative w-10 h-14 flex-shrink-0 bg-gray-100 overflow-hidden">
                        <Image
                          src={entry.cover_image_url}
                          alt=""
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h2 className="font-grotesk font-semibold text-black text-base leading-tight mb-1 line-clamp-2">
                        {entry.title}
                      </h2>
                      {entry.author_artist && (
                        <p className="text-sm text-gray-500 truncate">
                          {entry.author_artist}
                        </p>
                      )}
                    </div>
                  </div>
                  {entry.rating && (
                    <div className="flex gap-0.5 flex-shrink-0">
                      {Array.from({ length: entry.rating }).map((_, i) => (
                        <span key={i} className="text-black text-xs">★</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Descripción */}
                {entry.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                    {entry.description}
                  </p>
                )}

                {/* Meta info */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-400">
                    {entry.profiles?.full_name || 'Anonymous'}
                  </span>
                  <div className="flex items-center gap-4">
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
            </article>
          ))}
        </div>
      )}
    </div>
  )
}