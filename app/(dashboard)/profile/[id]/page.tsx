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
    <div className="max-w-7xl mx-auto px-4">
      {/* Header del perfil */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-24 h-24 bg-white neobrutal-border neobrutal-shadow-sm flex items-center justify-center">
            <span className="text-4xl font-bold text-black font-grotesk uppercase">
              {(profile.full_name || 'U').charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-5xl font-bold font-grotesk text-black tracking-tight neobrutal-border bg-white px-6 py-4 inline-block neobrutal-shadow uppercase">
              {profile.full_name || 'User'}
            </h1>
            {profile.username && (
              <p className="text-black font-bold bg-white px-3 py-1 neobrutal-border neobrutal-shadow-sm inline-block mt-2 uppercase">@{profile.username}</p>
            )}
          </div>
        </div>
        {profile.bio && (
          <p className="text-black font-bold leading-relaxed max-w-2xl bg-white px-4 py-3 neobrutal-border neobrutal-shadow-sm uppercase">
            {profile.bio}
          </p>
        )}
      </div>

      {/* Estadísticas */}
      <div className="flex gap-8 mb-12 pb-6 border-b-4 border-black">
        <div className="bg-white neobrutal-border neobrutal-shadow-sm px-6 py-4">
          <p className="text-4xl font-bold font-grotesk text-black">
            {entries?.length || 0}
          </p>
          <p className="text-sm text-black font-bold uppercase">Public entries</p>
        </div>
      </div>

      {/* Entradas públicas */}
      {!entries || entries.length === 0 ? (
        <div className="text-center neobrutal-border bg-white px-8 py-12 neobrutal-shadow">
          <p className="text-black font-bold text-lg uppercase">No public entries yet</p>
        </div>
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {entries.map((entry) => (
            <article
              key={entry.id}
              className="group neobrutal-border neobrutal-shadow overflow-hidden break-inside-avoid transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none bg-white"
            >
              {/* Imagen principal */}
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

                {entry.rating && (
                  <div className="flex gap-1.5 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-4 h-4 neobrutal-border ${
                          i < entry.rating! ? 'bg-[#39FF14]' : 'bg-white'
                        }`}
                      />
                    ))}
                  </div>
                )}

                {entry.description && (
                  <p className="text-sm text-black font-medium line-clamp-2 leading-relaxed">
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