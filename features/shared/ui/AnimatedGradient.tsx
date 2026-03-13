'use client'

interface AnimatedGradientProps {
  className?: string
}

export function AnimatedGradient({ className = '' }: AnimatedGradientProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Orb 1 - Grande e suave */}
      <div
        className="absolute rounded-full blur-[120px] animate-pulse"
        style={{
          width: '1400px',
          height: '1400px',
          left: '20%',
          top: '30%',
          transform: 'translate(-50%, -50%)',
          opacity: 0.08,
          background: 'radial-gradient(circle, rgba(0, 188, 212, 0.4) 0%, transparent 70%)',
        }}
      />

      {/* Orb 2 - Médio */}
      <div
        className="absolute rounded-full blur-[100px]"
        style={{
          width: '1200px',
          height: '1200px',
          left: '70%',
          top: '70%',
          transform: 'translate(-50%, -50%)',
          opacity: 0.06,
          background: 'radial-gradient(circle, rgba(77, 208, 225, 0.35) 0%, transparent 70%)',
        }}
      />

      {/* Orb 3 - Central grande */}
      <div
        className="absolute rounded-full blur-[140px]"
        style={{
          width: '1600px',
          height: '1600px',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 0.05,
          background: 'radial-gradient(circle, rgba(0, 188, 212, 0.3) 0%, transparent 75%)',
        }}
      />
    </div>
  )
}
