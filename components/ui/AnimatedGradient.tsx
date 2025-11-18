'use client'

import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect } from 'react'

interface AnimatedGradientProps {
  className?: string
}

export function AnimatedGradient({ className = '' }: AnimatedGradientProps) {
  // Valores de movimento para cada orb
  const x1 = useMotionValue(0)
  const y1 = useMotionValue(0)
  const x2 = useMotionValue(0)
  const y2 = useMotionValue(0)
  const x3 = useMotionValue(0)
  const y3 = useMotionValue(0)
  const scale1 = useMotionValue(1)
  const scale2 = useMotionValue(1)
  const scale3 = useMotionValue(1)
  const opacity1 = useMotionValue(0.08)
  const opacity2 = useMotionValue(0.06)
  const opacity3 = useMotionValue(0.05)

  // Transformar valores em posições percentuais
  const posX1 = useTransform(x1, (value) => `${20 + value}%`)
  const posY1 = useTransform(y1, (value) => `${30 + value}%`)
  const posX2 = useTransform(x2, (value) => `${70 + value}%`)
  const posY2 = useTransform(y2, (value) => `${70 + value}%`)
  const posX3 = useTransform(x3, (value) => `${50 + value}%`)
  const posY3 = useTransform(y3, (value) => `${50 + value}%`)

  useEffect(() => {
    // Orb 1 - Movimento circular suave
    const controls1 = animate(x1, [0, 15, -10, 0], {
      duration: 25,
      repeat: Infinity,
      ease: 'easeInOut',
    })
    animate(y1, [0, -12, 8, 0], {
      duration: 25,
      repeat: Infinity,
      ease: 'easeInOut',
    })
    animate(scale1, [1, 1.15, 0.95, 1], {
      duration: 25,
      repeat: Infinity,
      ease: 'easeInOut',
    })
    animate(opacity1, [0.08, 0.12, 0.06, 0.08], {
      duration: 25,
      repeat: Infinity,
      ease: 'easeInOut',
    })

    // Orb 2 - Movimento oposto
    const controls2 = animate(x2, [0, -12, 10, 0], {
      duration: 30,
      repeat: Infinity,
      ease: 'easeInOut',
    })
    animate(y2, [0, 10, -8, 0], {
      duration: 30,
      repeat: Infinity,
      ease: 'easeInOut',
    })
    animate(scale2, [1, 1.1, 0.98, 1], {
      duration: 30,
      repeat: Infinity,
      ease: 'easeInOut',
    })
    animate(opacity2, [0.06, 0.1, 0.05, 0.06], {
      duration: 30,
      repeat: Infinity,
      ease: 'easeInOut',
    })

    // Orb 3 - Movimento central lento
    const controls3 = animate(x3, [0, 10, -8, 0], {
      duration: 35,
      repeat: Infinity,
      ease: 'easeInOut',
    })
    animate(y3, [0, -10, 7, 0], {
      duration: 35,
      repeat: Infinity,
      ease: 'easeInOut',
    })
    animate(scale3, [1, 1.12, 0.96, 1], {
      duration: 35,
      repeat: Infinity,
      ease: 'easeInOut',
    })
    animate(opacity3, [0.05, 0.09, 0.04, 0.05], {
      duration: 35,
      repeat: Infinity,
      ease: 'easeInOut',
    })

    return () => {
      controls1.stop()
      controls2.stop()
      controls3.stop()
    }
  }, [x1, y1, x2, y2, x3, y3, scale1, scale2, scale3, opacity1, opacity2, opacity3])

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Orb 1 - Grande e suave */}
      <motion.div
        className="absolute rounded-full blur-[120px]"
        style={{
          width: '1400px',
          height: '1400px',
          left: posX1,
          top: posY1,
          transform: 'translate(-50%, -50%)',
          scale: scale1,
          opacity: opacity1,
          background: 'radial-gradient(circle, rgba(0, 188, 212, 0.4) 0%, transparent 70%)',
        }}
      />

      {/* Orb 2 - Médio */}
      <motion.div
        className="absolute rounded-full blur-[100px]"
        style={{
          width: '1200px',
          height: '1200px',
          left: posX2,
          top: posY2,
          transform: 'translate(-50%, -50%)',
          scale: scale2,
          opacity: opacity2,
          background: 'radial-gradient(circle, rgba(77, 208, 225, 0.35) 0%, transparent 70%)',
        }}
      />

      {/* Orb 3 - Central grande */}
      <motion.div
        className="absolute rounded-full blur-[140px]"
        style={{
          width: '1600px',
          height: '1600px',
          left: posX3,
          top: posY3,
          transform: 'translate(-50%, -50%)',
          scale: scale3,
          opacity: opacity3,
          background: 'radial-gradient(circle, rgba(0, 188, 212, 0.3) 0%, transparent 75%)',
        }}
      />
    </div>
  )
}

