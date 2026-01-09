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
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        type="text"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="ADD A COMMENT..."
        className="flex-1 px-4 py-3 bg-white neobrutal-border neobrutal-shadow-sm text-black font-bold text-sm focus:outline-none focus:bg-[#00F5FF] focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all uppercase placeholder:text-black placeholder:opacity-70 disabled:opacity-50"
        disabled={isPending}
        autoFocus
      />
      <button
        type="submit"
        disabled={isPending || !newComment.trim()}
        className="px-6 py-3 bg-[#00F5FF] text-black font-bold text-sm neobrutal-border neobrutal-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-sm transition-all uppercase flex-shrink-0"
      >
        {isPending ? '...' : 'POST'}
      </button>
    </form>
  )
}