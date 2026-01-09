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
      className={`flex items-center gap-2 px-3 py-2 neobrutal-border neobrutal-shadow-sm transition-all disabled:opacity-50 hover:translate-x-1 hover:translate-y-1 hover:shadow-none ${
        liked ? 'bg-[#FF1744]' : 'bg-[#39FF14]'
      }`}
    >
      <svg 
        width="18" 
        height="18" 
        viewBox="0 0 16 16" 
        fill={liked ? 'white' : 'none'}
        className="transition-all"
        stroke={liked ? 'white' : 'black'}
        strokeWidth="3"
      >
        <path d="M8 14s-6-4-6-8c0-2 1.5-3 3-3 1.5 0 3 1 3 3 0-2 1.5-3 3-3 1.5 0 3 1 3 3 0 4-6 8-6 8z" />
      </svg>
      <span className={`font-bold text-sm transition-colors ${
        liked ? 'text-white' : 'text-black'
      }`}>
        {count}
      </span>
    </button>
  )
}