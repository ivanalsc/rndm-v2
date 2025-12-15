'use client'

import { useState, useTransition } from 'react'
import { toggleLike } from '../../app/actions/interactions'

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
    // Optimistic update
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
      className="flex items-center gap-1 text-sm hover:scale-110 transition-transform disabled:opacity-50"
    >
      <span className={liked ? 'text-red-500' : 'text-gray-400'}>
        {liked ? '❤️' : '🤍'}
      </span>
      <span className={liked ? 'text-red-500' : 'text-gray-500'}>
        {count}
      </span>
    </button>
  )
}