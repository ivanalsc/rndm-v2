import { createClient } from '@/lib/supabase/server'
import FeedEntry from '@/components/FeedEntry'
import SearchFilters from '@/components/SearchFilters'

export default async function FeedPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; type?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Construir query base
  let query = supabase
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

  // Aplicar filtro de búsqueda
  if (params.search) {
    query = query.ilike('title', `%${params.search}%`)
  }

  // Aplicar filtro de tipo
  if (params.type) {
    query = query.eq('type', params.type)
  }

  // Ordenar
  query = query.order('created_at', { ascending: false })

  const { data: entries } = await query

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

  const hasFilters = params.search || params.type

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold font-grotesk text-black mb-8 tracking-tight">
        Feed
      </h1>
      
      <SearchFilters />
      
      {!entriesWithInteractions || entriesWithInteractions.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-gray-400 text-sm">
            {hasFilters ? 'No entries found with these filters' : 'No public entries yet'}
          </p>
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