'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function toggleLike(entryId: string) {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Verificar si ya dio like
  const { data: existingLike } = await supabase
    .from('likes')
    .select('id')
    .eq('entry_id', entryId)
    .eq('user_id', user.id)
    .single()

  if (existingLike) {
    // Si ya dio like, quitarlo
    await supabase
      .from('likes')
      .delete()
      .eq('id', existingLike.id)
  } else {
    // Si no dio like, agregarlo
    await supabase
      .from('likes')
      .insert({
        entry_id: entryId,
        user_id: user.id,
      })
  }

  revalidatePath('/feed')
}

export async function addComment(entryId: string, content: string) {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { error } = await supabase
    .from('comments')
    .insert({
      entry_id: entryId,
      user_id: user.id,
      content,
    })

  if (error) {
    console.error('Error adding comment:', error)
    return { error: error.message }
  }

  revalidatePath('/feed')
}

export async function deleteComment(commentId: string) {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)
    .eq('user_id', user.id)

  revalidatePath('/feed')
}