'use client'

import React, { useEffect, useState } from 'react'
import { motion, useMotionValue } from 'framer-motion'

// Cursor pixelado clássico estilo Windows/gaming - mais definido
const CURSOR_ARROW = [
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0],
  [1, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0],
  [1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0],
  [1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0],
  [1, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0],
  [1, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
  [1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1],
  [1, 2, 2, 1, 2, 2, 1, 0, 0, 0, 0],
  [1, 2, 1, 0, 1, 2, 2, 1, 0, 0, 0],
  [1, 1, 0, 0, 1, 2, 2, 1, 0, 0, 0],
  [1, 0, 0, 0, 0, 1, 2, 2, 1, 0, 0],
  [0, 0, 0, 0, 0, 1, 2, 2, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 0],
  [0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
]

// Cursor pointer (mãozinha) - mais compacto e limpo
const CURSOR_POINTER = [
  [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 2, 2, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 1, 2, 2, 1, 2, 2, 1, 0, 0],
  [0, 1, 1, 0, 1, 2, 2, 1, 2, 2, 1, 1, 0],
  [1, 2, 2, 1, 1, 2, 2, 1, 2, 2, 1, 2, 1],
  [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1],
  [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
  [0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 1, 0],
  [0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0],
  [0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
]

const PIXEL_SIZE = 2

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  // Escolhe o cursor baseado no estado
  const currentCursor = isHovering ? CURSOR_POINTER : CURSOR_ARROW
  const cols = currentCursor[0]?.length || 11

  useEffect(() => {
    setIsMounted(true)
    
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isInteractive = 
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[role="button"]') ||
        target.classList.contains('interactive') ||
        target.classList.contains('cursor-pointer')

      setIsHovering(!!isInteractive)
    }

    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseEnter = () => setIsVisible(true)

    window.addEventListener('mousemove', moveCursor)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [isVisible, mouseX, mouseY])

  if (!isMounted) return null
  
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null
  }

  return (
    <motion.div 
      className="pointer-events-none fixed z-[9999]"
      style={{
        x: mouseX,
        y: mouseY,
        opacity: isVisible ? 1 : 0,
      }}
    >
      <div 
        style={{ 
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, ${PIXEL_SIZE}px)`,
          transform: isClicking ? 'scale(0.9)' : 'scale(1)',
          transition: 'transform 0.08s ease-out',
        }}
      >
        {currentCursor.map((row, y) =>
          row.map((pixel, x) => (
            <div
              key={`${x}-${y}`}
              style={{
                width: PIXEL_SIZE,
                height: PIXEL_SIZE,
                backgroundColor:
                  pixel === 1
                    ? '#000000'
                    : pixel === 2
                    ? '#FFFFFF'
                    : 'transparent',
              }}
            />
          ))
        )}
      </div>
    </motion.div>
  )
}

