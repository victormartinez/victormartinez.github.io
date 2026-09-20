#!/usr/bin/env node
/**
 * Cria o esqueleto de uma anotação de estudo em content/notas/.
 *
 *   node scripts/nova-nota.mjs kubernetes --titulo "Kubernetes"
 *   node scripts/nova-nota.mjs kubernetes/networking --titulo "Networking no Kubernetes"
 *
 * O caminho é a hierarquia: cada segmento é uma pasta, e a árvore de pastas vira
 * a árvore de URLs sob /notas-de-estudo/ (ver gatsby-node.js). Pasta de pai que
 * ainda não existe nasce aqui com um index.md provisório — nota órfã não entra
 * no site.
 *
 * Diferente de novo-texto.mjs, a nota JÁ NASCE NO AR: o que diz o estágio dela é
 * o selo de maturidade, não um rascunho que nunca sai do lugar.
 */
import { mkdir, writeFile, access } from "node:fs/promises"
import { join, relative } from "node:path"

const MATURIDADES = ["em-aberto", "revisada"]
const MATURIDADE_PADRAO = "em-aberto"
const RAIZ = new URL("..", import.meta.url).pathname
const BASE = join(RAIZ, "content", "notas")

const args = process.argv.slice(2)
const opcao = nome => {
  const i = args.indexOf(`--${nome}`)
  return i === -1 ? null : (args[i + 1] ?? null)
}
const posicionais = args.filter(
  (a, i) => !a.startsWith("--") && !args[i - 1]?.startsWith("--"),
)

const caminhoBruto = posicionais[0]

if (!caminhoBruto) {
  erro(`
Falta o caminho da nota.

  make nova-nota CAMINHO="kubernetes" TITULO="Kubernetes"
  make nova-nota CAMINHO="kubernetes/networking" TITULO="Networking no Kubernetes"

Opções: TITULO="<nome na página>"  DESCRICAO="<uma linha>"  MATURIDADE=em-aberto|revisada
`)
}

const segmentos = caminhoBruto.split("/").map(slugificar).filter(Boolean)

if (!segmentos.length) {
  erro(`Não consegui gerar um caminho a partir de "${caminhoBruto}".`)
}

const maturidade = opcao("maturidade") ?? MATURIDADE_PADRAO
if (!MATURIDADES.includes(maturidade)) {
  erro(`Maturidade inválida: "${maturidade}". Use: ${MATURIDADES.join(", ")}.`)
}

const titulo = opcao("titulo") ?? titulizar(segmentos.at(-1))
const descricao = opcao("descricao") ?? ""
const slug = segmentos.join("/")
const pasta = join(BASE, ...segmentos)
const arquivo = join(pasta, "index.md")

if (await existe(arquivo)) {
  erro(
    `Já existe: ${relative(RAIZ, arquivo)}\nEscolha outro caminho ou edite esse arquivo.`,
  )
}

// Ancestrais primeiro: um index.md faltando no meio deixaria a nota fora do site.
const criados = []
for (let i = 1; i < segmentos.length; i++) {
  const pastaPai = join(BASE, ...segmentos.slice(0, i))
  const arquivoPai = join(pastaPai, "index.md")
  if (await existe(arquivoPai)) continue
  await mkdir(pastaPai, { recursive: true })
  await writeFile(
    arquivoPai,
    frontmatter({
      titulo: titulizar(segmentos[i - 1]),
      descricao: "",
      maturidade: MATURIDADE_PADRAO,
    }),
    "utf8",
  )
  criados.push({ arquivo: arquivoPai, slug: segmentos.slice(0, i).join("/") })
}

await mkdir(pasta, { recursive: true })
await writeFile(arquivo, frontmatter({ titulo, descricao, maturidade }), "utf8")

console.log(`
Nota criada.

  arquivo   ${relative(RAIZ, arquivo)}
  vira      /notas-de-estudo/${slug}/
  estágio   ${maturidade}
`)

if (criados.length) {
  console.log(
    "Criei também os índices dos temas acima, que ainda não existiam:\n",
  )
  for (const c of criados) {
    console.log(
      `  ${relative(RAIZ, c.arquivo)}  ->  /notas-de-estudo/${c.slug}/`,
    )
  }
  console.log("\nAjuste o title e a description deles quando puder.\n")
}

console.log(`A nota JÁ ESTÁ NO AR no próximo deploy — o selo "${maturidade}" é que
avisa quem lê em que pé ela está. Para segurar de vez, ponha "publicado: false"
no frontmatter.

Para sub-páginas deste tema:
  make nova-nota CAMINHO="${slug}/<sub-tema>" TITULO="..."

Para ver no navegador:  make dev
`)

// ---------------------------------------------------------------- utilidades

function hoje() {
  const d = new Date() // data local: o fuso do autor, não UTC
  const p = n => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

function slugificar(texto) {
  return texto
    .normalize("NFD")
    .replace(/\p{M}/gu, "") // tira acentos
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "")
}

/** `networking-no-kubernetes` -> `Networking no kubernetes` (chute do título). */
function titulizar(slug) {
  const s = slug.replace(/-/g, " ")
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function frontmatter({ titulo, descricao, maturidade }) {
  const aspas = s => `"${String(s).replace(/"/g, '\\"')}"`
  return `---
title: ${aspas(titulo)}
description: ${aspas(descricao)}
maturidade: ${maturidade}   # em-aberto | revisada
atualizado: ${hoje()}
# ordem: 10        <- opcional: ordena entre as irmãs (sem ela, alfabética)
# publicado: false <- descomente para tirar esta nota do ar
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

function erro(mensagem) {
  console.error(mensagem)
  process.exit(1)
}
