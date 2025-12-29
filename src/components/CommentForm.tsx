'use client'

import { addComment } from '../../app/actions/interactions'
import { useState, useTransition } from 'react'

interface CommentFormProps {
  entryId: string
}

export default function CommentForm({ entryId }: CommentFormProps) {
  const [newComment, setNewComment] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    startTransition(async () => {
      await addComment(entryId, newComment.trim())
      setNewComment('')
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Add a comment..."
        className="flex-1 px-4 py-2.5 bg-gray-50 border-0 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#35553D] transition-all"
        disabled={isPending}
        autoFocus
      />
      <button
        type="submit"
        disabled={isPending || !newComment.trim()}
        className="px-5 py-2.5 bg-[#35553D] text-white text-sm rounded-xl hover:bg-[#2a4430] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all font-medium flex-shrink-0"
      >
        {isPending ? '...' : 'Post'}
      </button>
    </form>
  )
}