/**
 * Editor do conteúdo do site — o lado do navegador. Edita as notas de estudo
 * (content/notas/), os textos do blog (content/blog/) e os posts do LinkedIn
 * (content/linkedin/ — texto puro, fora do git: é copiar, postar e apagar).
 *
 * O salvamento é o centro de tudo:
 * - cada mudança espera uma pausa curta na digitação e vai para o disco
 *   (PUT /api/item); só um salvamento por vez, e o que mudou durante ele
 *   vai no seguinte;
 * - antes disso, cada mudança já fica guardada no localStorage: se o servidor
 *   cair ou a aba fechar no meio, o texto volta na próxima vez que abrir;
 * - se outro programa gravou no arquivo desde a última leitura, o servidor
 *   recusa (409) e o editor pergunta qual versão fica.
 *
 * Imagens também são problema do editor, não de quem escreve: elas vão para a
 * pasta certa, foto grande é reduzida antes de subir e formato que o site não
 * aceita (HEIC, por exemplo) é convertido quando o navegador sabe abrir.
 */

const ESPERA_SALVAR = 700
const ESPERA_PREVIA = 250
const CHAVE_MODO = "editor-notas:modo"
const SITE_LOCAL = "http://localhost:8000"

/** Limite do LinkedIn e onde o feed esconde o resto atrás de "…mais" (aprox.). */
const LIMITE_LINKEDIN = 3000
const DOBRA_LINKEDIN = 210

/** Acima disso a imagem é reduzida: o site nunca mostra mais que 900 px (1800 em tela retina). */
const LARGURA_MAXIMA = 2000
const TIPOS_DO_SITE = [
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "image/svg+xml",
]

const $ = id => document.getElementById(id)
const el = {
  status: $("status"),
  statusTexto: $("status-texto"),
  colecoes: document.querySelectorAll(".ed-colecoes button"),
  nova: $("nova"),
  novaInicio: $("nova-inicio"),
  arvore: $("arvore"),
  busca: $("busca"),
  inicio: $("inicio"),
  nota: $("nota"),
  aviso: $("aviso"),
  trilha: $("trilha"),
  titulo: $("titulo"),
  descricao: $("descricao"),
  ordem: $("ordem"),
  publicado: $("publicado"),
  data: $("data"),
  dataRotulo: $("data-rotulo"),
  categoria: $("categoria"),
  categorias: $("categorias"),
  publicadoTexto: $("publicado-texto"),
  publicadoTextoRotulo: $("publicado-texto-rotulo"),
  corpo: $("corpo"),
  area: $("area"),
  previa: $("previa"),
  cartaoTexto: $("cartao-texto"),
  contador: $("contador"),
  copiar: $("copiar"),
  apagar: $("apagar"),
  dica: $("dica"),
  dicaTexto: $("dica-texto"),
  dicaAlt: $("dica-alt"),
  dicaCampo: $("dica-campo"),
  verNoSite: $("ver-no-site"),
  subNota: $("sub-nota"),
  botaoImagem: $("botao-imagem"),
  arquivoImagem: $("arquivo-imagem"),
  dialogo: $("dialogo-nova"),
  novaTituloDialogo: $("nova-titulo-dialogo"),
  novaPai: $("nova-pai"),
  novaTitulo: $("nova-titulo"),
  novaCategoria: $("nova-categoria"),
  novaSlug: $("nova-slug"),
  novaUrl: $("nova-url"),
  novaErro: $("nova-erro"),
  novaCriar: $("nova-criar"),
}
const PLACEHOLDER_CORPO = el.corpo.placeholder

// ---------------------------------------------------------------- coleções

/**
 * O que muda entre as coleções na tela; o fluxo de salvar é o mesmo.
 * `endereco` só existe em quem tem página no site ("Ver no site"); `previa`
 * só em quem desenha a prévia no próprio navegador, sem o servidor.
 */
const COLECOES = {
  notas: {
    novo: "Nova nota",
    criar: "Criar nota",
    busca: "Buscar nas notas",
    titulo: "Título",
    descricao: "Uma linha sobre a nota — aparece no índice e nas buscas",
    exemplo: "Networking no Kubernetes",
    vazio: "Nenhuma nota ainda. A primeira vira um tema no índice do site.",
    classePrevia: "post__corpo post__corpo--nota",
    endereco: id => `/notas-de-estudo/${id}/`,
    lerCampos() {
      const ordem = el.ordem.value.trim()
      return {
        maturidade:
          el.nota.querySelector("input[name=maturidade]:checked")?.value ||
          "em-aberto",
        ordem: ordem === "" ? null : Number.parseInt(ordem, 10),
        publicado: el.publicado.checked,
      }
    },
    preencherCampos(campos) {
      el.ordem.value = Number.isInteger(campos.ordem) ? campos.ordem : ""
      el.publicado.checked = campos.publicado !== false
      for (const r of el.nota.querySelectorAll("input[name=maturidade]")) {
        r.checked = r.value === (campos.maturidade || "em-aberto")
      }
    },
  },
  textos: {
    novo: "Novo texto",
    criar: "Criar texto",
    busca: "Buscar nos textos",
    titulo: "Título",
    descricao:
      "Resumo de uma linha — aparece na listagem, no Google e ao compartilhar",
    exemplo: "Como eu decido quando parar de refatorar",
    vazio: "Nenhum texto ainda.",
    classePrevia: "post__corpo",
    trilha: "Textos",
    endereco: id => `/textos/${id.replace(/^\d{4}-\d{2}-\d{2}-/, "")}/`,
    lerCampos() {
      return {
        date: el.data.value,
        category: el.categoria.value.trim(),
        publicado: el.publicadoTexto.checked,
      }
    },
    preencherCampos(campos) {
      el.data.value = campos.date || ""
      el.categoria.value = campos.category || ""
      el.publicadoTexto.checked = campos.publicado === true
      rotularPublicacao()
    },
  },
  linkedin: {
    novo: "Novo post",
    criar: "Criar post",
    busca: "Buscar nos posts",
    titulo: "Rótulo do post — só para achar na lista, não vai para o LinkedIn",
    exemplo: "Por que paramos de estimar em horas",
    vazio: "Nenhum post ainda. Escreva aqui, copie, poste e apague.",
    classePrevia: "",
    trilha: "LinkedIn",
    placeholder:
      "Escreva o post como ele vai aparecer no LinkedIn: texto puro, sem Markdown. Quebras de linha valem.",
    previa: previaLinkedin,
    lerCampos() {
      return { date: el.data.value }
    },
    preencherCampos(campos) {
      el.data.value = campos.date || ""
    },
  },
}

const estado = {
  lista: "notas", // coleção mostrada na lateral
  itens: { notas: [], textos: [], linkedin: [] },
  colecao: null, // coleção do item aberto
  id: null, // item aberto
  versao: null,
  salvo: null, // JSON do último conteúdo que o disco confirmou
  emVoo: null, // promessa do salvamento em andamento
  deNovo: false,
  timer: null,
  tentativas: 0,
  conflito: false,
  timerPrevia: null,
  timerDica: null,
  semDescricao: [], // imagens recém-anexadas esperando a descrição
  salvoEm: null,
}

const aberto = () => (estado.id ? COLECOES[estado.colecao] : null)
const consulta = (colecao = estado.colecao, id = estado.id) =>
  `colecao=${colecao}&id=${encodeURIComponent(id)}`

// ---------------------------------------------------------------- utilidades

async function api(metodo, caminho, corpo, cabecalhos = {}) {
  const opcoes = { method: metodo, headers: { ...cabecalhos } }
  if (corpo instanceof Blob) opcoes.body = corpo
  else if (corpo !== undefined) {
    opcoes.body = JSON.stringify(corpo)
    opcoes.headers["Content-Type"] = "application/json"
  }
  const r = await fetch(caminho, opcoes)
  const dados = await r.json().catch(() => ({}))
  return { ok: r.ok, status: r.status, dados }
}

const slugificar = texto =>
  texto
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "")

const normalizar = s => s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase()

/** Data local de hoje, AAAA-MM-DD (o mesmo `hoje()` do servidor). */
const hojeIso = () => {
  const d = new Date()
  const p = n => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

const hora = d =>
  d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })

const dataCurta = iso =>
  iso
    ? new Date(`${iso}T12:00:00`).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : ""

// Notas mantêm a chave antiga; textos ganham prefixo (id de nota nunca tem ":").
const chaveRascunho = (colecao, id) =>
  colecao === "notas"
    ? `editor-notas:rascunho:${id}`
    : `editor-notas:rascunho:${colecao}:${id}`

const lerRascunho = () => {
  try {
    return JSON.parse(
      localStorage.getItem(chaveRascunho(estado.colecao, estado.id)),
    )
  } catch {
    return null
  }
}
const guardarRascunho = conteudo => {
  try {
    localStorage.setItem(
      chaveRascunho(estado.colecao, estado.id),
      JSON.stringify({ ...conteudo, em: Date.now() }),
    )
  } catch {}
}
const apagarRascunho = (colecao = estado.colecao, id = estado.id) => {
  try {
    localStorage.removeItem(chaveRascunho(colecao, id))
  } catch {}
}

// ---------------------------------------------------------------- status

const TEXTOS = {
  ocioso: () => "Nada aberto",
  salvo: () =>
    estado.salvoEm ? `Salvo às ${hora(estado.salvoEm)}` : "Tudo salvo",
  pendente: () => "Alterações por salvar",
  salvando: () => "Salvando…",
  erro: () =>
    "Não consegui gravar no disco — tentando de novo. O texto está guardado neste navegador.",
  conflito: () => "Não salvo: o arquivo mudou fora do editor",
}

function mostrarStatus(nome) {
  el.status.dataset.estado = nome
  el.statusTexto.textContent = TEXTOS[nome]()
}

/**
 * O recado no canto da área de escrita. Com imagem esperando descrição, ele
 * mostra o campo "o que a imagem mostra?" e fica até a pessoa responder ou
 * pular; só com informação, some sozinho.
 */
function mostrarDica(texto = "") {
  clearTimeout(estado.timerDica)
  const pendente = estado.semDescricao[0]
  el.dicaAlt.hidden = !pendente
  el.dicaTexto.textContent = pendente
    ? `${texto} O que ${estado.semDescricao.length > 1 ? `a imagem ${pendente.nome}` : "a imagem"} mostra? A descrição aparece para quem não consegue vê-la.`.trim()
    : texto
  el.dica.hidden = !el.dicaTexto.textContent
  if (pendente) {
    el.dicaCampo.value = ""
    el.dicaCampo.focus()
  } else if (texto) {
    estado.timerDica = setTimeout(() => (el.dica.hidden = true), 9000)
  }
}

function fecharDica() {
  clearTimeout(estado.timerDica)
  estado.semDescricao = []
  el.dica.hidden = true
}

/** Põe a descrição digitada no lugar certo do Markdown e passa para a próxima. */
function descreverImagem(descricao) {
  const pendente = estado.semDescricao.shift()
  const texto = descricao.trim().replace(/\s+/g, " ").replace(/[[\]]/g, "\\$&")
  if (pendente && texto && el.corpo.value.includes(pendente.markdown)) {
    const final = pendente.markdown.replace("![]", `![${texto}]`)
    trocarTexto(pendente.markdown, final)
    const i = el.corpo.value.indexOf(final) + final.length
    el.corpo.setSelectionRange(i, i)
  }
  if (estado.semDescricao.length) mostrarDica()
  else {
    el.dica.hidden = true
    el.corpo.focus()
  }
}

// ---------------------------------------------------------------- formulário

function lerFormulario() {
  return {
    campos: {
      title: el.titulo.value,
      description: el.descricao.value,
      ...aberto().lerCampos(),
    },
    corpo: el.corpo.value,
  }
}

function preencher({ campos, corpo }) {
  el.titulo.value = campos.title ?? ""
  el.descricao.value = campos.description ?? ""
  aberto().preencherCampos(campos)
  el.corpo.value = corpo ?? ""
  atualizarPrevia(true)
}

const sujo = () =>
  estado.id !== null && JSON.stringify(lerFormulario()) !== estado.salvo

/** Liga só os campos da coleção (data-so="textos linkedin") dentro de `raiz`. */
function mostrarCamposDe(raiz, colecao) {
  raiz.dataset.colecao = colecao
  for (const e of raiz.querySelectorAll("[data-so]")) {
    e.hidden = !e.dataset.so.split(" ").includes(colecao)
  }
}

/** Texto rascunho não tem página nem no make dev: o link some até publicar. */
function rotularPublicacao() {
  const publicado = el.publicadoTexto.checked
  el.publicadoTextoRotulo.textContent = publicado
    ? "Publicado"
    : "Rascunho — fora do site"
  if (estado.colecao === "textos") el.verNoSite.hidden = !publicado
}

// ---------------------------------------------------------------- salvar

function aoMudar() {
  if (!estado.id) return
  guardarRascunho({ ...lerFormulario(), base: estado.versao })
  if (estado.conflito) return // espera a decisão no aviso
  mostrarStatus("pendente")
  clearTimeout(estado.timer)
  estado.timer = setTimeout(salvar, ESPERA_SALVAR)
}

/** Grava o que está na tela. Devolve quando o disco confirmou (ou falhou). */
async function salvar() {
  clearTimeout(estado.timer)
  if (!estado.id || estado.conflito) return
  if (estado.emVoo) {
    estado.deNovo = true
    return estado.emVoo
  }

  const conteudo = lerFormulario()
  const json = JSON.stringify(conteudo)
  if (json === estado.salvo) {
    mostrarStatus("salvo")
    return
  }

  const { colecao, id } = estado
  mostrarStatus("salvando")
  estado.emVoo = (async () => {
    try {
      const r = await api("PUT", `/api/item?${consulta(colecao, id)}`, {
        ...conteudo,
        versao: estado.versao,
      })
      if (id !== estado.id || colecao !== estado.colecao) return
      if (r.status === 409) return mostrarConflito(r.dados.conflito)
      if (!r.ok) throw new Error(r.dados.erro || `HTTP ${r.status}`)

      estado.versao = r.dados.versao
      estado.salvo = json
      estado.salvoEm = new Date()
      estado.tentativas = 0
      if (JSON.stringify(lerFormulario()) === json) apagarRascunho(colecao, id)
      mostrarStatus("salvo")
      atualizarItem(colecao, id, conteudo)
    } catch (e) {
      console.error("[editor] salvar:", e)
      estado.tentativas++
      mostrarStatus("erro")
      clearTimeout(estado.timer)
      estado.timer = setTimeout(
        salvar,
        Math.min(30000, 1000 * 2 ** estado.tentativas),
      )
    }
  })()

  await estado.emVoo
  estado.emVoo = null
  if (estado.deNovo) {
    estado.deNovo = false
    if (sujo()) return salvar()
  }
}

/** Salva o que falta antes de trocar de item. O rascunho cobre se falhar. */
async function descarregar() {
  if (estado.emVoo) await estado.emVoo
  if (sujo() && !estado.conflito) await salvar()
}

// ---------------------------------------------------------------- avisos

function mostrarAviso(texto, botoes) {
  el.aviso.innerHTML = ""
  const p = document.createElement("p")
  p.textContent = texto
  el.aviso.append(p)
  const linha = document.createElement("div")
  linha.className = "ed-aviso__botoes"
  for (const [rotulo, acao, classe] of botoes) {
    const b = document.createElement("button")
    b.type = "button"
    b.className = `botao ${classe || ""}`
    b.textContent = rotulo
    b.addEventListener("click", () => {
      esconderAviso()
      acao()
    })
    linha.append(b)
  }
  el.aviso.append(linha)
  el.aviso.hidden = false
}

function esconderAviso() {
  el.aviso.hidden = true
  el.aviso.innerHTML = ""
}

function mostrarConflito(noDisco) {
  estado.conflito = true
  mostrarStatus("conflito")
  mostrarAviso(
    "Outro programa gravou neste arquivo enquanto ele estava aberto aqui. " +
      "Qual versão fica?",
    [
      [
        "Manter a do editor",
        () => {
          estado.conflito = false
          estado.versao = noDisco.versao
          salvar()
        },
      ],
      [
        "Usar a do disco",
        () => {
          estado.conflito = false
          carregarNoFormulario(noDisco)
          apagarRascunho()
        },
        "botao--nevoa",
      ],
    ],
  )
}

function oferecerRascunho(rascunho) {
  const quando = new Date(rascunho.em)
  const dia = quando.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  })
  mostrarAviso(
    `Há uma versão deste texto de ${dia} às ${hora(quando)} que não chegou ao ` +
      "disco. Quer recuperá-la?",
    [
      [
        "Recuperar",
        () => {
          preencher(rascunho)
          aoMudar()
        },
      ],
      ["Descartar", () => apagarRascunho(), "botao--nevoa"],
    ],
  )
}

// ---------------------------------------------------------------- abrir

function carregarNoFormulario(item) {
  estado.versao = item.versao
  preencher(item)
  estado.salvo = JSON.stringify(lerFormulario())
  mostrarStatus("salvo")
}

async function abrir(colecao, id, { focar } = {}) {
  await descarregar()
  const r = await api("GET", `/api/item?${consulta(colecao, id)}`)
  if (!r.ok) {
    alertaSimples(r.dados.erro || "Não consegui abrir esse arquivo.")
    return
  }

  esconderAviso()
  fecharDica()
  estado.colecao = colecao
  estado.id = id
  estado.conflito = false
  estado.tentativas = 0
  estado.salvoEm = null
  const c = COLECOES[colecao]
  mostrarCamposDe(el.nota, colecao)
  el.previa.className = c.classePrevia
  el.previa.hidden = Boolean(c.previa)
  el.titulo.placeholder = c.titulo
  el.descricao.placeholder = c.descricao || ""
  el.corpo.placeholder = c.placeholder || PLACEHOLDER_CORPO
  el.dataRotulo.textContent = colecao === "linkedin" ? "Postar em" : "Data"
  el.verNoSite.hidden = !c.endereco
  if (c.endereco) el.verNoSite.href = SITE_LOCAL + c.endereco(id)
  carregarNoFormulario(r.dados)

  const rascunho = lerRascunho()
  if (rascunho) {
    const { campos, corpo } = rascunho
    if (JSON.stringify({ campos, corpo }) === estado.salvo) apagarRascunho()
    else oferecerRascunho(rascunho)
  }

  el.inicio.hidden = true
  el.nota.hidden = false
  const hash = `#/${colecao}/${id}`
  if (location.hash !== hash) history.replaceState(null, "", hash)
  if (estado.lista !== colecao) mostrarLista(colecao)
  montarTrilha()
  document.title = `${r.dados.campos.title || id} — editor`
  marcarAtiva()
  if (focar === "corpo") el.corpo.focus()
}

/** Volta à tela inicial sem nada aberto (depois de apagar o item). */
function fecharItem() {
  clearTimeout(estado.timer)
  Object.assign(estado, {
    colecao: null,
    id: null,
    versao: null,
    salvo: null,
    conflito: false,
    salvoEm: null,
  })
  fecharDica()
  mostrarStatus("ocioso")
  el.nota.hidden = true
  el.inicio.hidden = false
  history.replaceState(null, "", location.pathname)
  document.title = "Editor"
  marcarAtiva()
}

/** Quando a aba volta ao foco: se o arquivo mudou lá fora e aqui está tudo salvo, recarrega. */
async function conferirDisco() {
  if (!estado.id || estado.emVoo || sujo() || estado.conflito) return
  const r = await api("GET", `/api/item?${consulta()}`)
  if (r.ok && r.dados.versao !== estado.versao && !sujo()) {
    carregarNoFormulario(r.dados)
    estado.salvoEm = null
    el.statusTexto.textContent = "Recarregado: o arquivo mudou fora do editor"
    carregarListas()
  }
}

function alertaSimples(texto) {
  if (estado.id) {
    mostrarAviso(texto, [["Ok", () => {}, "botao--nevoa"]])
  } else {
    // Nada aberto (link velho, arquivo apagado): o aviso vai na tela inicial.
    history.replaceState(null, "", location.pathname)
    $("inicio-texto").textContent = texto
  }
}

// ---------------------------------------------------------------- lateral

async function carregarListas() {
  const nomes = Object.keys(COLECOES)
  const respostas = await Promise.all(
    nomes.map(c => api("GET", `/api/itens?colecao=${c}`)),
  )
  nomes.forEach((c, i) => {
    if (respostas[i].ok) estado.itens[c] = respostas[i].dados.itens
  })
  atualizarCategorias()
  desenharLista()
}

/** Categorias já usadas nos textos viram sugestão no campo. */
function atualizarCategorias() {
  const usadas = new Set(["Engenharia"])
  for (const t of estado.itens.textos) if (t.categoria) usadas.add(t.categoria)
  el.categorias.innerHTML = ""
  for (const c of [...usadas].sort((a, b) => a.localeCompare(b, "pt-BR"))) {
    el.categorias.append(new Option(c))
  }
}

function mostrarLista(colecao) {
  estado.lista = colecao
  for (const b of el.colecoes) {
    b.setAttribute("aria-pressed", String(b.dataset.colecao === colecao))
  }
  const c = COLECOES[colecao]
  el.nova.textContent = c.novo
  el.novaInicio.textContent = c.novo
  el.busca.placeholder = c.busca
  el.busca.setAttribute("aria-label", c.busca)
  el.busca.value = ""
  desenharLista()
}

const tituloDaNota = id =>
  estado.itens.notas.find(n => n.id === id)?.titulo || id

function desenharLista() {
  const colecao = estado.lista
  const todos = estado.itens[colecao]
  const termo = normalizar(el.busca.value.trim())
  const lista = termo
    ? todos.filter(n =>
        normalizar(`${n.titulo} ${n.id} ${n.categoria || ""}`).includes(termo),
      )
    : todos

  el.arvore.innerHTML = ""
  const vazio = texto => {
    const p = document.createElement("p")
    p.className = "ed-arvore__vazio"
    p.textContent = texto
    el.arvore.append(p)
  }
  if (!todos.length) return vazio(COLECOES[colecao].vazio)
  if (!lista.length) return vazio(`Nada com “${el.busca.value.trim()}”.`)

  for (const n of lista) {
    const a = document.createElement("a")
    a.href = `#/${colecao}/${n.id}`
    a.className = "ed-item"
    a.dataset.colecao = colecao
    a.dataset.id = n.id
    const nivel = colecao === "notas" && !termo ? n.id.split("/").length - 1 : 0
    a.style.setProperty("--nivel", nivel)

    const nome = document.createElement("span")
    nome.className = "ed-item__nome"
    nome.textContent = n.titulo
    a.append(nome)

    const onde = document.createElement("span")
    onde.className = "ed-item__onde"
    if (colecao === "textos") {
      onde.textContent = [dataCurta(n.data), n.categoria]
        .filter(Boolean)
        .join(" · ")
    } else if (colecao === "linkedin") {
      onde.textContent = [
        dataCurta(n.data),
        n.tamanho ? `${n.tamanho.toLocaleString("pt-BR")} caracteres` : "vazio",
      ].join(" · ")
    } else if (termo && n.id.includes("/")) {
      onde.textContent = n.id
        .split("/")
        .slice(0, -1)
        .map(tituloDaNota)
        .join(" / ")
    }
    if (onde.textContent) a.append(onde)

    const marcas = document.createElement("span")
    marcas.className = "ed-item__marcas"
    if (colecao === "notas") {
      if (!n.publicado) marcas.append(marca("fora do site", "fora"))
      if (n.orfa) marcas.append(marca("sem tema acima", "orfa"))
      marcas.append(
        marca(
          n.maturidade === "revisada" ? "revisada" : "em aberto",
          n.maturidade,
        ),
      )
    } else if (colecao === "textos") {
      marcas.append(
        n.publicado
          ? marca("publicado", "revisada")
          : marca("rascunho", "rascunho"),
      )
    } else if (n.tamanho > LIMITE_LINKEDIN) {
      marcas.append(marca("passa do limite do LinkedIn", "fora"))
    }
    a.append(marcas)
    el.arvore.append(a)
  }
  marcarAtiva()
}

function marca(texto, tipo) {
  const s = document.createElement("span")
  s.className = `ed-marca-item ed-marca-item--${tipo}`
  s.title = texto
  s.setAttribute("aria-label", texto)
  return s
}

function marcarAtiva() {
  for (const a of el.arvore.querySelectorAll(".ed-item")) {
    const ativa =
      a.dataset.id === estado.id && a.dataset.colecao === estado.colecao
    a.classList.toggle("ed-item--ativa", ativa)
    if (ativa) a.setAttribute("aria-current", "page")
    else a.removeAttribute("aria-current")
  }
}

/** Título, estágio, data ou publicação mudou: reflete na lateral sem recarregar. */
function atualizarItem(colecao, id, { campos, corpo }) {
  const n = estado.itens[colecao].find(n => n.id === id)
  if (!n) return
  const novo = {
    titulo: campos.title || id.split("/").at(-1),
    ...(colecao === "notas"
      ? { maturidade: campos.maturidade, publicado: campos.publicado }
      : colecao === "textos"
        ? {
            data: campos.date || n.data,
            categoria: campos.category,
            publicado: campos.publicado,
          }
        : { data: campos.date || n.data, tamanho: [...corpo.trim()].length }),
  }
  if (Object.keys(novo).every(k => n[k] === novo[k])) return
  Object.assign(n, novo)
  if (colecao !== "notas") {
    estado.itens[colecao].sort(
      (a, b) => b.data.localeCompare(a.data) || a.id.localeCompare(b.id),
    )
    if (colecao === "textos") atualizarCategorias()
  }
  desenharLista()
  montarTrilha()
}

function montarTrilha() {
  el.trilha.innerHTML = ""
  const raiz = document.createElement("span")
  el.trilha.append(raiz)
  if (estado.colecao !== "notas") {
    raiz.textContent = COLECOES[estado.colecao].trilha
    return
  }
  raiz.textContent = "Notas de estudo"
  const partes = estado.id.split("/")
  for (let i = 1; i < partes.length; i++) {
    const id = partes.slice(0, i).join("/")
    const sep = document.createElement("span")
    sep.className = "ed-trilha__sep"
    sep.textContent = "/"
    const a = document.createElement("a")
    a.href = `#/notas/${id}`
    a.textContent = tituloDaNota(id)
    el.trilha.append(sep, a)
  }
}

// ---------------------------------------------------------------- prévia

function modoAtual() {
  return el.area.dataset.modo
}

function mudarModo(modo) {
  el.area.dataset.modo = modo
  for (const b of document.querySelectorAll(".ed-modos button")) {
    b.setAttribute("aria-pressed", String(b.dataset.modo === modo))
  }
  try {
    localStorage.setItem(CHAVE_MODO, modo)
  } catch {}
  atualizarPrevia(true)
  if (modo !== "previa" && estado.id) el.corpo.focus()
}

function atualizarPrevia(agora) {
  clearTimeout(estado.timerPrevia)
  if (!estado.id) return
  // Prévia local (LinkedIn): sem rede, sempre em dia — o contador vale
  // também no modo "escrever".
  if (aberto().previa) return aberto().previa()
  if (modoAtual() === "escrever") return
  estado.timerPrevia = setTimeout(
    async () => {
      const { colecao, id } = estado
      const corpo = el.corpo.value
      if (!corpo.trim()) {
        el.previa.innerHTML =
          '<p class="ed-previa__vazia">A prévia aparece aqui, do jeito que a página fica no site.</p>'
        return
      }
      const r = await api("POST", "/api/previa", { colecao, id, corpo }).catch(
        () => null,
      )
      if (id !== estado.id || colecao !== estado.colecao || !r) return
      if (r.dados.indisponivel) {
        el.previa.innerHTML =
          '<p class="ed-previa__vazia">Prévia indisponível: faltam os pacotes de Markdown em node_modules (rode <code>make deps</code>). Salvar continua funcionando.</p>'
      } else if (r.ok) {
        el.previa.innerHTML = r.dados.html
      }
    },
    agora ? 0 : ESPERA_PREVIA,
  )
}

/**
 * O post como o feed mostra: texto puro com as quebras, contador contra o
 * limite e a dobra onde o LinkedIn esconde o resto atrás de "…mais".
 */
function previaLinkedin() {
  const texto = el.corpo.value
  const letras = [...texto.trim()]
  const n = letras.length
  el.contador.textContent = `${n.toLocaleString("pt-BR")} / ${LIMITE_LINKEDIN.toLocaleString("pt-BR")} caracteres`
  el.contador.className =
    "ed-contador" +
    (n > LIMITE_LINKEDIN
      ? " ed-contador--passou"
      : n > LIMITE_LINKEDIN - 200
        ? " ed-contador--perto"
        : "")

  el.cartaoTexto.replaceChildren()
  if (!n) return
  const inteiro = [...texto.trimEnd()]
  if (inteiro.length <= DOBRA_LINKEDIN) {
    el.cartaoTexto.textContent = inteiro.join("")
    return
  }
  const dobra = document.createElement("span")
  dobra.className = "ed-cartao__dobra"
  el.cartaoTexto.append(
    inteiro.slice(0, DOBRA_LINKEDIN).join(""),
    dobra,
    inteiro.slice(DOBRA_LINKEDIN).join(""),
  )
}

// ---------------------------------------------------------------- imagens

const eImagem = f =>
  f.type.startsWith("image/") || /\.(heic|heif|avif)$/i.test(f.name || "")

/**
 * Deixa a imagem pronta para o site: reduz foto maior que LARGURA_MAXIMA e
 * converte para JPG o formato que o site não aceita. GIF (pode ser animado) e
 * SVG (vetor) vão como estão. Devolve `{ blob, nome, avisos }`.
 */
async function prepararImagem(arquivo) {
  const nome = arquivo.name && arquivo.name !== "image.png" ? arquivo.name : ""
  const aceito = TIPOS_DO_SITE.includes(arquivo.type)
  if (arquivo.type === "image/gif" || arquivo.type === "image/svg+xml") {
    return { blob: arquivo, nome, avisos: [] }
  }

  let bitmap
  try {
    bitmap = await createImageBitmap(arquivo) // respeita a rotação da câmera
  } catch {
    if (aceito) return { blob: arquivo, nome, avisos: [] }
    const formato = (arquivo.name.split(".").pop() || "esse").toUpperCase()
    throw new Error(
      `este navegador não abre ${formato}. Abra a imagem no Preview, use Arquivo › Exportar como JPEG e anexe de novo`,
    )
  }

  const grande = bitmap.width > LARGURA_MAXIMA
  if (aceito && !grande) {
    bitmap.close()
    return { blob: arquivo, nome, avisos: [] }
  }

  const escala = grande ? LARGURA_MAXIMA / bitmap.width : 1
  const canvas = document.createElement("canvas")
  canvas.width = Math.round(bitmap.width * escala)
  canvas.height = Math.round(bitmap.height * escala)
  canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  // PNG e WebP (print, diagrama, transparência) continuam no formato; o resto vira JPG.
  const tipo = ["image/png", "image/webp"].includes(arquivo.type)
    ? arquivo.type
    : "image/jpeg"
  const blob = await new Promise(r => canvas.toBlob(r, tipo, 0.86))

  const avisos = []
  if (grande)
    avisos.push(`reduzi de ${bitmap.width} para ${canvas.width} px de largura`)
  if (!aceito) {
    const de = (arquivo.name.split(".").pop() || "").toUpperCase()
    avisos.push(`converti ${de ? `de ${de} ` : ""}para JPG`)
  }
  bitmap.close()
  return { blob, nome, avisos }
}

async function anexarImagens(arquivos) {
  const imagens = [...arquivos].filter(eImagem)
  if (!imagens.length || !estado.id) return false
  if (estado.colecao === "linkedin") {
    mostrarDica(
      "Post do LinkedIn não leva imagem por aqui: anexe lá, na hora de postar.",
    )
    return true
  }

  const dicas = []
  for (const img of imagens) {
    const marcador = `![Enviando ${img.name || "imagem"}…]()`
    // A imagem entra como parágrafo próprio, no fim da linha onde está o
    // cursor: nunca no meio de uma frase ou de outra imagem.
    const fimDaLinha = el.corpo.value.indexOf("\n", el.corpo.selectionEnd)
    const pos = fimDaLinha === -1 ? el.corpo.value.length : fimDaLinha
    el.corpo.setSelectionRange(pos, pos)
    const antes = el.corpo.value.slice(0, pos)
    const recuo =
      !antes || antes.endsWith("\n\n")
        ? ""
        : antes.endsWith("\n")
          ? "\n"
          : "\n\n"
    const depois = el.corpo.value.slice(pos)
    const sufixo = depois.startsWith("\n\n")
      ? ""
      : depois.startsWith("\n")
        ? "\n"
        : "\n\n"
    const inserido = `${recuo}${marcador}${sufixo}`
    inserirTexto(inserido)

    let troca
    try {
      const { blob, nome, avisos } = await prepararImagem(img)
      const r = await api(
        "POST",
        `/api/imagem?${consulta()}&nome=${encodeURIComponent(nome)}`,
        blob,
        { "Content-Type": blob.type },
      ).catch(() => ({ ok: false, dados: { erro: "o editor não respondeu" } }))
      if (!r.ok) throw new Error(r.dados.erro || "erro ao gravar")
      troca = `![](${r.dados.caminho})`
      estado.semDescricao.push({ markdown: troca, nome: r.dados.nome })
      if (avisos.length)
        dicas.push(
          `${imagens.length > 1 ? `${img.name}: ` : ""}${avisos.join(" e ")}.`.replace(
            /^./,
            c => c.toUpperCase(),
          ),
        )
    } catch (e) {
      troca = ""
      dicas.push(`Não anexei ${img.name || "a imagem"}: ${e.message}.`)
    }
    // Falhou: sai tudo o que entrou, inclusive as linhas em branco.
    if (troca) trocarTexto(marcador, troca)
    else trocarTexto(inserido, "")
  }

  mostrarDica(dicas.join(" "))
  return true
}

/** Insere no cursor mantendo o desfazer (Cmd+Z) do navegador. */
function inserirTexto(texto) {
  el.corpo.focus()
  if (!document.execCommand("insertText", false, texto)) {
    el.corpo.setRangeText(
      texto,
      el.corpo.selectionStart,
      el.corpo.selectionEnd,
      "end",
    )
    aoMudar()
  }
}

function trocarTexto(de, para) {
  const i = el.corpo.value.indexOf(de)
  if (i === -1) return para && inserirTexto(para)
  const [ini, fim] = [el.corpo.selectionStart, el.corpo.selectionEnd]
  el.corpo.setSelectionRange(i, i + de.length)
  if (para) inserirTexto(para)
  else document.execCommand("delete") || el.corpo.setRangeText("")
  const delta = para.length - de.length
  const ajuste = pos => (pos > i ? Math.max(i, pos + delta) : pos)
  el.corpo.setSelectionRange(ajuste(ini), ajuste(fim))
  atualizarPrevia()
}

// ---------------------------------------------------------------- criar

function abrirDialogoNovo(pai = "") {
  const colecao = estado.lista
  const c = COLECOES[colecao]
  mostrarCamposDe(el.dialogo, colecao)
  el.novaTituloDialogo.textContent = c.novo
  el.novaCriar.textContent = c.criar
  el.novaTitulo.placeholder = c.exemplo

  el.novaPai.innerHTML = ""
  el.novaPai.append(new Option("Nenhuma — é um tema novo", ""))
  for (const n of estado.itens.notas) {
    const recuo = " ".repeat(n.id.split("/").length - 1)
    el.novaPai.append(new Option(`${recuo}${n.titulo}`, n.id))
  }
  el.novaPai.value = pai
  el.novaTitulo.value = ""
  el.novaCategoria.value = ""
  el.novaSlug.value = ""
  el.novaSlug.dataset.editado = ""
  el.novaErro.textContent = ""
  atualizarUrlNova()
  el.dialogo.showModal()
  el.novaTitulo.focus()
}

function atualizarUrlNova() {
  if (!el.novaSlug.dataset.editado) {
    el.novaSlug.value = slugificar(el.novaTitulo.value)
  }
  const seg = slugificar(el.novaSlug.value) || "…"
  if (el.dialogo.dataset.colecao === "textos") {
    el.novaUrl.textContent = `Vai ficar em /textos/${seg}/ — começa como rascunho, fora do site`
  } else if (el.dialogo.dataset.colecao === "linkedin") {
    el.novaUrl.textContent = `Vai ficar em content/linkedin/${hojeIso()}-${seg}/ — fora do git e do site`
  } else {
    const pai = el.novaPai.value
    el.novaUrl.textContent = `Vai ficar em /notas-de-estudo/${pai ? pai + "/" : ""}${seg}/`
  }
}

async function criar(evento) {
  evento.preventDefault()
  el.novaErro.textContent = ""
  const colecao = el.dialogo.dataset.colecao
  const r = await api("POST", "/api/itens", {
    colecao,
    pai: el.novaPai.value,
    titulo: el.novaTitulo.value,
    categoria: el.novaCategoria.value,
    slug: el.novaSlug.value,
  })
  if (!r.ok) {
    el.novaErro.textContent = r.dados.erro || "Não consegui criar."
    return
  }
  el.dialogo.close()
  await carregarListas()
  await abrir(colecao, r.dados.id, { focar: "corpo" })
}

// ---------------------------------------------------------------- eventos

for (const campo of [
  el.titulo,
  el.descricao,
  el.ordem,
  el.categoria,
  el.corpo,
]) {
  campo.addEventListener("input", aoMudar)
}
el.corpo.addEventListener("input", () => atualizarPrevia())
for (const campo of [el.publicado, el.data]) {
  campo.addEventListener("change", aoMudar)
}
el.publicadoTexto.addEventListener("change", () => {
  rotularPublicacao()
  aoMudar()
})
for (const r of el.nota.querySelectorAll("input[name=maturidade]")) {
  r.addEventListener("change", aoMudar)
}

el.corpo.addEventListener("keydown", e => {
  // Tab indenta (listas aninhadas, código) em vez de sair do campo.
  if (e.key === "Tab" && !e.shiftKey && !e.metaKey && !e.ctrlKey && !e.altKey) {
    e.preventDefault()
    inserirTexto("  ")
  }
})
el.corpo.addEventListener("paste", async e => {
  const arquivos = [...(e.clipboardData?.files || [])]
  if (arquivos.some(eImagem)) {
    e.preventDefault()
    await anexarImagens(arquivos)
  }
})
// Soltar a imagem em qualquer ponto da área (texto ou prévia) funciona.
el.area.addEventListener("dragover", e => {
  if (e.dataTransfer?.types.includes("Files")) {
    e.preventDefault()
    el.area.classList.add("ed-area--soltando")
  }
})
el.area.addEventListener("dragleave", e => {
  if (!el.area.contains(e.relatedTarget)) {
    el.area.classList.remove("ed-area--soltando")
  }
})
el.area.addEventListener("drop", async e => {
  el.area.classList.remove("ed-area--soltando")
  if (!e.dataTransfer?.files?.length) return
  e.preventDefault()
  await anexarImagens(e.dataTransfer.files)
})
el.botaoImagem.addEventListener("click", () => el.arquivoImagem.click())
$("dica-pronto").addEventListener("click", () =>
  descreverImagem(el.dicaCampo.value),
)
$("dica-pular").addEventListener("click", () => descreverImagem(""))
el.dicaCampo.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault()
    descreverImagem(el.dicaCampo.value)
  }
  if (e.key === "Escape") descreverImagem("")
})
el.arquivoImagem.addEventListener("change", async () => {
  const arquivos = [...el.arquivoImagem.files]
  el.arquivoImagem.value = ""
  await anexarImagens(arquivos)
})

el.copiar.addEventListener("click", async () => {
  const texto = el.corpo.value.trim()
  try {
    await navigator.clipboard.writeText(texto)
    mostrarDica("Copiado. Agora é colar no LinkedIn.")
  } catch {
    el.corpo.focus()
    el.corpo.select()
    mostrarDica(
      "Não consegui copiar sozinho — o texto está selecionado, use Cmd+C.",
    )
  }
})
el.apagar.addEventListener("click", () => {
  const { colecao, id } = estado
  const rotulo = el.titulo.value.trim() || id
  mostrarAviso(`Apagar “${rotulo}”? A pasta some do disco e não tem volta.`, [
    [
      "Apagar",
      async () => {
        clearTimeout(estado.timer)
        if (estado.emVoo) await estado.emVoo
        const r = await api("DELETE", `/api/item?${consulta(colecao, id)}`)
        if (!r.ok) return alertaSimples(r.dados.erro || "Não consegui apagar.")
        apagarRascunho(colecao, id)
        fecharItem()
        await carregarListas()
      },
    ],
    ["Cancelar", () => {}, "botao--nevoa"],
  ])
})

el.nota.addEventListener("submit", e => e.preventDefault())
document.addEventListener("keydown", e => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
    e.preventDefault()
    salvar()
  }
})

for (const b of document.querySelectorAll(".ed-modos button")) {
  b.addEventListener("click", () => mudarModo(b.dataset.modo))
}
for (const b of el.colecoes) {
  b.addEventListener("click", () => mostrarLista(b.dataset.colecao))
}

el.busca.addEventListener("input", desenharLista)
el.nova.addEventListener("click", () => abrirDialogoNovo(""))
el.novaInicio.addEventListener("click", () => abrirDialogoNovo(""))
el.subNota.addEventListener("click", () => {
  mostrarLista("notas")
  abrirDialogoNovo(estado.id)
})
$("nova-cancelar").addEventListener("click", () => el.dialogo.close())
$("form-nova").addEventListener("submit", criar)
el.novaTitulo.addEventListener("input", atualizarUrlNova)
el.novaPai.addEventListener("change", atualizarUrlNova)
el.novaSlug.addEventListener("input", () => {
  el.novaSlug.dataset.editado = el.novaSlug.value ? "1" : ""
  atualizarUrlNova()
})

/** `#/textos/<pasta>` ou `#/notas/<slug>`; `#/<slug>` (link antigo) é nota. */
function lerHash() {
  const partes = decodeURIComponent(location.hash.replace(/^#\/?/, "")).split(
    "/",
  )
  if (!partes[0]) return null
  if (COLECOES[partes[0]] && partes.length > 1) {
    return { colecao: partes[0], id: partes.slice(1).join("/") }
  }
  return { colecao: "notas", id: partes.join("/") }
}

window.addEventListener("hashchange", () => {
  const alvo = lerHash()
  if (alvo && (alvo.id !== estado.id || alvo.colecao !== estado.colecao)) {
    abrir(alvo.colecao, alvo.id)
  }
})
window.addEventListener("focus", conferirDisco)
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") salvar()
  else conferirDisco()
})
window.addEventListener("beforeunload", e => {
  if (!sujo() && !estado.emVoo) return
  // Última tentativa; o rascunho no localStorage já cobre se não der tempo.
  fetch(`/api/item?${consulta()}`, {
    method: "PUT",
    keepalive: true,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...lerFormulario(), versao: estado.versao }),
  }).catch(() => {})
  e.preventDefault()
})

// ---------------------------------------------------------------- início

;(async () => {
  let modo = "dividir"
  try {
    modo = localStorage.getItem(CHAVE_MODO) || modo
  } catch {}
  mudarModo(modo)
  const alvo = lerHash()
  mostrarLista(alvo?.colecao || "notas")
  await carregarListas()
  if (alvo) await abrir(alvo.colecao, alvo.id)
})()
