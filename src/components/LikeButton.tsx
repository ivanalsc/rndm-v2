'use client'

import { toggleLike } from '../../app/actions/interactions'
import { useState, useTransition } from 'react'

interface LikeButtonProps {
  entryId: string
  initialLiked: boolean
  initialCount: number
}

export default function LikeButton({ entryId, initialLiked, initialCount }: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)
  const [isPending, startTransition] = useTransition()

  const handleLike = () => {
    setLiked(!liked)
    setCount(liked ? count - 1 : count + 1)

    startTransition(async () => {
      await toggleLike(entryId)
    })
  }

  return (
    <button
      onClick={handleLike}
      disabled={isPending}
      className="flex items-center gap-1.5 text-xs transition-all disabled:opacity-50 group"
    >
      <svg 
        width="16" 
        height="16" 
        viewBox="0 0 16 16" 
        fill="none" 
        className={`transition-all duration-300 ${
          liked 
            ? 'fill-black scale-110' 
            : 'stroke-gray-400 group-hover:stroke-black group-hover:scale-110'
        }`}
        strokeWidth="1.5"
      >
        <path d="M8 14s-6-4-6-8c0-2 1.5-3 3-3 1.5 0 3 1 3 3 0-2 1.5-3 3-3 1.5 0 3 1 3 3 0 4-6 8-6 8z" />
      </svg>
      <span className={`font-medium transition-colors ${
        liked ? 'text-black' : 'text-gray-400 group-hover:text-black'
      }`}>
        {count}
      </span>
    </button>
  )
}