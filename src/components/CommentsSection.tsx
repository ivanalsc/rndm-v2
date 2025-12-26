'use client'

import { addComment, deleteComment } from '../../app/actions/interactions'
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
}

export default function CommentsSection({ entryId, comments, currentUserId }: CommentsSectionProps) {
  const [isOpen, setIsOpen] = useState(false)
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

  const handleDelete = (commentId: string) => {
    startTransition(async () => {
      await deleteComment(commentId)
    })
  }

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-black transition-colors group"
      >
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 16 16" 
          fill="none" 
          className="stroke-current transition-transform group-hover:scale-110"
          strokeWidth="1.5"
        >
          <path d="M14 10.5V3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v7.5a1 1 0 0 0 1 1h2v2.5l3-2.5h5a1 1 0 0 0 1-1z" />
        </svg>
        <span className="font-medium">{comments.length}</span>
      </button>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-3 animate-in fade-in duration-200">
          {comments.length > 0 && (
            <div className="space-y-2 mb-4">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 rounded-lg p-3 text-sm">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-black text-xs">
                      {comment.profiles?.full_name || 'Anonymous'}
                    </span>
                    {comment.user_id === currentUserId && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="text-xs text-gray-400 hover:text-black transition-colors"
                        disabled={isPending}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  <p className="text-gray-600 leading-relaxed">{comment.content}</p>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 px-3 py-2 bg-gray-50 border-0 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black transition-all"
              disabled={isPending}
            />
            <button
              type="submit"
              disabled={isPending || !newComment.trim()}
              className="px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
            >
              Post
            </button>
          </form>
        </div>
      )}
    </div>
  )
}