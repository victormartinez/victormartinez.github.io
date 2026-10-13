/**
 * O formato de um post do LinkedIn em content/linkedin/, num lugar só.
 *
 * Usado só pelo editor (scripts/editor-notas/). Cada post é uma pasta
 * `AAAA-MM-DD-slug/` com um index.md, como os textos do blog — mas a pasta não
 * entra no git (.gitignore) nem no site: é área de trabalho até o post ir
 * para o LinkedIn, e depois pode ser apagada pelo próprio editor.
 *
 * O corpo é texto puro, não Markdown: o LinkedIn não interpreta marcação.
 * O `title` é só um rótulo para achar o post na lista; `date` é a data em que
 * ele deve ser (ou foi) postado.
 */
import { mkdir, writeFile, readdir, rm } from "node:fs/promises"
import { join } from "node:path"
import {
  RAIZ,
  SEGMENTO,
  aspas,
  existe,
  hoje,
  lerFrontmatter,
  montarArquivo,
} from "./markdown.mjs"
import { pastaValida } from "./textos.mjs"

export const BASE_LINKEDIN = join(RAIZ, "content", "linkedin")

export { pastaValida as pastaDePostValida }
export const pastaDoPost = pasta => join(BASE_LINKEDIN, pasta)
export const arquivoDoPost = pasta => join(BASE_LINKEDIN, pasta, "index.md")

/** Lê o index.md de um post: `{ campos, extras, corpo }`. */
export function interpretarPost(texto) {
  const campos = { title: "", date: null }
  const extras = []
  const { pares, corpo } = lerFrontmatter(texto)
  for (const { chave, valor, linhas } of pares) {
    switch (chave) {
      case "title":
        campos.title = valor
        break
      case "date":
        campos.date = /^\d{4}-\d{2}-\d{2}/.test(valor)
          ? valor.slice(0, 10)
          : null
        break
      default:
        extras.push(...linhas)
    }
  }
  return { campos, extras, corpo }
}

export function serializarPost({
  titulo,
  data = hoje(),
  extras = [],
  corpo = "",
}) {
  return montarArquivo(
    [`title: ${aspas(titulo)}`, `date: ${data}`, ...extras],
    corpo,
  )
}

/** Todas as pastas de post em content/linkedin. */
export async function pastasDePosts() {
  try {
    const entradas = await readdir(BASE_LINKEDIN, { withFileTypes: true })
    return entradas
      .filter(e => e.isDirectory() && pastaValida(e.name))
      .map(e => e.name)
  } catch {
    return [] // content/linkedin ainda não existe
  }
}

/** Cria a pasta e o index.md de um post novo e devolve o nome da pasta. */
export async function criarPost(slug, { titulo, data = hoje() } = {}) {
  if (!SEGMENTO.test(slug)) throw new Error(`Slug inválido: ${slug}`)
  const pasta = `${data}-${slug}`
  if (await existe(pastaDoPost(pasta))) throw new PostJaExiste(pasta)
  await mkdir(pastaDoPost(pasta), { recursive: true })
  await writeFile(
    arquivoDoPost(pasta),
    serializarPost({ titulo, data }),
    "utf8",
  )
  return pasta
}

/** Remove a pasta do post com tudo o que houver dentro. */
export async function apagarPost(pasta) {
  if (!pastaValida(pasta)) throw new Error(`Pasta inválida: ${pasta}`)
  await rm(pastaDoPost(pasta), { recursive: true, force: true })
}

export class PostJaExiste extends Error {
  constructor(pasta) {
    super(`Já existe um post em content/linkedin/${pasta}`)
    this.pasta = pasta
  }
}
