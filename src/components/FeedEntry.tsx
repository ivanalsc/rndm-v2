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
  bgColor?: string
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
    <article 
      className="group neobrutal-border neobrutal-shadow overflow-hidden transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none bg-white"
    >
      {/* Imagen principal solo si existe */}
      {entry.additional_image_url && (
        <div className="relative w-full aspect-square neobrutal-border-thick border-b-0">
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
            <div className="relative w-16 h-20 flex-shrink-0 bg-white overflow-hidden neobrutal-border neobrutal-shadow-sm">
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
            <h2 className="font-grotesk font-bold text-black text-2xl leading-tight mb-2 uppercase tracking-tight">
              {entry.title}
            </h2>
            {entry.author_artist && (
              <p className="text-sm font-bold text-black bg-white px-3 py-1 inline-block neobrutal-border neobrutal-shadow-sm">
                {entry.author_artist}
              </p>
            )}
          </div>
          {entry.rating && (
            <div className="flex gap-1.5 flex-shrink-0">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-4 h-4 neobrutal-border transition-all ${
                    i < entry.rating! ? 'bg-[#39FF14]' : 'bg-white'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Descripción */}
        {entry.description && (
          <p className="text-black font-medium leading-relaxed mb-4 text-base">
            {entry.description}
          </p>
        )}

        {/* Meta info y acciones */}
        <div className="pt-4 border-t-4 border-black">
          <div className="flex items-center justify-between">
            <Link 
              href={`/profile/${entry.user_id}`}
              className="text-sm font-bold text-black bg-white px-4 py-2 neobrutal-border neobrutal-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all uppercase"
            >
              {entry.profiles?.full_name || 'Anonymous'}
            </Link>
            <div className="flex items-center gap-4">
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
              <div className="mt-4 space-y-4 border-t-4 border-black pt-4">
            {/* Lista de comentarios */}
            {entry.comments.length > 0 && (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {entry.comments.map((comment) => (
                    <div key={comment.id} className="group flex gap-3">
                      {/* Avatar clickeable */}
                      <Link 
                        href={`/profile/${comment.user_id}`}
                        className="w-10 h-10 bg-white neobrutal-border neobrutal-shadow-sm flex items-center justify-center flex-shrink-0 hover:bg-[#00F5FF] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                      >
                        <span className="text-sm font-bold text-black">
                          {(comment.profiles?.full_name || 'A').charAt(0).toUpperCase()}
                        </span>
                      </Link>
                      
                      <div className="flex-1 min-w-0">
                        <div 
                          className="px-4 py-3 neobrutal-border neobrutal-shadow-sm bg-white"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-black text-sm uppercase">
                              {comment.profiles?.full_name || 'Anonymous'}
                            </span>
                            {comment.user_id === currentUserId && (
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                className="text-xs font-bold text-black bg-white px-2 py-1 neobrutal-border neobrutal-shadow-sm hover:bg-[#FF1744] hover:text-white opacity-0 group-hover:opacity-100 transition-all"
                                disabled={isPending}
                              >
                                DELETE
                              </button>
                            )}
                          </div>
                          <p className="text-sm text-black font-medium leading-relaxed">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {entry.comments.length === 0 && (
              <p className="text-sm font-bold text-black text-center py-4 bg-white neobrutal-border neobrutal-shadow-sm">
                NO COMMENTS YET
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