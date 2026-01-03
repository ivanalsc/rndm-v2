import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export default async function ProfilePage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  const supabase = await createClient()
  
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser()

  if (!currentUser) {
    redirect('/login')
  }

  // Si es tu propio perfil, redirige a My Collection
  if (id === currentUser.id) {
    redirect('/my-entries')
  }

  // Obtener perfil del usuario
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (!profile) {
    redirect('/feed')
  }

  // Obtener entradas públicas del usuario
  const { data: entries } = await supabase
    .from('entries')
    .select('*')
    .eq('user_id', id)
    .eq('is_public', true)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header del perfil */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 rounded-full bg-[#35553D]/10 flex items-center justify-center">
            <span className="text-3xl font-bold text-[#35553D] font-grotesk">
              {(profile.full_name || 'U').charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-4xl font-bold font-grotesk text-black tracking-tight">
              {profile.full_name || 'User'}
            </h1>
            {profile.username && (
              <p className="text-gray-500">@{profile.username}</p>
            )}
          </div>
        </div>
        {profile.bio && (
          <p className="text-gray-600 leading-relaxed max-w-2xl">
            {profile.bio}
          </p>
        )}
      </div>

      {/* Estadísticas */}
      <div className="flex gap-8 mb-12 pb-6 border-b border-gray-200">
        <div>
          <p className="text-2xl font-bold font-grotesk text-black">
            {entries?.length || 0}
          </p>
          <p className="text-sm text-gray-500">Public entries</p>
        </div>
      </div>

      {/* Entradas públicas */}
      {!entries || entries.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-gray-400 text-sm">No public entries yet</p>
        </div>
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {entries.map((entry) => (
            <article
              key={entry.id}
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 break-inside-avoid"
            >
              {/* Imagen principal */}
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

                {entry.rating && (
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full ${
                          i < entry.rating! ? 'bg-[#35553D]' : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                )}

                {entry.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                    {entry.description}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}