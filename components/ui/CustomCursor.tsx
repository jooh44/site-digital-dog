'use client'

import React, { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)

  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  // Suavização para o anel externo (atraso elegante)
  const springConfig = { damping: 25, stiffness: 300 }
  const cursorX = useSpring(mouseX, springConfig)
  const cursorY = useSpring(mouseY, springConfig)

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)

    // Detectar hover em elementos interativos
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isInteractive = 
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'INPUT' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[role="button"]') ||
        target.classList.contains('interactive')

      setIsHovering(!!isInteractive)
    }

    // Ocultar cursor quando sair da janela
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

  // Não renderizar em dispositivos touch (detecção simples)
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Ponto Central (Direto) */}
      <motion.div
        className="absolute h-2 w-2 rounded-full bg-primary-blue shadow-[0_0_10px_#00bcd4]"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: isVisible ? 1 : 0,
        }}
      />

      {/* Anel Externo (Com Delay/Spring) */}
      <motion.div
        className="absolute rounded-full border border-primary-blue/50"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: isVisible ? 1 : 0,
        }}
        animate={{
          height: isHovering ? 60 : 32,
          width: isHovering ? 60 : 32,
          borderColor: isHovering ? 'rgba(0, 188, 212, 0.8)' : 'rgba(0, 188, 212, 0.3)',
          backgroundColor: isHovering ? 'rgba(0, 188, 212, 0.05)' : 'transparent',
          scale: isClicking ? 0.8 : 1,
        }}
        transition={{
          type: 'spring',
          damping: 25,
          stiffness: 300,
        }}
      >
        {/* Efeito de mira Tech (cantos ou cruz) quando hover */}
        <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            animate={{ opacity: isHovering ? 1 : 0 }}
        >
            <div className="w-1 h-1 bg-primary-blue/80 rounded-full" />
        </motion.div>
      </motion.div>
    </div>
  )
}

