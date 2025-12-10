// src/app/(dashboard)/my-entries/page.tsx
import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import { deleteEntry } from '../../actions/entries'

export default async function MyEntriesPage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: entries } = await supabase
    .from('entries')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })

  return (
    <div className="px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mis entradas</h1>
      
      {!entries || entries.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No tenés entradas todavía.</p>
          <p className="text-sm text-gray-400 mt-2">
            ¡Empezá agregando tu primera entrada!
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
                  <div className="flex items-center gap-2">
                    {entry.rating && (
                      <span className="text-sm text-yellow-500">
                        {'⭐'.repeat(entry.rating)}
                      </span>
                    )}
                    {!entry.is_public && (
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                        Privado
                      </span>
                    )}
                  </div>
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
                <div className="flex gap-2 pt-3 border-t">
                  <form action={deleteEntry.bind(null, entry.id)} className="flex-1">
                    <button
                      type="submit"
                      className="w-full text-sm text-red-600 hover:text-red-800 py-2"
                    >
                      Eliminar
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}