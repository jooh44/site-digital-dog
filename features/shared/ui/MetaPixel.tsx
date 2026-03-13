'use client'

import Script from 'next/script'
import { useEffect } from 'react'

const PIXEL_ID = '1606049663720121'

export function MetaPixel() {
  useEffect(() => {
    // Rastrear cliques em botões WhatsApp
    const trackWhatsAppClick = () => {
      if (typeof fbq !== 'undefined') {
        fbq('track', 'Contact') // Evento de contato
      }
    }

    // Buscar todos os links WhatsApp
    const whatsappLinks = document.querySelectorAll(
      'a[href*="api.whatsapp.com"], a[href*="whatsapp.com"]'
    )

    whatsappLinks.forEach((link) => {
      link.addEventListener('click', trackWhatsAppClick)
    })

    return () => {
      whatsappLinks.forEach((link) => {
        link.removeEventListener('click', trackWhatsAppClick)
      })
    }
  }, [])

  return (
    <>
      {/* Meta Pixel Script */}
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />

      {/* Meta Pixel Noscript */}
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt="Meta Pixel"
        />
      </noscript>
    </>
  )
}

// Type declaration para fbq global
declare global {
  function fbq(...args: any[]): void
}
