'use client'

import { deleteEntry } from '../../app/actions/entries'
import { useTransition } from 'react'

interface DeleteEntryButtonProps {
  entryId: string
}

export default function DeleteEntryButton({ entryId }: DeleteEntryButtonProps) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (confirm('Delete this entry?')) {
      startTransition(async () => {
        await deleteEntry(entryId)
      })
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="flex-1 text-xs text-gray-400 hover:text-black transition-colors disabled:opacity-50 font-medium"
    >
      {isPending ? 'Deleting...' : 'Delete'}
    </button>
  )
}