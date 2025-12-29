'use client'

import { addComment } from '../../app/actions/interactions'
import { useState, useTransition } from 'react'

interface Comment {
  id: string
  content: string
  created_at: string
  user_id: string
  profiles: {
    full_name: string | null
  } | null
}

interface CommentsSectionProps {
  entryId: string
  comments: Comment[]
  currentUserId: string
  isOpen: boolean
  onToggle: () => void
}

export default function CommentsSection({ entryId, comments, isOpen, onToggle }: CommentsSectionProps) {
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
    <button
      onClick={onToggle}
      className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#35553D] transition-colors group"
    >
      <svg 
        width="16" 
        height="16" 
        viewBox="0 0 16 16" 
        fill="none" 
        className={`stroke-current transition-all ${isOpen ? 'scale-110 text-[#35553D]' : ''}`}
        strokeWidth="1.5"
      >
        <path d="M14 10.5V3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v7.5a1 1 0 0 0 1 1h2v2.5l3-2.5h5a1 1 0 0 0 1-1z" />
      </svg>
      <span className={`font-medium transition-colors ${isOpen ? 'text-[#35553D]' : ''}`}>
        {comments.length}
      </span>
    </button>
  )
}