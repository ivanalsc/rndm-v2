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
        <div className="space-y-8 w-3xl m-auto">
          {entriesWithInteractions.map((entry) => (
            <article
              key={entry.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              {/* Imagen principal solo si existe - estilo Instagram */}
              {entry.additional_image_url && (
                <div className="relative w-full aspect-square bg-gray-100">
                  <Image
                    src={entry.additional_image_url}
                    alt={entry.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}
              
              {/* Contenido */}
              <div className="p-6">
                {/* Header con cover thumbnail y rating */}
                <div className="flex items-start gap-4 mb-4">
                  {entry.cover_image_url && (
                    <div className="relative w-12 h-16 flex-shrink-0 bg-gray-100 overflow-hidden rounded">
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
                    <h2 className="font-grotesk font-bold text-black text-xl leading-tight mb-2">
                      {entry.title}
                    </h2>
                    {entry.author_artist && (
                      <p className="text-sm text-gray-500">
                        {entry.author_artist}
                      </p>
                    )}
                  </div>
                  {entry.rating && (
                    <div className="flex gap-1 flex-shrink-0">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full transition-colors ${
                            i < entry.rating! ? 'bg-[#35553D]' : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Descripción */}
                {entry.description && (
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {entry.description}
                  </p>
                )}

                {/* Meta info y acciones */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-400 font-medium">
                    {entry.profiles?.full_name || 'Anonymous'}
                  </span>
                  <div className="flex items-center gap-6">
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