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
import { relative } from "node:path"
import { RAIZ, hoje, slugificar } from "./lib/markdown.mjs"
import {
  CATEGORIA_PADRAO,
  TextoJaExiste,
  arquivoDoTexto,
  criarTexto,
  pastaDoTexto,
} from "./lib/textos.mjs"

const args = process.argv.slice(2)
const opcao = nome => {
  const i = args.indexOf(`--${nome}`)
  return i === -1 ? null : (args[i + 1] ?? null)
}
const titulo = args.filter(
  (a, i) => !a.startsWith("--") && !args[i - 1]?.startsWith("--"),
)[0]

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

let pasta
try {
  pasta = await criarTexto(slug, { titulo, data, descricao, categoria })
} catch (e) {
  if (!(e instanceof TextoJaExiste)) throw e
  console.error(
    `Já existe: ${relative(RAIZ, pastaDoTexto(e.pasta))}\nEscolha outro título ou apague a pasta.`,
  )
  process.exit(1)
}
const arquivo = arquivoDoTexto(pasta)

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
