/**
 * O formato de um texto do blog em content/blog/, num lugar só.
 *
 * Usado por scripts/novo-texto.mjs e pelo editor (scripts/editor-notas/).
 * Cada texto é uma pasta `AAAA-MM-DD-slug/` com um index.md; o Gatsby tira o
 * prefixo de data e publica em /textos/<slug>/ (ver slugDaPasta em
 * gatsby-node.js). Texto nasce rascunho: só vai ao ar com `publicado: true`.
 */
import { mkdir, writeFile, readdir } from "node:fs/promises"
import { join } from "node:path"
import {
  RAIZ,
  SEGMENTO,
  aspas,
  existe,
  hoje,
  lerFrontmatter,
  montarArquivo,
  talvezAspas,
} from "./markdown.mjs"

export const CATEGORIA_PADRAO = "Engenharia"
export const BASE_TEXTOS = join(RAIZ, "content", "blog")

const PASTA = /^(\d{4}-\d{2}-\d{2})-([a-z0-9]+(?:-[a-z0-9]+)*)$/

/** `2026-08-24-o-que-a-ia-acelerou` é uma pasta de texto válida? */
export const pastaValida = pasta =>
  typeof pasta === "string" && PASTA.test(pasta)

/** `2026-08-24-o-que-a-ia-acelerou` -> `o-que-a-ia-acelerou` (a URL). */
export const slugDaPasta = pasta => pasta.replace(/^\d{4}-\d{2}-\d{2}-/, "")

export const pastaDoTexto = pasta => join(BASE_TEXTOS, pasta)
export const arquivoDoTexto = pasta => join(BASE_TEXTOS, pasta, "index.md")

/**
 * Lê o index.md de um texto: `{ campos, extras, corpo }`. Chave que não é das
 * quatro de sempre (a `nota`, por exemplo) vai para `extras` e volta intacta.
 */
export function interpretarTexto(texto) {
  const campos = {
    title: "",
    date: null,
    description: "",
    category: "",
    publicado: false,
  }
  const extras = []
  const { pares, corpo } = lerFrontmatter(texto)
  for (const { chave, valor, linhas } of pares) {
    switch (chave) {
      case "title":
      case "description":
      case "category":
        campos[chave] = valor
        break
      case "date":
        campos.date = /^\d{4}-\d{2}-\d{2}/.test(valor)
          ? valor.slice(0, 10)
          : null
        break
      case "publicado":
        campos.publicado = valor === "true"
        break
      default:
        extras.push(...linhas)
    }
  }
  return { campos, extras, corpo }
}

/** Monta o index.md inteiro — o mesmo formato que `make novo-texto` sempre gerou. */
export function serializarTexto({
  titulo,
  data = hoje(),
  descricao = "",
  categoria = CATEGORIA_PADRAO,
  publicado = false,
  extras = [],
  corpo = "",
}) {
  return montarArquivo(
    [
      `title: ${aspas(titulo)}`,
      `date: ${data}`,
      `description: ${aspas(descricao)}`,
      `category: ${talvezAspas(categoria || CATEGORIA_PADRAO)}`,
      ...extras,
      publicado
        ? "publicado: true"
        : "# publicado: true   <- descomente quando o texto estiver pronto para ir ao ar",
    ],
    corpo,
  )
}

/** Todas as pastas de texto em content/blog, com o frontmatter já lido. */
export async function pastasDeTextos() {
  try {
    const entradas = await readdir(BASE_TEXTOS, { withFileTypes: true })
    return entradas
      .filter(e => e.isDirectory() && pastaValida(e.name))
      .map(e => e.name)
  } catch {
    return [] // content/blog ainda não existe
  }
}

/**
 * Cria a pasta e o index.md de um texto novo e devolve o nome da pasta.
 * Recusa se já houver um texto com o mesmo slug, mesmo com outra data: os dois
 * disputariam a mesma URL /textos/<slug>/.
 */
export async function criarTexto(
  slug,
  { titulo, data = hoje(), descricao = "", categoria = CATEGORIA_PADRAO } = {},
) {
  if (!SEGMENTO.test(slug)) throw new Error(`Slug inválido: ${slug}`)
  const existente = (await pastasDeTextos()).find(p => slugDaPasta(p) === slug)
  if (existente) throw new TextoJaExiste(existente)

  const pasta = `${data}-${slug}`
  if (await existe(pastaDoTexto(pasta))) throw new TextoJaExiste(pasta)
  await mkdir(pastaDoTexto(pasta), { recursive: true })
  await writeFile(
    arquivoDoTexto(pasta),
    serializarTexto({ titulo, data, descricao, categoria }),
    "utf8",
  )
  return pasta
}

export class TextoJaExiste extends Error {
  constructor(pasta) {
    super(`Já existe um texto em content/blog/${pasta}`)
    this.pasta = pasta
  }
}
