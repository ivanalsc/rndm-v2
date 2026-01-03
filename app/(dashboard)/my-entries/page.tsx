import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import ShareImageGenerator from '@/components/ShareImageGenerator'
import DeleteEntryButton from '@/components/DeleteEntryButton'
import CollectionFilters from '@/components/CollectionFilters'

export default async function MyEntriesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; type?: string; visibility?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Construir query base
  let query = supabase
    .from('entries')
    .select('*')
    .eq('user_id', user?.id)

  // Aplicar filtro de búsqueda
  if (params.search) {
    query = query.ilike('title', `%${params.search}%`)
  }

  // Aplicar filtro de tipo
  if (params.type) {
    query = query.eq('type', params.type)
  }

  // Aplicar filtro de visibilidad
  if (params.visibility === 'public') {
    query = query.eq('is_public', true)
  } else if (params.visibility === 'private') {
    query = query.eq('is_public', false)
  }

  // Ordenar
  query = query.order('created_at', { ascending: false })

  const { data: entries } = await query

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold font-grotesk text-black mb-8 tracking-tight">
        My Collection
      </h1>
      
      <CollectionFilters />
      
      {!entries || entries.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-gray-400 text-sm mb-2">
            {params.search || params.type || params.visibility ? 'No entries found with these filters' : 'Your collection is empty'}
          </p>
          {!(params.search || params.type || params.visibility) && (
            <p className="text-gray-300 text-xs">Start by adding your first entry</p>
          )}
        </div>
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {entries.map((entry) => (
            <article
              key={entry.id}
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 break-inside-avoid"
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
              <div className="p-4">
                {/* Header con cover thumbnail */}
                <div className="flex items-start gap-3 mb-3">
                  {entry.cover_image_url && (
                    <div className="relative w-10 h-14 flex-shrink-0 bg-gray-100 overflow-hidden rounded">
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
                    <h2 className="font-grotesk font-bold text-black text-base leading-tight mb-1 line-clamp-2">
                      {entry.title}
                    </h2>
                    {entry.author_artist && (
                      <p className="text-xs text-gray-500 truncate">
                        {entry.author_artist}
                      </p>
                    )}
                  </div>
                </div>

                {/* Rating y estado */}
                <div className="flex items-center justify-between mb-3">
                  {entry.rating && (
                    <div className="flex gap-1">
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
                  {!entry.is_public && (
                    <span className="text-xs text-gray-400 px-2 py-0.5 bg-gray-50 rounded">
                      Private
                    </span>
                  )}
                </div>

                {/* Descripción */}
                {entry.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-3">
                    {entry.description}
                  </p>
                )}

                {/* Acciones */}
                <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                  <Link
                    href={`/edit/${entry.id}`}
                    className="flex-1 text-xs text-gray-400 hover:text-[#35553D] transition-colors font-medium text-center"
                  >
                    Edit
                  </Link>
                  <div className="w-px h-4 bg-gray-200"></div>
                  <ShareImageGenerator entry={entry} />
                  <div className="w-px h-4 bg-gray-200"></div>
                  <DeleteEntryButton entryId={entry.id} />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}