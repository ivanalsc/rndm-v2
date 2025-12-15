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
      // Crear un canvas
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      
      // Tamaño de la imagen (como en tu ejemplo)
      canvas.width = 800
      canvas.height = 400
      
      // Fondo blanco
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Cargar la imagen de portada si existe
      if (entry.cover_image_url) {
        const img = await loadImage(entry.cover_image_url)
        // Dibujar imagen a la izquierda (cuadrada)
        const size = 400
        ctx.drawImage(img, 0, 0, size, size)
      } else {
        // Si no hay imagen, dibujar un placeholder con el emoji
        ctx.fillStyle = '#F3F4F6'
        ctx.fillRect(0, 0, 400, 400)
        ctx.font = 'bold 120px Arial'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(getTypeIcon(), 200, 200)
      }
      
      // Área de texto a la derecha
      const textX = 440
      const textAreaWidth = 340
      
      // Tipo de contenido (arriba)
      ctx.fillStyle = '#6366F1'
      ctx.font = 'bold 16px Arial'
      ctx.textAlign = 'left'
      ctx.fillText(`${getTypeIcon()} ${getTypeLabel().toUpperCase()}`, textX, 80)
      
      // Título (centro, con wrapping)
      ctx.fillStyle = '#111827'
      ctx.font = 'bold 32px Arial'
      const titleLines = wrapText(ctx, entry.title, textAreaWidth)
      let titleY = 150
      titleLines.forEach((line) => {
        ctx.fillText(line, textX, titleY)
        titleY += 40
      })
      
      // Autor/Artista (debajo del título)
      if (entry.author_artist) {
        ctx.fillStyle = '#6B7280'
        ctx.font = '20px Arial'
        const authorLines = wrapText(ctx, `by ${entry.author_artist}`, textAreaWidth)
        let authorY = titleY + 20
        authorLines.forEach((line) => {
          ctx.fillText(line, textX, authorY)
          authorY += 28
        })
      }
      
      // Logo/marca abajo
      ctx.fillStyle = '#9CA3AF'
      ctx.font = 'bold 18px Arial'
      ctx.fillText('rndm', textX, 360)
      
      // Convertir a blob y descargar
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
        className="text-sm text-indigo-600 hover:text-indigo-800 py-2"
      >
        📤 Compartir
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Compartir entrada</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Preview de la imagen */}
            <div className="mb-6 border rounded-lg overflow-hidden">
              <div className="flex bg-white" style={{ height: '300px' }}>
                {/* Portada */}
                <div className="w-1/2 relative bg-gray-100 flex items-center justify-center">
                  {entry.cover_image_url ? (
                    <Image
                      src={entry.cover_image_url}
                      alt={entry.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <span className="text-6xl">{getTypeIcon()}</span>
                  )}
                </div>
                
                {/* Texto */}
                <div className="w-1/2 p-6 flex flex-col justify-center">
                  <div className="text-xs font-bold text-indigo-600 mb-3">
                    {getTypeIcon()} {getTypeLabel().toUpperCase()}
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2 line-clamp-3">
                    {entry.title}
                  </h4>
                  {entry.author_artist && (
                    <p className="text-sm text-gray-600 mb-4">
                      by {entry.author_artist}
                    </p>
                  )}
                  <div className="mt-auto">
                    <p className="text-xs text-gray-400 font-bold">rndm</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={generateAndDownloadImage}
              disabled={isGenerating}
              className="w-full bg-indigo-600 text-white px-4 py-3 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Generando...
                </>
              ) : (
                <>
                  <span>⬇️</span>
                  Descargar imagen
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  )
}

// Función auxiliar para cargar imágenes
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
  return lines.slice(0, 3) // Máximo 3 líneas
}