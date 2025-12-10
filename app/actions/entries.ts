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

  const rating = formData.get('rating')
  
  const data = {
    user_id: user.id,
    type: formData.get('type') as string,
    title: formData.get('title') as string,
    author_artist: formData.get('author_artist') as string || null,
    cover_image_url: formData.get('cover_image_url') as string || null,
    description: formData.get('description') as string || null,
    rating: rating ? parseInt(rating as string) : null,
    is_public: formData.get('is_public') === 'on',
  }

  const { error } = await supabase.from('entries').insert(data)

  if (error) {
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

  const { error } = await supabase
    .from('entries')
    .delete()
    .eq('id', entryId)
    .eq('user_id', user.id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/feed')
  revalidatePath('/my-entries')
}