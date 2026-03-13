import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Digital Dog | Arquitetura Digital'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#03050a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Glow decorativo */}
        <div
          style={{
            position: 'absolute',
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,188,212,0.12) 0%, transparent 70%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />

        {/* Wordmark */}
        <div
          style={{
            color: '#00bcd4',
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: '-2px',
          }}
        >
          Digital Dog
        </div>

        {/* Separador */}
        <div
          style={{
            width: 80,
            height: 2,
            background: '#00bcd4',
            opacity: 0.4,
            marginTop: 24,
            marginBottom: 24,
          }}
        />

        {/* Tagline */}
        <div
          style={{
            color: '#ffffff',
            fontSize: 32,
            opacity: 0.85,
            fontWeight: 400,
          }}
        >
          Arquitetura Digital para PMEs
        </div>

        {/* Sub-tagline */}
        <div
          style={{
            color: '#ffffff',
            fontSize: 20,
            opacity: 0.45,
            marginTop: 16,
          }}
        >
          Marca · Tecnologia · Presença Digital
        </div>

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            color: '#ffffff',
            fontSize: 16,
            opacity: 0.3,
          }}
        >
          digitaldog.com.br
        </div>
      </div>
    ),
    { ...size }
  )
}
