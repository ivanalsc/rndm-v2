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
    <div className="max-w-7xl mx-auto px-4">
      <h1 className="text-5xl font-bold font-grotesk text-black mb-8 tracking-tight neobrutal-border bg-white px-6 py-4 inline-block neobrutal-shadow uppercase">
        My Collection
      </h1>
      
      <CollectionFilters />
      
      {!entries || entries.length === 0 ? (
        <div className="text-center neobrutal-border bg-white px-8 py-12 neobrutal-shadow">
          <p className="text-black font-bold text-lg mb-2 uppercase">
            {params.search || params.type || params.visibility ? 'No entries found with these filters' : 'Your collection is empty'}
          </p>
          {!(params.search || params.type || params.visibility) && (
            <p className="text-black font-bold text-sm uppercase">Start by adding your first entry</p>
          )}
        </div>
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {entries.map((entry) => (
            <article
              key={entry.id}
              className="group neobrutal-border neobrutal-shadow overflow-hidden break-inside-avoid transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none bg-white"
            >
              {/* Imagen principal solo si existe - estilo Instagram */}
              {entry.additional_image_url && (
                <div className="relative w-full aspect-square neobrutal-border-thick border-b-0">
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
                    <div className="relative w-12 h-16 flex-shrink-0 bg-white overflow-hidden neobrutal-border neobrutal-shadow-sm">
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
                    <h2 className="font-grotesk font-bold text-black text-base leading-tight mb-1 line-clamp-2 uppercase">
                      {entry.title}
                    </h2>
                    {entry.author_artist && (
                      <p className="text-xs text-black font-bold bg-white px-2 py-1 inline-block neobrutal-border neobrutal-shadow-sm truncate">
                        {entry.author_artist}
                      </p>
                    )}
                  </div>
                </div>

                {/* Rating y estado */}
                <div className="flex items-center justify-between mb-3">
                  {entry.rating && (
                    <div className="flex gap-1.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-4 h-4 neobrutal-border transition-all ${
                            i < entry.rating! ? 'bg-[#39FF14]' : 'bg-white'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                  {!entry.is_public && (
                    <span className="text-xs font-bold text-black bg-white px-3 py-1 neobrutal-border neobrutal-shadow-sm uppercase">
                      Private
                    </span>
                  )}
                </div>

                {/* Descripción */}
                {entry.description && (
                  <p className="text-sm text-black font-medium line-clamp-2 leading-relaxed mb-3">
                    {entry.description}
                  </p>
                )}

                {/* Acciones */}
                <div className="flex items-center gap-2 pt-3 border-t-4 border-black">
                  <Link
                    href={`/edit/${entry.id}`}
                    className="flex-1 text-xs font-bold text-black bg-white px-3 py-2 neobrutal-border neobrutal-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all text-center uppercase"
                  >
                    Edit
                  </Link>
                  <ShareImageGenerator entry={entry} />
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