// src/app/actions/entries.ts
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function createEntry(formData: FormData) {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Manejar la carga de cover (URL de la API)
  const coverImageUrl = formData.get('cover_image_url') as string || null
  
  // Manejar imagen adicional (archivo subido)
  let additionalImageUrl = null
  const additionalImage = formData.get('additional_image') as File

  if (additionalImage && additionalImage.size > 0) {
    const fileExt = additionalImage.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('covers')
      .upload(fileName, additionalImage, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Error uploading additional image:', uploadError)
      return { error: `Error al subir la imagen adicional: ${uploadError.message}` }
    }

    const { data: { publicUrl } } = supabase.storage
      .from('covers')
      .getPublicUrl(fileName)
    
    additionalImageUrl = publicUrl
  }

  const rating = formData.get('rating')

  const data = {
    user_id: user.id,
    type: formData.get('type') as string,
    title: formData.get('title') as string,
    author_artist: formData.get('author_artist') as string || null,
    cover_image_url: coverImageUrl,
    additional_image_url: additionalImageUrl,
    description: formData.get('description') as string || null,
    rating: rating ? parseInt(rating as string) : null,
    is_public: formData.get('is_public') === 'on',
  }

  const { error } = await supabase.from('entries').insert(data)

  if (error) {
    console.error('Error creating entry:', error)
    return { error: error.message }
  }

  revalidatePath('/feed')
  revalidatePath('/my-entries')
  redirect('/my-entries')
}

export async function deleteEntry(entryId: string) {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Primero obtener la entrada para eliminar las imágenes si existen
  const { data: entry } = await supabase
    .from('entries')
    .select('cover_image_url, additional_image_url')
    .eq('id', entryId)
    .eq('user_id', user.id)
    .single()

  // Eliminar imágenes de storage si son de Supabase
  if (entry) {
    const imagesToDelete: string[] = []
    
    if (entry.cover_image_url && entry.cover_image_url.includes('supabase')) {
      const fileName = entry.cover_image_url.split('/').pop()
      if (fileName) imagesToDelete.push(fileName)
    }
    
    if (entry.additional_image_url) {
      const fileName = entry.additional_image_url.split('/').pop()
      if (fileName) imagesToDelete.push(fileName)
    }
    
    if (imagesToDelete.length > 0) {
      await supabase.storage
        .from('covers')
        .remove(imagesToDelete)
    }
  }

  const { error } = await supabase
    .from('entries')
    .delete()
    .eq('id', entryId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting entry:', error)
    return { error: error.message }
  }

  revalidatePath('/feed')
  revalidatePath('/my-entries')
}