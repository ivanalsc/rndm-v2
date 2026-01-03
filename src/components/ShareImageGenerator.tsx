'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ShareImageGeneratorProps {
  entry: {
    id: string
    type: string
    title: string
    author_artist: string | null
    cover_image_url: string | null
    additional_image_url: string | null
    description: string | null
    rating: number | null
  }
}

export default function ShareImageGenerator({ entry }: ShareImageGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const getTypeIcon = () => {
    switch (entry.type) {
      case 'book': return '📚'
      case 'music': return '🎵'
      case 'movie': return '🎬'
      case 'series': return '📺'
      default: return '📌'
    }
  }

  const getTypeLabel = () => {
    switch (entry.type) {
      case 'book': return 'Book'
      case 'music': return 'Music'
      case 'movie': return 'Movie'
      case 'series': return 'Series'
      default: return 'Entry'
    }
  }

  const generateAndDownloadImage = async () => {
    setIsGenerating(true)
    
    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      
      canvas.width = 1080
      canvas.height = 1080
      
      ctx.fillStyle = '#FAF9F6'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      const hasAdditionalImage = !!entry.additional_image_url
      const hasCover = !!entry.cover_image_url
      
      if (hasAdditionalImage && hasCover) {
        
        const coverImg = await loadImage(entry.cover_image_url!)
        const coverWidth = 200
        const coverHeight = 280
        const coverX = 820
        const coverY = 50
        
        ctx.save()
        ctx.translate(coverX + coverWidth/2, coverY + coverHeight/2)
        ctx.rotate(8 * Math.PI / 180) 
        
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)'
        ctx.shadowBlur = 25
        ctx.shadowOffsetX = 5
        ctx.shadowOffsetY = 5
        
        ctx.drawImage(coverImg, -coverWidth/2, -coverHeight/2, coverWidth, coverHeight)
        ctx.restore()
        
        ctx.shadowColor = 'transparent'
        ctx.shadowBlur = 0
        
        const additionalImg = await loadImage(entry.additional_image_url!)
        const mainWidth = 900
        const mainHeight = 600
        const mainX = (canvas.width - mainWidth) / 2
        const mainY = 400
        
        ctx.shadowColor = 'rgba(0, 0, 0, 0.15)'
        ctx.shadowBlur = 30
        ctx.shadowOffsetY = 10
        
        ctx.drawImage(additionalImg, mainX, mainY, mainWidth, mainHeight)
        
        ctx.shadowColor = 'transparent'
        ctx.shadowBlur = 0
        ctx.shadowOffsetY = 0
        
      } else if (hasAdditionalImage) {
        const img = await loadImage(entry.additional_image_url!)
        const size = 700
        const x = (canvas.width - size) / 2
        const y = 200
        
        ctx.shadowColor = 'rgba(0, 0, 0, 0.15)'
        ctx.shadowBlur = 30
        ctx.shadowOffsetY = 10
        
        ctx.drawImage(img, x, y, size, size)
        
        ctx.shadowColor = 'transparent'
        ctx.shadowBlur = 0
        ctx.shadowOffsetY = 0
        
      } else if (hasCover) {
        const img = await loadImage(entry.cover_image_url!)
        const width = 480
        const height = 650
        const x = (canvas.width - width) / 2
        const y = 180
        
        ctx.shadowColor = 'rgba(0, 0, 0, 0.15)'
        ctx.shadowBlur = 30
        ctx.shadowOffsetY = 10
        
        ctx.drawImage(img, x, y, width, height)
        
        ctx.shadowColor = 'transparent'
        ctx.shadowBlur = 0
        ctx.shadowOffsetY = 0
      }
      
      ctx.fillStyle = '#000000'
      ctx.font = 'bold 52px Space Grotesk, sans-serif'
      ctx.textAlign = 'center'
      const titleLines = wrapText(ctx, entry.title, 950)
      let titleY = 90
      titleLines.slice(0, 2).forEach((line) => {
        ctx.fillText(line, canvas.width / 2, titleY)
        titleY += 58
      })
      
      if (entry.rating) {
        const circleSize = 12
        const gap = 8
        const totalWidth = (circleSize * 5) + (gap * 4)
        let circleX = (canvas.width - totalWidth) / 2
        const circleY = 950
        
        for (let i = 0; i < 5; i++) {
          ctx.beginPath()
          ctx.arc(circleX + circleSize/2, circleY, circleSize/2, 0, Math.PI * 2)
          ctx.fillStyle = i < entry.rating ? '#35553D' : '#E5E7EB'
          ctx.fill()
          circleX += circleSize + gap
        }
      }
      
      if (entry.description) {
        ctx.fillStyle = '#6B7280'
        ctx.font = '28px system-ui, sans-serif'
        ctx.textAlign = 'center'
        const descLines = wrapText(ctx, entry.description, 900)
        let descY = entry.rating ? 995 : 950
        descLines.slice(0, 2).forEach((line) => {
          ctx.fillText(line, canvas.width / 2, descY)
          descY += 35
        })
      }
      
      ctx.fillStyle = '#9CA3AF'
      ctx.font = 'bold 32px Space Grotesk, sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText('rndm', 60, canvas.height - 50)
      
      if (entry.author_artist) {
        ctx.textAlign = 'center'
        ctx.fillStyle = '#6B7280'
        ctx.font = '26px system-ui, sans-serif'
        ctx.fillText(`by ${entry.author_artist}`, canvas.width / 2, canvas.height - 50)
      }
      
      ctx.textAlign = 'right'
      ctx.fillStyle = '#35553D'
      ctx.font = 'bold 28px system-ui, sans-serif'
      ctx.fillText(`${getTypeIcon()} ${getTypeLabel()}`, canvas.width - 60, canvas.height - 50)
      
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `${entry.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-rndm.png`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        }
        setIsGenerating(false)
        setIsOpen(false)
      }, 'image/png')
      
    } catch (error) {
      console.error('Error generating image:', error)
      setIsGenerating(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex-1 text-xs text-gray-400 hover:text-[#35553D] transition-colors font-medium"
      >
        Share
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold font-grotesk text-black">Share Entry</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-black transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-6 bg-[#FAF9F6] rounded-xl overflow-hidden p-8">
              <div className="space-y-4">
                <div className="text-center">
                  <h4 className="font-grotesk font-bold text-black text-base mb-2 line-clamp-2">
                    {entry.title}
                  </h4>
                  
                  {/* Rating preview */}
                  {entry.rating && (
                    <div className="flex gap-1 justify-center mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full ${
                            i < entry.rating! ? 'bg-[#35553D]' : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                  
                  {entry.description && (
                    <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                      {entry.description}
                    </p>
                  )}
                </div>
                
                <div className="relative">
                  {entry.additional_image_url && entry.cover_image_url ? (
                    <>
                      <div className="absolute right-0 -top-8 z-10">
                        <div className="relative w-12 h-16 bg-gray-100 rounded overflow-hidden transform rotate-6 shadow-md">
                          <Image
                            src={entry.cover_image_url}
                            alt=""
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      </div>
                      <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden mt-4">
                        <Image
                          src={entry.additional_image_url}
                          alt=""
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    </>
                  ) : entry.additional_image_url ? (
                    <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={entry.additional_image_url}
                        alt=""
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : entry.cover_image_url ? (
                    <div className="relative w-28 h-40 bg-gray-100 rounded overflow-hidden mx-auto">
                      <Image
                        src={entry.cover_image_url}
                        alt=""
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : null}
                </div>
                
                <div className="flex justify-between items-center pt-2 text-xs">
                  <span className="text-gray-400 font-bold font-grotesk">rndm</span>
                  {entry.author_artist && (
                    <span className="text-gray-500">by {entry.author_artist}</span>
                  )}
              
                </div>
              </div>
            </div>

            <button
              onClick={generateAndDownloadImage}
              disabled={isGenerating}
              className="w-full bg-[#35553D] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#2a4430] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Generating...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 11v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-2M8 11V3M5 6l3-3 3 3" />
                  </svg>
                  Download Image
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  )
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = url
  })
}

// Función auxiliar para hacer wrap del texto
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = words[0]

  for (let i = 1; i < words.length; i++) {
    const word = words[i]
    const width = ctx.measureText(currentLine + ' ' + word).width
    if (width < maxWidth) {
      currentLine += ' ' + word
    } else {
      lines.push(currentLine)
      currentLine = word
    }
  }
  lines.push(currentLine)
  return lines
}