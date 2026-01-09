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
      className={`flex items-center gap-2 px-3 py-2 neobrutal-border neobrutal-shadow-sm transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none ${
        isOpen ? 'bg-[#9D00FF]' : 'bg-[#00D9FF]'
      }`}
    >
      <svg 
        width="18" 
        height="18" 
        viewBox="0 0 16 16" 
        fill="none" 
        className="transition-all"
        stroke={isOpen ? 'white' : 'black'}
        strokeWidth="3"
      >
        <path d="M14 10.5V3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v7.5a1 1 0 0 0 1 1h2v2.5l3-2.5h5a1 1 0 0 0 1-1z" />
      </svg>
      <span className={`font-bold text-sm transition-colors ${
        isOpen ? 'text-white' : 'text-black'
      }`}>
        {comments.length}
      </span>
    </button>
  )
}