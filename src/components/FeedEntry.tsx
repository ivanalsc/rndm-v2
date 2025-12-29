'use client'

import { useState } from 'react'
import Image from 'next/image'
import LikeButton from './LikeButton'
import CommentsSection from './CommentsSection'
import CommentForm from './CommentForm'

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
  type: string
  title: string
  author_artist: string | null
  cover_image_url: string | null
  additional_image_url: string | null
  description: string | null
  rating: number | null
  is_public: boolean
  profiles?: {
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

  return (
    <article className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
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
      
      <div className="p-6">
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

        {entry.description && (
          <p className="text-gray-600 leading-relaxed mb-4">
            {entry.description}
          </p>
        )}

        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">
              {entry.profiles?.full_name || 'Anonymous'}
            </span>
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

        {commentsOpen && (
          <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 duration-200 border-t border-gray-100 pt-4">
            {/* Lista de comentarios */}
            {entry.comments.length > 0 && (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {entry.comments.map((comment) => (
                  <div key={comment.id} className="group flex gap-2.5">
                    {/* Avatar placeholder */}
                    <div className="w-7 h-7 rounded-full bg-[#35553D]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-[#35553D]">
                        {(comment.profiles?.full_name || 'A').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="bg-gray-50 rounded-xl px-3 py-2.5">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-black text-xs">
                            {comment.profiles?.full_name || 'Anonymous'}
                          </span>
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