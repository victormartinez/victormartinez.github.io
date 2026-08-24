import * as React from "react"
import { Script } from "gatsby"

export const GA4_ID = process.env.GATSBY_GA4_ID

/**
 * Google Analytics 4 sem plugin de terceiro.
 *
 * - Só renderiza se `GATSBY_GA4_ID` existir no ambiente de build. Sem ID,
 *   o site não carrega uma única linha de script de terceiro (e por isso
 *   não precisa de banner de consentimento).
 * - `strategy="off-main-thread"` (Partytown): o gtag roda em web worker,
 *   fora da main thread. Os endpoints do Google mandam
 *   `access-control-allow-origin: *`, então funciona em host estático
 *   (GitHub Pages) sem reverse proxy.
 * - `anonymize_ip: true` e `send_page_view: false` — o page_view é disparado
 *   à mão em `onRouteUpdate` (gatsby-browser.js), inclusive na primeira
 *   carga, para contar navegação client-side.
 */
const Analytics = () => {
  if (!GA4_ID) return null

  return (
    <>
      <Script
        id="ga4-bootstrap"
        strategy="off-main-thread"
        forward={["gtag"]}
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){ dataLayer.push(arguments); }
            gtag('js', new Date());
            gtag('config', '${GA4_ID}', {
              anonymize_ip: true,
              send_page_view: false
            });
          `,
        }}
      />
      <Script
        id="ga4-gtag"
        strategy="off-main-thread"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
      />
    </>
  )
}

export default Analytics
