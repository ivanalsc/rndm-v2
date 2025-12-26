import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import ShareImageGenerator from '@/components/ShareImageGenerator'
import DeleteEntryButton from '@/components/DeleteEntryButton'

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
    <div>
      <h1 className="text-4xl font-bold font-grotesk text-black mb-12 tracking-tight">
        My Collection
      </h1>
      
      {!entries || entries.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-gray-400 text-sm mb-2">Your collection is empty</p>
          <p className="text-gray-300 text-xs">Start by adding your first entry</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {entries.map((entry) => (
            <article
              key={entry.id}
              className="group"
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
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {entry.rating && (
                      <div className="flex gap-0.5">
                        {Array.from({ length: entry.rating }).map((_, i) => (
                          <span key={i} className="text-black text-xs">★</span>
                        ))}
                      </div>
                    )}
                    {!entry.is_public && (
                      <span className="text-xs text-gray-400 px-2 py-0.5 bg-gray-50 rounded">
                        Private
                      </span>
                    )}
                  </div>
                </div>

                {/* Descripción */}
                {entry.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                    {entry.description}
                  </p>
                )}

                {/* Acciones */}
                <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
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