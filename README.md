# vcrmartinez.com

Site pessoal de Victor Martinez — engenharia contada de dentro.

## Stack

- **Gatsby 5** + **React 18**
- Conteúdo em Markdown (`gatsby-transformer-remark` + `gatsby-remark-prismjs`)
- Imagens com `gatsby-plugin-image` / `gatsby-plugin-sharp`
- Fontes próprias em **woff2** subsetadas (Space Grotesk, DM Sans, JetBrains Mono),
  com `font-display: swap` e `preload` no `<head>`
- CSS único e global (`src/styles/style.css`) — sem CSS-in-JS, sem framework
- Layout "Lego isométrico": fundo quadriculado e cenas de blocos em CSS 3D, sem
  canvas nem imagem. O motor está em `src/components/lego.js` (um bloco =
  três faces + pinos) e as cenas da home em `src/components/cenas.js`
- Sitemap, `manifest.webmanifest` e RSS (`/rss.xml`) gerados no build
- Node: ver `.nvmrc`

## Comandos

O `make` é a porta de entrada: cada alvo passa por `scripts/com-node.sh`, que
carrega o **nvm** e seleciona a versão do `.nvmrc` antes de rodar. Não precisa
`nvm use` na mão, e não importa qual Node está no seu PATH.

```bash
make                            # lista os comandos
make novo-texto TITULO="..."    # cria a pasta e o frontmatter de um texto
make editor                     # editor de notas e textos, salva sozinho (localhost:8100)
make dev                        # http://localhost:8000, com recarga
make build                      # gera public/
make servir                     # serve o build em http://localhost:9000
make publicar MSG="..."         # commita content/ e faz push na main (dispara o deploy)
make deps                       # instala as dependências
make limpar                     # limpa .cache e public
```

O `make publicar` mostra tudo o que vai subir e pede confirmação. Ele se recusa
a rodar fora da `main` (numa branch ou worktree o commit não iria ao ar), quando o
GitHub tem commits que a pasta não tem, e avisa se o push falhar depois do commit.
O commit leva só `content/`.

Os scripts npm equivalentes (`npm run develop|build|serve|clean`) seguem
funcionando para quem preferir — só exigem `nvm use` antes.

## Publicar um texto novo

O caminho mais curto é o editor:

```bash
make editor        # http://localhost:8100 → aba Textos → Novo texto
```

Ele cria a pasta, preenche o frontmatter, salva sozinho enquanto você escreve e
mostra a prévia com o CSS do site. **Imagem é com ele também**: cole, arraste ou
use o botão Imagem — o arquivo vai para a pasta do texto, foto grande é
reduzida para 2000 px de largura, formato que o site não aceita (HEIC) é
convertido para JPG quando o navegador consegue abrir, e o editor pergunta o que
a imagem mostra para preencher a descrição. Quando estiver pronto, ligue
"Publicado" e rode `make publicar`.

Pela linha de comando:

```bash
make novo-texto TITULO="Como eu decido quando parar de refatorar"
# opcional: CATEGORIA="Carreira"  DESCRICAO="Uma linha."  DATA=AAAA-MM-DD
```

Isso cria a pasta com a data de hoje, o slug já sem acento e o frontmatter
preenchido — é só escrever. Depois, `make dev` para ver e `make publicar` para
mandar para o ar.

Por baixo, cada texto é uma pasta em `content/blog/`, no formato
`AAAA-MM-DD-slug/`, com um `index.md` dentro. Imagens do texto ficam na mesma pasta e são referenciadas por
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
| `publicado` | **sim, para ir ao ar** | sem `publicado: true` o texto é rascunho |

### Rascunho é o padrão

Um texto só aparece no site — home, `/textos/`, sitemap e RSS — quando o
frontmatter tiver:

```yaml
publicado: true
```

`make novo-texto` cria a linha já comentada; descomente quando estiver pronto.
Enquanto isso o arquivo fica versionado no git normalmente, dá para escrever de
qualquer máquina, e nenhum commit distraído publica nada. O padrão erra sempre
para o lado seguro.

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
