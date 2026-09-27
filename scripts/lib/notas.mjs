/**
 * O formato de uma anotação de estudo em content/notas/, num lugar só.
 *
 * Usado por scripts/nova-nota.mjs (linha de comando) e pelo editor
 * (scripts/editor-notas/): os dois criam e reescrevem o mesmo index.md, então
 * slug, frontmatter e a regra dos ancestrais não podem divergir.
 */
import { mkdir, writeFile } from "node:fs/promises"
import { join } from "node:path"
import {
  RAIZ,
  SEGMENTO,
  existe,
  hoje,
  lerFrontmatter,
  aspas,
  montarArquivo,
  titulizar,
} from "./markdown.mjs"

export { RAIZ, existe, hoje, slugificar, titulizar } from "./markdown.mjs"

export const MATURIDADES = ["em-aberto", "revisada"]
export const MATURIDADE_PADRAO = "em-aberto"
export const BASE = join(RAIZ, "content", "notas")

/**
 * `kubernetes/networking` é um slug de nota válido? É a trava contra caminho
 * forjado (`../`, barra invertida, maiúscula) antes de qualquer acesso a disco.
 */
export function slugValido(slug) {
  return (
    typeof slug === "string" &&
    slug.length > 0 &&
    slug.split("/").every(s => SEGMENTO.test(s))
  )
}

export const pastaDaNota = slug => join(BASE, ...slug.split("/"))
export const arquivoDaNota = slug => join(pastaDaNota(slug), "index.md")

// ---------------------------------------------------------------- frontmatter

/**
 * Lê o index.md de uma nota: `{ campos, extras, corpo }`. Chave que não é de
 * nota vai para `extras` como linha crua e volta intacta no `serializar`; os
 * dois comentários de ajuda (`ordem`, `publicado`) são regerados.
 */
export function interpretar(texto) {
  const campos = {
    title: "",
    description: "",
    maturidade: MATURIDADE_PADRAO,
    atualizado: null,
    ordem: null,
    publicado: true,
  }
  const extras = []
  const { pares, corpo } = lerFrontmatter(texto)
  for (const { chave, valor, linhas } of pares) {
    switch (chave) {
      case "title":
      case "description":
        campos[chave] = valor
        break
      case "maturidade":
        campos.maturidade = MATURIDADES.includes(valor)
          ? valor
          : MATURIDADE_PADRAO
        break
      case "atualizado":
        campos.atualizado = valor || null
        break
      case "ordem": {
        const n = Number.parseInt(valor, 10)
        campos.ordem = Number.isFinite(n) ? n : null
        break
      }
      case "publicado":
        campos.publicado = valor !== "false"
        break
      default:
        extras.push(...linhas)
    }
  }
  return { campos, extras, corpo }
}

/** Monta o index.md inteiro a partir dos campos e do corpo. */
export function serializar({
  titulo,
  descricao = "",
  maturidade = MATURIDADE_PADRAO,
  atualizado = hoje(),
  ordem = null,
  publicado = true,
  extras = [],
  corpo = "",
}) {
  return montarArquivo(
    [
      `title: ${aspas(titulo)}`,
      `description: ${aspas(descricao)}`,
      `maturidade: ${maturidade}   # em-aberto | revisada`,
      `atualizado: ${atualizado}`,
      Number.isInteger(ordem)
        ? `ordem: ${ordem}`
        : "# ordem: 10        <- opcional: ordena entre as irmãs (sem ela, alfabética)",
      publicado === false
        ? "publicado: false"
        : "# publicado: false <- descomente para tirar esta nota do ar",
      ...extras,
    ],
    corpo,
  )
}

// ---------------------------------------------------------------- criação

/**
 * Cria a nota `slug` e, antes dela, o index.md de todo ancestral que faltar —
 * um index.md faltando no meio deixaria a nota fora do site (gatsby-node.js).
 * Devolve os slugs dos ancestrais criados. Lança `NotaJaExiste` se a nota já
 * estiver lá.
 */
export async function criarNota(
  slug,
  { titulo, descricao = "", maturidade = MATURIDADE_PADRAO } = {},
) {
  const segmentos = slug.split("/")
  if (await existe(arquivoDaNota(slug))) throw new NotaJaExiste(slug)

  const criados = []
  for (let i = 1; i < segmentos.length; i++) {
    const slugPai = segmentos.slice(0, i).join("/")
    if (await existe(arquivoDaNota(slugPai))) continue
    await mkdir(pastaDaNota(slugPai), { recursive: true })
    await writeFile(
      arquivoDaNota(slugPai),
      serializar({ titulo: titulizar(segmentos[i - 1]) }),
      "utf8",
    )
    criados.push(slugPai)
  }

  await mkdir(pastaDaNota(slug), { recursive: true })
  await writeFile(
    arquivoDaNota(slug),
    serializar({
      titulo: titulo || titulizar(segmentos.at(-1)),
      descricao,
      maturidade,
    }),
    "utf8",
  )
  return criados
}

export class NotaJaExiste extends Error {
  constructor(slug) {
    super(`Já existe uma nota em ${slug}`)
    this.slug = slug
  }
}
