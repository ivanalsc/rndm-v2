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
      className="flex-1 text-xs font-bold text-white bg-[#FF1744] px-3 py-2 neobrutal-border neobrutal-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-sm uppercase"
    >
      {isPending ? 'Deleting...' : 'Delete'}
    </button>
  )
}