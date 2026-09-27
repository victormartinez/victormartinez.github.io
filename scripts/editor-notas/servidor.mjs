#!/usr/bin/env node
/**
 * Editor local do conteúdo do site:  make editor  ->  http://localhost:8100
 *
 * Um servidor pequeno, sem dependência, que serve a página do editor
 * (./pagina) e uma API que lê e grava direto nas duas coleções em Markdown:
 * as notas de estudo (content/notas/) e os textos do blog (content/blog/). O
 * arquivo em disco continua sendo a fonte da verdade: o editor é só um jeito
 * melhor de escrever nele. Salvar aqui NÃO publica — quem manda para o ar é o
 * `make publicar`, como sempre.
 *
 * Só escuta em 127.0.0.1 e recusa Host/Origin de fora: uma página qualquer
 * aberta no navegador não consegue gravar no seu conteúdo.
 */
import http from "node:http"
import { createHash } from "node:crypto"
import { createRequire } from "node:module"
import { spawn } from "node:child_process"
import { readFile, writeFile, readdir } from "node:fs/promises"
import { join, extname, relative } from "node:path"

import { RAIZ, existe, hoje, slugificar } from "../lib/markdown.mjs"
import {
  BASE,
  MATURIDADES,
  NotaJaExiste,
  arquivoDaNota,
  criarNota,
  interpretar,
  pastaDaNota,
  serializar,
  slugValido,
} from "../lib/notas.mjs"
import {
  BASE_TEXTOS,
  CATEGORIA_PADRAO,
  TextoJaExiste,
  arquivoDoTexto,
  criarTexto,
  interpretarTexto,
  pastaDoTexto,
  pastaValida,
  pastasDeTextos,
  serializarTexto,
  slugDaPasta,
} from "../lib/textos.mjs"

const PORTA = Number(process.env.PORTA) || 8100
const HOST = "127.0.0.1"
const PAGINA = new URL("./pagina/", import.meta.url).pathname
const LIMITE_JSON = 5 * 1024 * 1024
const LIMITE_IMAGEM = 15 * 1024 * 1024

const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
}

const EXTENSAO_DA_IMAGEM = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/gif": ".gif",
  "image/webp": ".webp",
  "image/svg+xml": ".svg",
}

/** Arquivos fixos: a página do editor, o CSS do site (para a prévia) e fontes. */
const ESTATICOS = {
  "/": join(PAGINA, "index.html"),
  "/editor.css": join(PAGINA, "editor.css"),
  "/editor.js": join(PAGINA, "editor.js"),
  "/site.css": join(RAIZ, "src", "styles", "style.css"),
  "/favicon.svg": join(RAIZ, "static", "favicon.svg"),
}

// ---------------------------------------------------------------- coleções

class ErroHttp extends Error {
  constructor(status, mensagem) {
    super(mensagem)
    this.status = status
  }
}

/**
 * O que muda entre notas e textos fica aqui; o resto do servidor (ler, salvar
 * com checagem de conflito, imagens, prévia) é o mesmo para os dois.
 *
 * - `id`: o slug com barras para a nota (`kubernetes/networking`), o nome da
 *   pasta para o texto (`2026-08-24-o-que-a-ia-acelerou`).
 * - `montar(campos, atual, agora)`: o arquivo novo. Com `agora = false`, sem
 *   carimbar data — é assim que o servidor descobre se algo mudou de fato.
 */
const COLECOES = {
  notas: {
    rotulo: "nota",
    essa: "Essa nota",
    ao: "à nota",
    raiz: BASE,
    validar: slugValido,
    pasta: pastaDaNota,
    arquivo: arquivoDaNota,
    interpretar,
    montar(campos, atual, agora) {
      return serializar({
        titulo: String(campos.title ?? ""),
        descricao: String(campos.description ?? ""),
        maturidade: MATURIDADES.includes(campos.maturidade)
          ? campos.maturidade
          : atual.campos.maturidade,
        // "atualizada em": a data só anda quando o conteúdo muda.
        atualizado: agora ? hoje() : (atual.campos.atualizado ?? hoje()),
        ordem: Number.isInteger(campos.ordem) ? campos.ordem : null,
        publicado: campos.publicado !== false,
        extras: atual.extras,
        corpo: String(campos.corpo ?? ""),
      })
    },
    async listar() {
      const notas = []
      async function varrer(pasta, segmentos) {
        let entradas
        try {
          entradas = await readdir(pasta, { withFileTypes: true })
        } catch {
          return // content/notas ainda não existe: lista vazia
        }
        if (segmentos.length && entradas.some(e => e.name === "index.md")) {
          const { campos } = interpretar(
            await readFile(join(pasta, "index.md"), "utf8"),
          )
          notas.push({
            id: segmentos.join("/"),
            titulo: campos.title || segmentos.at(-1),
            maturidade: campos.maturidade,
            publicado: campos.publicado,
          })
        }
        for (const e of entradas) {
          if (!e.isDirectory() || /^[._]/.test(e.name)) continue
          await varrer(join(pasta, e.name), [...segmentos, e.name])
        }
      }
      await varrer(BASE, [])

      // Nota com pasta de ancestral sem index.md não entra no site
      // (gatsby-node.js): o editor mostra, mas avisa.
      const ids = new Set(notas.map(n => n.id))
      for (const n of notas) {
        const partes = n.id.split("/")
        n.orfa = partes
          .slice(1)
          .some((_, i) => !ids.has(partes.slice(0, i + 1).join("/")))
      }
      return notas.sort((a, b) => a.id.localeCompare(b.id))
    },
    async criar({ pai = "", titulo, slug }) {
      if (pai) {
        if (!slugValido(pai)) throw new ErroHttp(400, "Nota-mãe inválida.")
        if (!(await existe(arquivoDaNota(pai)))) {
          throw new ErroHttp(
            404,
            `A nota-mãe ${pai} não existe em content/notas.`,
          )
        }
      }
      const id = pai ? `${pai}/${slug}` : slug
      try {
        await criarNota(id, { titulo })
      } catch (e) {
        if (e instanceof NotaJaExiste) {
          throw new ErroHttp(
            409,
            `Já existe uma nota em /notas-de-estudo/${id}/.`,
          )
        }
        throw e
      }
      return id
    },
  },

  textos: {
    rotulo: "texto",
    essa: "Esse texto",
    ao: "ao texto",
    raiz: BASE_TEXTOS,
    validar: pastaValida,
    pasta: pastaDoTexto,
    arquivo: arquivoDoTexto,
    interpretar: interpretarTexto,
    montar(campos, atual) {
      const data = /^\d{4}-\d{2}-\d{2}$/.test(campos.date)
        ? campos.date
        : atual.campos.date || hoje()
      return serializarTexto({
        titulo: String(campos.title ?? ""),
        data,
        descricao: String(campos.description ?? ""),
        categoria: String(campos.category ?? "").trim() || CATEGORIA_PADRAO,
        publicado: campos.publicado === true,
        extras: atual.extras,
        corpo: String(campos.corpo ?? ""),
      })
    },
    async listar() {
      const textos = []
      for (const pasta of await pastasDeTextos()) {
        let texto
        try {
          texto = await readFile(arquivoDoTexto(pasta), "utf8")
        } catch {
          continue // pasta sem index.md
        }
        const { campos } = interpretarTexto(texto)
        textos.push({
          id: pasta,
          titulo: campos.title || slugDaPasta(pasta),
          data: campos.date || pasta.slice(0, 10),
          categoria: campos.category,
          publicado: campos.publicado,
        })
      }
      // Mais recente primeiro, como em /textos/.
      return textos.sort(
        (a, b) => b.data.localeCompare(a.data) || a.id.localeCompare(b.id),
      )
    },
    async criar({ titulo, slug, categoria }) {
      try {
        return await criarTexto(slug, {
          titulo,
          categoria: String(categoria ?? "").trim() || CATEGORIA_PADRAO,
        })
      } catch (e) {
        if (e instanceof TextoJaExiste) {
          throw new ErroHttp(
            409,
            `Já existe um texto em /textos/${slugDaPasta(e.pasta)}/ — escolha outro endereço.`,
          )
        }
        throw e
      }
    },
  },
}

function colecaoDe(nome) {
  const c = COLECOES[nome]
  if (!c) throw new ErroHttp(400, "Coleção desconhecida.")
  return c
}

// ---------------------------------------------------------------- ler e salvar

const versaoDe = texto => createHash("sha1").update(texto).digest("hex")

async function lerItem(colecao, id) {
  const texto = await readFile(colecao.arquivo(id), "utf8")
  const { campos, corpo } = colecao.interpretar(texto)
  return { id, campos, corpo, versao: versaoDe(texto) }
}

/**
 * Grava se `versao` ainda for a do disco. Se outro programa mexeu no arquivo
 * desde que o editor o leu, devolve `{ conflito }` com o que está lá agora, em
 * vez de passar por cima.
 */
async function salvarItem(colecao, id, { campos = {}, corpo = "", versao }) {
  const atualTexto = await readFile(colecao.arquivo(id), "utf8")
  if (versao !== versaoDe(atualTexto)) {
    return { conflito: await lerItem(colecao, id) }
  }

  const atual = colecao.interpretar(atualTexto)
  const dados = { ...campos, corpo }
  // Nada mudou de fato: não regrava (e não empurra datas).
  if (colecao.montar(dados, atual, false) === atualTexto) return { versao }

  const novo = colecao.montar(dados, atual, true)
  await writeFile(colecao.arquivo(id), novo, "utf8")
  return { versao: versaoDe(novo) }
}

async function salvarImagem(pasta, tipo, nomePedido, dados) {
  const ext = EXTENSAO_DA_IMAGEM[tipo]
  const agora = new Date()
  const p = n => String(n).padStart(2, "0")
  const base =
    slugificar((nomePedido || "").replace(/\.[^.]+$/, "")) ||
    `imagem-${agora.getFullYear()}${p(agora.getMonth() + 1)}${p(agora.getDate())}-` +
      `${p(agora.getHours())}${p(agora.getMinutes())}${p(agora.getSeconds())}`

  let nome = base + ext
  for (let i = 2; await existe(join(pasta, nome)); i++) {
    nome = `${base}-${i}${ext}`
  }
  await writeFile(join(pasta, nome), dados)
  return nome
}

// ---------------------------------------------------------------- prévia

/**
 * Markdown -> HTML com as mesmas peças que o gatsby-transformer-remark usa
 * (remark-parse + remark-gfm) e o Prism para o realce, tudo já presente em
 * node_modules. Se faltar alguma, a prévia avisa e o editor segue funcionando.
 */
let renderizador
function carregarRenderizador() {
  if (renderizador !== undefined) return renderizador
  try {
    const requerer = createRequire(join(RAIZ, "package.json"))
    const unified = requerer("unified")
    const parse = requerer("remark-parse")
    const gfm = requerer("remark-gfm")
    const paraHast = requerer("mdast-util-to-hast")
    const paraHtml = requerer("hast-util-to-html")
    const Prism = requerer("prismjs")
    const carregarLinguagens = requerer("prismjs/components/index.js")
    carregarLinguagens.silent = true
    const processador = unified().use(parse).use(gfm)
    renderizador = {
      processador,
      paraHast,
      paraHtml,
      Prism,
      carregarLinguagens,
    }
  } catch (e) {
    console.warn(`→ prévia desligada: ${e.message}`)
    renderizador = null
  }
  return renderizador
}

/** `prefixoMidia`: onde as imagens relativas (./figura.png) são servidas. */
function renderizar(prefixoMidia, markdown) {
  const r = carregarRenderizador()
  if (!r) return null
  const mdast = r.processador.runSync(r.processador.parse(markdown))
  const hast = r.paraHast(mdast, { allowDangerousHtml: true })

  const visitar = (no, pai, indice) => {
    if (no.type === "element") {
      if (no.tagName === "img" && no.properties?.src) {
        const src = String(no.properties.src)
        if (!/^([a-z]+:|\/|#)/i.test(src)) {
          no.properties.src = `${prefixoMidia}/${src.replace(/^\.\//, "")}`
        }
      }
      // Código com linguagem: o mesmo HTML do gatsby-remark-prismjs.
      if (no.tagName === "pre" && pai && no.children[0]?.tagName === "code") {
        const code = no.children[0]
        const classe = (code.properties.className || []).find(c =>
          String(c).startsWith("language-"),
        )
        const lingua = classe ? String(classe).slice(9) : null
        if (lingua) {
          if (!r.Prism.languages[lingua]) {
            try {
              r.carregarLinguagens([lingua])
            } catch {}
          }
          const gramatica = r.Prism.languages[lingua]
          const fonte = textoDe(code)
          const html = gramatica
            ? r.Prism.highlight(fonte, gramatica, lingua)
            : escapar(fonte)
          pai.children[indice] = {
            type: "element",
            tagName: "div",
            properties: {
              className: ["gatsby-highlight"],
              dataLanguage: lingua,
            },
            children: [
              {
                type: "element",
                tagName: "pre",
                properties: { className: [`language-${lingua}`] },
                children: [
                  {
                    type: "element",
                    tagName: "code",
                    properties: { className: [`language-${lingua}`] },
                    children: [{ type: "raw", value: html }],
                  },
                ],
              },
            ],
          }
          return
        }
      }
    }
    no.children?.forEach((filho, i) => visitar(filho, no, i))
  }
  visitar(hast, null, 0)
  return r.paraHtml(hast, { allowDangerousHtml: true })
}

const textoDe = no =>
  no.type === "text" ? no.value : (no.children || []).map(textoDe).join("")
const escapar = s =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

// ---------------------------------------------------------------- http

function lerCorpo(req, limite) {
  return new Promise((resolve, reject) => {
    const partes = []
    let tamanho = 0
    req.on("data", c => {
      tamanho += c.length
      if (tamanho > limite) {
        reject(new ErroHttp(413, "Arquivo grande demais (máximo de 15 MB)."))
        req.destroy()
      } else partes.push(c)
    })
    req.on("end", () => resolve(Buffer.concat(partes)))
    req.on("error", reject)
  })
}

async function lerJson(req) {
  try {
    return JSON.parse(
      (await lerCorpo(req, LIMITE_JSON)).toString("utf8") || "{}",
    )
  } catch (e) {
    if (e instanceof ErroHttp) throw e
    throw new ErroHttp(400, "JSON inválido.")
  }
}

function responder(res, status, dados) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  })
  res.end(JSON.stringify(dados))
}

async function servirArquivo(res, caminho) {
  try {
    const dados = await readFile(caminho)
    res.writeHead(200, {
      "Content-Type":
        TIPOS[extname(caminho).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-store",
    })
    res.end(dados)
  } catch {
    responder(res, 404, { erro: "Não encontrado." })
  }
}

/** Coleção e id da query string, validados e com o arquivo existindo. */
async function exigirItem(url) {
  const colecao = colecaoDe(url.searchParams.get("colecao"))
  const id = url.searchParams.get("id")
  if (!colecao.validar(id)) {
    throw new ErroHttp(400, `Endereço de ${colecao.rotulo} inválido.`)
  }
  if (!(await existe(colecao.arquivo(id)))) {
    throw new ErroHttp(
      404,
      `${colecao.essa} não existe mais em ` +
        `${relative(RAIZ, colecao.raiz)}/ — talvez tenha sido movido ou apagado.`,
    )
  }
  return { colecao, id }
}

const hostsPermitidos = new Set([`127.0.0.1:${PORTA}`, `localhost:${PORTA}`])

async function tratar(req, res) {
  // Trava contra DNS rebinding e contra outra aba gravando aqui.
  if (!hostsPermitidos.has(req.headers.host)) {
    throw new ErroHttp(403, "Host não permitido.")
  }
  const origem = req.headers.origin
  if (
    req.method !== "GET" &&
    origem &&
    origem !== `http://${req.headers.host}`
  ) {
    throw new ErroHttp(403, "Origem não permitida.")
  }

  const url = new URL(req.url, `http://${req.headers.host}`)
  const rota = `${req.method} ${url.pathname}`

  if (req.method === "GET" && ESTATICOS[url.pathname]) {
    return servirArquivo(res, ESTATICOS[url.pathname])
  }
  if (req.method === "GET" && url.pathname.startsWith("/assets/fonts/")) {
    const nome = url.pathname.slice("/assets/fonts/".length)
    if (!/^[\w-]+\.woff2$/.test(nome))
      throw new ErroHttp(404, "Não encontrado.")
    return servirArquivo(res, join(RAIZ, "static", "assets", "fonts", nome))
  }
  if (req.method === "GET" && url.pathname.startsWith("/midia/")) {
    // /midia/<coleção>/<id>/<arquivo>: imagens ao lado do index.md.
    const partes = decodeURIComponent(url.pathname.slice(7)).split("/")
    const colecao = COLECOES[partes.shift()]
    const arquivo = partes.pop()
    const id = partes.join("/")
    if (!colecao?.validar(id) || !/^[\w][\w.-]*$/.test(arquivo || "")) {
      throw new ErroHttp(404, "Não encontrado.")
    }
    return servirArquivo(res, join(colecao.pasta(id), arquivo))
  }

  switch (rota) {
    case "GET /api/itens": {
      const colecao = colecaoDe(url.searchParams.get("colecao"))
      return responder(res, 200, { itens: await colecao.listar() })
    }

    case "POST /api/itens": {
      const corpo = await lerJson(req)
      const colecao = colecaoDe(corpo.colecao)
      const titulo = String(corpo.titulo ?? "").trim()
      if (!titulo) throw new ErroHttp(400, `Dê um título ${colecao.ao}.`)
      const slug = slugificar(String(corpo.slug || titulo))
      if (!slug) {
        throw new ErroHttp(400, "Não consegui tirar um endereço desse título.")
      }
      const id = await colecao.criar({ ...corpo, titulo, slug })
      return responder(res, 201, { id })
    }

    case "GET /api/item": {
      const { colecao, id } = await exigirItem(url)
      return responder(res, 200, await lerItem(colecao, id))
    }

    case "PUT /api/item": {
      const { colecao, id } = await exigirItem(url)
      const resultado = await salvarItem(colecao, id, await lerJson(req))
      return responder(res, resultado.conflito ? 409 : 200, resultado)
    }

    case "POST /api/imagem": {
      const { colecao, id } = await exigirItem(url)
      const tipo = (req.headers["content-type"] || "").split(";")[0].trim()
      if (!EXTENSAO_DA_IMAGEM[tipo]) {
        throw new ErroHttp(415, "Só dá para anexar PNG, JPG, GIF, WebP ou SVG.")
      }
      const dados = await lerCorpo(req, LIMITE_IMAGEM)
      const nome = await salvarImagem(
        colecao.pasta(id),
        tipo,
        url.searchParams.get("nome"),
        dados,
      )
      return responder(res, 201, { nome, caminho: `./${nome}` })
    }

    case "POST /api/previa": {
      const { colecao: nome, id, corpo = "" } = await lerJson(req)
      const colecao = colecaoDe(nome)
      if (!colecao.validar(id)) throw new ErroHttp(400, "Endereço inválido.")
      const html = renderizar(`/midia/${nome}/${id}`, String(corpo))
      return responder(
        res,
        200,
        html === null ? { indisponivel: true } : { html },
      )
    }
  }

  throw new ErroHttp(404, "Não encontrado.")
}

const servidor = http.createServer(async (req, res) => {
  try {
    await tratar(req, res)
  } catch (e) {
    if (!(e instanceof ErroHttp)) console.error(e)
    if (!res.headersSent) {
      responder(res, e.status || 500, {
        erro:
          e instanceof ErroHttp ? e.message : `Erro no servidor: ${e.message}`,
      })
    }
  }
})

servidor.on("error", e => {
  if (e.code === "EADDRINUSE") {
    console.error(
      `A porta ${PORTA} já está em uso — talvez o editor já esteja aberto em http://localhost:${PORTA}/.\n` +
        `Para usar outra:  make editor PORTA=8101`,
    )
    process.exit(1)
  }
  throw e
})

servidor.listen(PORTA, HOST, () => {
  const endereco = `http://localhost:${PORTA}/`
  const onde = caminho => relative(process.cwd(), caminho) || caminho
  console.log(`
Editor no ar:  ${endereco}

  notas em    ${onde(BASE)}/
  textos em   ${onde(BASE_TEXTOS)}/
  salvar não publica: quando quiser mandar para o ar, use  make publicar MSG="..."
  para ver a página de verdade enquanto escreve, rode  make dev  em outro terminal

Ctrl+C para fechar.
`)
  if (!process.env.NAO_ABRIR) {
    const comando = process.platform === "darwin" ? "open" : "xdg-open"
    spawn(comando, [endereco], { stdio: "ignore", detached: true })
      .on("error", () => {})
      .unref()
  }
})
