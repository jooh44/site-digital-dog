'use client'

import React, { useState } from 'react'
import Image, { ImageProps } from 'next/image'
import { ImageIcon } from 'lucide-react'

interface ImageWithFallbackProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc?: string
  fallbackText?: string
  showPlaceholder?: boolean
}

export function ImageWithFallback({
  src,
  alt,
  fallbackSrc,
  fallbackText,
  showPlaceholder = true,
  className = '',
  ...props
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (fallbackSrc && imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc)
    } else {
      setHasError(true)
    }
  }

  // Se houver erro e não houver fallback, mostra placeholder
  if (hasError && !fallbackSrc) {
    return (
      <div
        className={`flex items-center justify-center bg-dark-blue/50 border border-primary-blue/20 ${className}`}
        style={props.fill ? { position: 'absolute', inset: 0 } : undefined}
        role="img"
        aria-label={alt || 'Imagem não disponível'}
      >
        {showPlaceholder ? (
          <div className="flex flex-col items-center justify-center text-center p-4">
            <ImageIcon className="w-8 h-8 text-primary-blue/40 mb-2" />
            {fallbackText && (
              <span className="text-xs text-light-blue/60 font-body">
                {fallbackText}
              </span>
            )}
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-dark-blue/50 to-darker-blue/50" />
        )}
      </div>
    )
  }

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt || ''}
      className={className}
      onError={handleError}
      onLoad={() => setHasError(false)}
    />
  )
}

