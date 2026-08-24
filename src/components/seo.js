import * as React from "react"
import site from "../config/site"

const FONTES = [
  "/assets/fonts/space-grotesk.woff2",
  "/assets/fonts/dm-sans.woff2",
  "/assets/fonts/jetbrains-mono.woff2",
]

/**
 * Tags de <head> das páginas (Gatsby Head API).
 * Espelha o <head> do site estático, com preload das fontes woff2.
 */
const Seo = ({ titulo, descricao, caminho = "/", tipo = "website", children }) => {
  const t = titulo ? `${titulo} · ${site.titulo}` : site.tituloCompleto
  const d = descricao || site.descricao
  const url = `${site.siteUrl}${caminho}`
  const og = `${site.siteUrl}${site.ogImagem}`

  return (
    <>
      <html lang={site.lang} />
      <title>{t}</title>
      <meta name="description" content={d} />
      <meta name="author" content={site.autor} />
      <link rel="canonical" href={url} />
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <link rel="icon" href="/favicon-32.png" type="image/png" sizes="32x32" />
      <meta property="og:type" content={tipo} />
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:site_name" content={site.titulo} />
      <meta property="og:title" content={t} />
      <meta property="og:description" content={d} />
      <meta property="og:image" content={og} />
      <meta property="og:url" content={url} />
      <meta name="twitter:card" content="summary_large_image" />
      {FONTES.map(f => (
        <link
          key={f}
          rel="preload"
          href={f}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      ))}
      <link
        rel="alternate"
        type="application/rss+xml"
        title={site.tituloCompleto}
        href="/rss.xml"
      />
      {children}
    </>
  )
}

export default Seo
