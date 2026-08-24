# vcrmartinez.com

Site pessoal de Victor Martinez — engenharia contada de dentro.

## Stack

- **Gatsby 5** + **React 18**
- Conteúdo em Markdown (`gatsby-transformer-remark` + `gatsby-remark-prismjs`)
- Imagens com `gatsby-plugin-image` / `gatsby-plugin-sharp`
- Fontes próprias em **woff2** subsetadas (Space Grotesk, DM Sans, JetBrains Mono),
  com `font-display: swap` e `preload` no `<head>`
- CSS único e global (`src/styles/style.css`) — sem CSS-in-JS, sem framework
- Sitemap, `manifest.webmanifest` e RSS (`/rss.xml`) gerados no build
- Node: ver `.nvmrc`

## Comandos

```bash
nvm use            # usa a versão do .nvmrc
npm install
npm run develop    # http://localhost:8000
npm run build      # gera public/
npm run serve      # serve o build em http://localhost:9000
npm run clean      # limpa .cache e public
npm run deploy     # build + publica no branch gh-pages (ver abaixo)
```

## Publicar um texto novo

Cada texto é uma pasta em `content/blog/`, no formato `AAAA-MM-DD-slug/`, com um
`index.md` dentro. Imagens do texto ficam na mesma pasta e são referenciadas por
caminho relativo (`![alt](figura.png)`).

```
content/blog/2026-08-24-o-que-a-ia-acelerou-e-o-que-encareceu/index.md
```

Frontmatter:

```yaml
---
title: "O que a IA acelerou e o que encareceu"
date: 2026-08-24
description: "Resumo de uma linha — usado na listagem, no RSS e nas meta tags."
category: Engenharia
nota: "Publicado originalmente em ... (opcional)"
---
```

| campo | obrigatório | onde aparece |
| --- | --- | --- |
| `title` | sim | título da página, listagens, RSS |
| `date` | sim | ordenação, metadado, RSS |
| `description` | recomendado | listagens, `<meta name="description">`, RSS |
| `category` | opcional | kicker do texto e tag da listagem |
| `nota` | opcional | linha pequena abaixo da data |

A rota sai de graça: `/textos/<slug>/`, onde o slug é o nome da pasta sem o prefixo
de data. O texto entra sozinho na home (3 mais recentes), na página `/textos/`, no
sitemap e no RSS.

### Conteúdo antigo

O blog anterior (2018–2023), as talks e o archive vivem em `content/_old/` e **não
são lidos por nenhum plugin** — a única pasta fonteada é `content/blog`. O `src/`
do site antigo (Gatsby 2 / styled-components) está preservado em `_old-src/`, fora
do build.

## Analytics

Google Analytics 4 sem plugin de terceiro: o componente `Script` do Gatsby carrega
o gtag com `strategy="off-main-thread"` (Partytown, roda em web worker), com
`anonymize_ip: true`. O `page_view` é disparado à mão em `onRouteUpdate`
(`gatsby-browser.js`), para contar também a navegação client-side.

Para ligar, crie um `.env.production` na raiz (já está no `.gitignore`):

```
GATSBY_GA4_ID=G-XXXXXXXXXX
```

**Sem a variável, nenhum script de terceiro é carregado** — nem o Partytown, nem o
gtag. Por isso o site não tem banner de cookies hoje.

- `[CONFIRMAR: GA4 ID]` — o dono precisa criar a propriedade GA4 e colar o
  `G-XXXXXXXXXX` no `.env.production`.
- `[CONFIRMAR: consentimento]` — quando o GA for ligado, decidir se entra banner de
  consentimento (LGPD) ou se o modo anonimizado basta para o volume do site.

## Deploy

O site é servido pelo GitHub Pages a partir do branch `gh-pages`, com domínio
próprio (`CNAME` em `static/`, que o build copia para `public/`). O `.nojekyll`
também sai do `static/`.

```bash
npm run deploy   # gatsby build && gh-pages -d public -b gh-pages --dotfiles
```

**Deploy só com pedido explícito do dono** — `npm run deploy` publica de verdade.
