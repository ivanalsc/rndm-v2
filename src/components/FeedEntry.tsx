// src/components/FeedEntry.tsx
'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import LikeButton from './LikeButton'
import CommentsSection from './CommentsSection'
import CommentForm from './CommentForm'
import { deleteComment } from '../../app/actions/interactions'

interface Comment {
  id: string
  content: string
  created_at: string
  user_id: string
  profiles: {
    full_name: string | null
  } | null
}

interface Entry {
  id: string
  user_id: string
  type: string
  title: string
  author_artist: string | null
  cover_image_url: string | null
  additional_image_url: string | null
  description: string | null
  rating: number | null
  is_public: boolean
  profiles?: {
    id?: string
    full_name: string | null
    username: string | null
  } | null
  likesCount: number
  userLiked: boolean
  comments: Comment[]
}

interface FeedEntryProps {
  entry: Entry
  currentUserId: string
}

export default function FeedEntry({ entry, currentUserId }: FeedEntryProps) {
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleDeleteComment = (commentId: string) => {
    if (confirm('Delete this comment?')) {
      startTransition(async () => {
        await deleteComment(commentId)
      })
    }
  }

  return (
    <article className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Imagen principal solo si existe */}
      {entry.additional_image_url && (
        <div className="relative w-full aspect-square bg-gray-100">
          <Image
            src={entry.additional_image_url}
            alt={entry.title}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      )}
      
      {/* Contenido */}
      <div className="p-6">
        {/* Header con cover thumbnail y rating */}
        <div className="flex items-start gap-4 mb-4">
          {entry.cover_image_url && (
            <div className="relative w-12 h-16 flex-shrink-0 bg-gray-100 overflow-hidden rounded">
              <Image
                src={entry.cover_image_url}
                alt=""
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="font-grotesk font-bold text-black text-xl leading-tight mb-2">
              {entry.title}
            </h2>
            {entry.author_artist && (
              <p className="text-sm text-gray-500">
                {entry.author_artist}
              </p>
            )}
          </div>
          {entry.rating && (
            <div className="flex gap-1 flex-shrink-0">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    i < entry.rating! ? 'bg-[#35553D]' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Descripción */}
        {entry.description && (
          <p className="text-gray-600 leading-relaxed mb-4">
            {entry.description}
          </p>
        )}

        {/* Meta info y acciones */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <Link 
              href={`/profile/${entry.user_id}`}
              className="text-xs text-gray-400 hover:text-[#35553D] font-medium transition-colors"
            >
              {entry.profiles?.full_name || 'Anonymous'}
            </Link>
            <div className="flex items-center gap-6">
              <LikeButton
                entryId={entry.id}
                initialLiked={entry.userLiked}
                initialCount={entry.likesCount}
              />
              <CommentsSection
                entryId={entry.id}
                comments={entry.comments}
                currentUserId={currentUserId}
                isOpen={commentsOpen}
                onToggle={() => setCommentsOpen(!commentsOpen)}
              />
            </div>
          </div>
        </div>

        {/* Sección de comentarios expandida */}
        {commentsOpen && (
          <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 duration-200 border-t border-gray-100 pt-4">
            {/* Lista de comentarios */}
            {entry.comments.length > 0 && (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {entry.comments.map((comment) => (
                  <div key={comment.id} className="group flex gap-2.5">
                    {/* Avatar clickeable */}
                    <Link 
                      href={`/profile/${comment.user_id}`}
                      className="w-7 h-7 rounded-full bg-[#35553D]/10 flex items-center justify-center flex-shrink-0 mt-0.5 hover:bg-[#35553D]/20 transition-colors"
                    >
                      <span className="text-xs font-medium text-[#35553D]">
                        {(comment.profiles?.full_name || 'A').charAt(0).toUpperCase()}
                      </span>
                    </Link>
                    
                    <div className="flex-1 min-w-0">
                      <div className="bg-gray-50 rounded-xl px-3 py-2.5">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-black text-xs">
                            {comment.profiles?.full_name || 'Anonymous'}
                          </span>
                          {comment.user_id === currentUserId && (
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="text-xs text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                              disabled={isPending}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {entry.comments.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-3">
                No comments yet
              </p>
            )}
            
            {/* Formulario de comentario */}
            <CommentForm entryId={entry.id} />
          </div>
        )}
      </div>
    </article>
  )
}