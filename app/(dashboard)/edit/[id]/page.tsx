import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import EditEntryForm from '@/components/EditEntryForm'

export default async function EditEntryPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: entry } = await supabase
    .from('entries')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!entry) {
    redirect('/my-entries')
  }

  return <EditEntryForm entry={entry} />
}