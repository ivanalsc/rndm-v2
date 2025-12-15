'use client'

import { useState, useTransition } from 'react'
import { addComment, deleteComment } from '../../app/actions/interactions'

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
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <span>💬</span>
        <span>{comments.length}</span>
      </button>

      {isOpen && (
        <div className="mt-4 pt-4 border-t space-y-3">
          {/* Lista de comentarios */}
          {comments.length > 0 && (
            <div className="space-y-2 mb-3">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 rounded p-2 text-sm">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-gray-900">
                      {comment.profiles?.full_name || 'Usuario'}
                    </span>
                    {comment.user_id === currentUserId && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="text-xs text-red-500 hover:text-red-700"
                        disabled={isPending}
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* Formulario para nuevo comentario */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escribe un comentario..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isPending}
            />
            <button
              type="submit"
              disabled={isPending || !newComment.trim()}
              className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Enviar
            </button>
          </form>
        </div>
      )}
    </div>
  )
}