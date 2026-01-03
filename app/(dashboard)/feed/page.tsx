// src/app/(dashboard)/feed/page.tsx
import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import LikeButton from '@/components/LikeButton'
import FeedEntry from '@/components/FeedEntry'

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
      profiles!entries_user_id_fkey (
        id,
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
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold font-grotesk text-black mb-12 tracking-tight">
        Feed
      </h1>
      
      {!entriesWithInteractions || entriesWithInteractions.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-gray-400 text-sm">No public entries yet</p>
        </div>
      ) : (
        <div className="space-y-8">
          {entriesWithInteractions.map((entry) => (
            <FeedEntry 
              key={entry.id}
              entry={entry}
              currentUserId={user?.id || ''}
            />
          ))}
        </div>
      )}
    </div>
  )
}