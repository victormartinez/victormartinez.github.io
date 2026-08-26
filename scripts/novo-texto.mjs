#!/usr/bin/env node
/**
 * Cria o esqueleto de um texto novo em content/blog/.
 *
 *   node scripts/novo-texto.mjs "Título do texto"
 *   node scripts/novo-texto.mjs "Título" --categoria Carreira --descricao "Uma linha."
 *
 * A pasta nasce como AAAA-MM-DD-slug; o Gatsby tira o prefixo de data e publica
 * em /textos/<slug>/ (ver slugDaPasta em gatsby-node.js).
 */
import { mkdir, writeFile, access } from "node:fs/promises"
import { join, relative } from "node:path"

const CATEGORIA_PADRAO = "Engenharia"
const RAIZ = new URL("..", import.meta.url).pathname

const args = process.argv.slice(2)
const opcao = nome => {
  const i = args.indexOf(`--${nome}`)
  return i === -1 ? null : args[i + 1] ?? null
}
const titulo = args.filter((a, i) => !a.startsWith("--") && !args[i - 1]?.startsWith("--"))[0]

if (!titulo) {
  console.error(`
Falta o título.

  make novo-texto TITULO="Como eu decido quando parar de refatorar"

Opções: --categoria <nome>  --descricao "<uma linha>"  --data AAAA-MM-DD
`)
  process.exit(1)
}

const categoria = opcao("categoria") ?? CATEGORIA_PADRAO
const descricao = opcao("descricao") ?? ""
const data = opcao("data") ?? hoje()

if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) {
  console.error(`Data inválida: "${data}". Use AAAA-MM-DD.`)
  process.exit(1)
}

const slug = slugificar(titulo)
if (!slug) {
  console.error(`Não consegui gerar um slug a partir de "${titulo}".`)
  process.exit(1)
}

const pasta = join(RAIZ, "content", "blog", `${data}-${slug}`)
const arquivo = join(pasta, "index.md")

if (await existe(pasta)) {
  console.error(`Já existe: ${relative(RAIZ, pasta)}\nEscolha outro título ou apague a pasta.`)
  process.exit(1)
}

await mkdir(pasta, { recursive: true })
await writeFile(arquivo, frontmatter({ titulo, data, descricao, categoria }), "utf8")

console.log(`
Texto criado.

  arquivo   ${relative(RAIZ, arquivo)}
  vira      /textos/${slug}/
  categoria ${categoria}
`)
if (!descricao) {
  console.log(`Preencha a "description" antes de publicar: ela é o resumo na
listagem, na busca e no compartilhamento.\n`)
}
console.log(`O texto nasce como RASCUNHO: fica fora do site, do sitemap e do RSS
até você descomentar "publicado: true" no frontmatter.

Para ver no navegador enquanto escreve:  make dev\n`)

// ---------------------------------------------------------------- utilidades

function hoje() {
  const d = new Date() // data local: o fuso do autor, não UTC
  const p = n => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

function slugificar(texto) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // tira acentos
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "")
}

function frontmatter({ titulo, data, descricao, categoria }) {
  const aspas = s => `"${String(s).replace(/"/g, '\\"')}"`
  return `---
title: ${aspas(titulo)}
date: ${data}
description: ${aspas(descricao)}
category: ${categoria}
# publicado: true   <- descomente quando o texto estiver pronto para ir ao ar
---

`
}

async function existe(caminho) {
  try {
    await access(caminho)
    return true
  } catch {
    return false
  }
}
