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

  // Manejar la carga de imagen
  let coverImageUrl = null
  const coverImage = formData.get('cover_image') as File
  
  if (coverImage && coverImage.size > 0) {
    const fileExt = coverImage.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
  
    const { error: uploadError } = await supabase.storage
      .from('covers')
      .upload(fileName, coverImage, {
        cacheControl: '3600',
        upsert: false
      })
  
    if (uploadError) {
      console.error('Error uploading image:', uploadError)
      throw new Error(`Error al subir la imagen: ${uploadError.message}`)
    }
  
    const { data: { publicUrl } } = supabase.storage
      .from('covers')
      .getPublicUrl(fileName)
    
    coverImageUrl = publicUrl
  }

  const rating = formData.get('rating')
  
  const data = {
    user_id: user.id,
    type: formData.get('type') as string,
    title: formData.get('title') as string,
    author_artist: formData.get('author_artist') as string || null,
    cover_image_url: coverImageUrl,
    description: formData.get('description') as string || null,
    rating: rating ? parseInt(rating as string) : null,
    is_public: formData.get('is_public') === 'on',
  }

  const { error } = await supabase.from('entries').insert(data)

  if (error) {
    console.error('Error creating entry:', error)
    throw new Error(error.message)
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

  const { data: entry } = await supabase
    .from('entries')
    .select('cover_image_url')
    .eq('id', entryId)
    .eq('user_id', user.id)
    .single()

  if (entry?.cover_image_url) {
    const fileName = entry.cover_image_url.split('/').pop()
    if (fileName) {
      await supabase.storage
        .from('covers')
        .remove([fileName])
    }
  }

  const { error } = await supabase
    .from('entries')
    .delete()
    .eq('id', entryId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting entry:', error)
    throw new Error(error.message)
  }

  revalidatePath('/feed')
  revalidatePath('/my-entries')
}