/**
 * Peças comuns aos dois tipos de conteúdo em Markdown do site — textos
 * (content/blog/) e anotações (content/notas/): slug, data, frontmatter.
 *
 * O frontmatter do site é plano (chave: valor, uma por linha), então o parser
 * também é: sem YAML completo e sem dependência. Cada coleção decide o que faz
 * com as chaves que conhece (ver textos.mjs e notas.mjs); as que ela não
 * conhece voltam intactas para o arquivo.
 */
import { access } from "node:fs/promises"

export const RAIZ = new URL("../..", import.meta.url).pathname

export function hoje() {
  const d = new Date() // data local: o fuso do autor, não UTC
  const p = n => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

export function slugificar(texto) {
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
export function titulizar(slug) {
  const s = slug.replace(/-/g, " ")
  return s.charAt(0).toUpperCase() + s.slice(1)
}

/** Um segmento de caminho válido: o que `slugificar` produz. */
export const SEGMENTO = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export async function existe(caminho) {
  try {
    await access(caminho)
    return true
  } catch {
    return false
  }
}

/**
 * Separa o frontmatter do corpo: `{ pares, corpo }`, onde cada par é
 * `{ chave, valor, linhas }` — `linhas` são as linhas cruas (a da chave e as
 * indentadas logo abaixo dela), para devolver ao arquivo o que a coleção não
 * conhece. Comentários soltos são descartados; cada coleção regera os seus.
 */
export function lerFrontmatter(texto) {
  const normalizado = texto.replace(/\r\n/g, "\n")
  const m = normalizado.match(/^---\n([\s\S]*?)\n---[ \t]*(?:\n|$)/)
  if (!m) return { pares: [], corpo: normalizado }

  const pares = []
  for (const linha of m[1].split("\n")) {
    const par = linha.match(/^([A-Za-z_][\w-]*):(.*)$/)
    if (par) {
      pares.push({ chave: par[1], valor: valorYaml(par[2]), linhas: [linha] })
    } else if (/^\s+\S/.test(linha) && pares.length) {
      pares.at(-1).linhas.push(linha) // continuação da chave de cima
    }
  }
  const corpo = normalizado.slice(m[0].length).replace(/^\n/, "")
  return { pares, corpo }
}

/** Valor escalar de uma linha: aspas duplas, simples ou cru com `# comentário`. */
function valorYaml(bruto) {
  const s = bruto.trim()
  if (s.startsWith('"')) {
    let out = ""
    for (let i = 1; i < s.length; i++) {
      const c = s[i]
      if (c === "\\" && i + 1 < s.length) {
        const prox = s[++i]
        out += prox === "n" ? "\n" : prox === "t" ? "\t" : prox
      } else if (c === '"') break
      else out += c
    }
    return out
  }
  if (s.startsWith("'")) {
    let out = ""
    for (let i = 1; i < s.length; i++) {
      if (s[i] !== "'") out += s[i]
      else if (s[i + 1] === "'")
        out += s[i++] // '' é a aspa escapada
      else break
    }
    return out
  }
  return s.replace(/\s+#.*$/, "").trim()
}

export const aspas = s =>
  `"${String(s ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\s*\n\s*/g, " ")}"`

/** Aspas só quando o YAML exigiria — `Engenharia` fica cru, `A: B` não. */
export const talvezAspas = s =>
  /^[\p{L}\p{N}][\p{L}\p{N} ._/-]*$/u.test(String(s ?? ""))
    ? String(s)
    : aspas(s)

/** Junta as linhas do frontmatter e o corpo no arquivo final. */
export function montarArquivo(linhas, corpo = "") {
  const texto = corpo.replace(/\r\n/g, "\n").replace(/\s+$/, "")
  return (
    ["---", ...linhas, "---", ""].join("\n") +
    "\n" +
    (texto ? texto + "\n" : "")
  )
}
