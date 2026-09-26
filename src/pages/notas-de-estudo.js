import * as React from "react"
import { graphql, Link } from "gatsby"

import Seo from "../components/seo"
import Topo from "../components/topo"
import Rodape from "../components/rodape"
import Selo, { estagioDe } from "../components/selo"
import { Regua, Pilha, PecaBotao } from "../components/pecas"
import { normalizar } from "../utils/texto"
import { dataCurta } from "../utils/data"
import "../styles/style.css"

const plural = (n, um, muitos) => `${n} ${n === 1 ? um : muitos}`

const FILTROS = [
  ["todas", "Todas"],
  ["em-aberto", "Em aberto"],
  ["revisada", "Revisadas"],
]

/**
 * Índice das anotações de estudo: cards por tema, filtro por estágio e busca.
 *
 * O card mostra a pilha de peças do tema — uma por nota abaixo dele, cheia
 * quando a nota está revisada. A busca cobre todas as notas, não só os temas:
 * o que se procura costuma estar numa sub-página.
 */
const NotasDeEstudo = ({ data }) => {
  const notas = data.allMarkdownRemark.nodes
  const [filtro, setFiltro] = React.useState("todas")
  const [busca, setBusca] = React.useState("")

  const temas = React.useMemo(() => {
    const porTema = new Map()
    notas.forEach(n => {
      if (n.fields.nivel === 0) return
      if (!porTema.has(n.fields.tema)) porTema.set(n.fields.tema, [])
      porTema.get(n.fields.tema).push(n)
    })
    return notas
      .filter(n => n.fields.nivel === 0)
      .map(t => {
        const abaixo = porTema.get(t.fields.tema) || []
        const datas = [t, ...abaixo]
          .map(n => n.frontmatter.atualizado)
          .filter(Boolean)
          .sort()
        return {
          ...t,
          estagio: estagioDe(t.frontmatter.maturidade),
          total: abaixo.length,
          pecas: (abaixo.length ? abaixo : [t]).map(
            n => estagioDe(n.frontmatter.maturidade) === "revisada",
          ),
          atualizado: datas.length ? datas[datas.length - 1] : null,
        }
      })
  }, [notas])

  const contagem = React.useMemo(
    () => ({
      todas: temas.length,
      "em-aberto": temas.filter(t => t.estagio === "em-aberto").length,
      revisada: temas.filter(t => t.estagio === "revisada").length,
    }),
    [temas],
  )

  const termo = normalizar(busca).trim()
  const buscando = termo.length > 0

  const resultados = React.useMemo(() => {
    if (!buscando) return null
    return notas.filter(n =>
      normalizar(
        `${n.frontmatter.title} ${n.frontmatter.description || ""} ${n.fields.slug}`,
      ).includes(termo),
    )
  }, [buscando, termo, notas])

  const visiveis = temas.filter(t => filtro === "todas" || t.estagio === filtro)

  return (
    <>
      <a className="pular" href="#conteudo">
        Ir para o conteúdo
      </a>
      <Topo voltar={{ to: "/#notas", rotulo: "← Início" }} />

      <main id="conteudo" className="pagina">
        <section className="cabecalho grade">
          <div className="cabecalho__interno">
            <p className="cabecalho__kicker">Estudos</p>
            <Regua />
            <h1 className="cabecalho__titulo">Notas de estudo</h1>
            <p className="cabecalho__lead cabecalho__lead--larga">
              Anotações dos meus estudos, por tema — algumas em aberto, outras
              já revisadas.
            </p>
          </div>
        </section>

        {notas.length > 0 ? (
          <div className="filtros">
            <div className="filtros__interno">
              <div
                className="filtros__grupo"
                role="group"
                aria-label="Filtrar por estágio"
              >
                {FILTROS.map(([chave, rotulo]) => (
                  <PecaBotao
                    ativo={chave === filtro}
                    onClick={() => setFiltro(chave)}
                    key={chave}
                  >
                    {rotulo} · {contagem[chave]}
                  </PecaBotao>
                ))}
              </div>
              <label className="busca">
                <span className="busca__barra" aria-hidden="true">
                  /
                </span>
                <input
                  type="search"
                  placeholder="Buscar nota"
                  aria-label="Buscar nota"
                  value={busca}
                  onChange={e => setBusca(e.target.value)}
                  autoComplete="off"
                />
              </label>
              <div className="legenda">
                <span className="legenda__item">
                  <span className="legenda__peca" aria-hidden="true" />
                  nota revisada
                </span>
                <span className="legenda__item">
                  <span
                    className="legenda__peca legenda__peca--vazia"
                    aria-hidden="true"
                  />
                  nota em aberto
                </span>
              </div>
            </div>
          </div>
        ) : null}

        <section className="arquivo">
          <div className="arquivo__interno">
            {notas.length === 0 ? (
              <p className="vazio">› nada por aqui ainda</p>
            ) : null}

            {buscando ? (
              <>
                <p className="vazio" role="status" aria-live="polite">
                  ›{" "}
                  {plural(
                    resultados.length,
                    "nota encontrada",
                    "notas encontradas",
                  )}{" "}
                  para "{busca}"
                </p>
                {resultados.length > 0 ? (
                  <ul className="notas-grade">
                    {resultados.map(n => (
                      <li key={n.id}>
                        <Link className="cartao-nota" to={n.fields.caminho}>
                          <span className="cartao-nota__corpo">
                            <span className="cartao-nota__meta">
                              <Selo maturidade={n.frontmatter.maturidade} />
                              {n.fields.nivel > 0 ? (
                                <span className="cartao-nota__area">
                                  {n.fields.slug
                                    .split("/")
                                    .slice(0, -1)
                                    .join(" / ")}
                                </span>
                              ) : null}
                            </span>
                            <span className="cartao-nota__tema">
                              {n.frontmatter.title}
                            </span>
                            {n.frontmatter.description ? (
                              <span className="cartao-nota__resumo">
                                {n.frontmatter.description}
                              </span>
                            ) : null}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </>
            ) : (
              <ul className="notas-grade">
                {visiveis.map(t => (
                  <li key={t.id}>
                    <Link className="cartao-nota" to={t.fields.caminho}>
                      <span className="cartao-nota__corpo">
                        <span className="cartao-nota__meta">
                          <Selo maturidade={t.frontmatter.maturidade} />
                        </span>
                        <span className="cartao-nota__tema">
                          {t.frontmatter.title}
                        </span>
                        {t.frontmatter.description ? (
                          <span className="cartao-nota__resumo">
                            {t.frontmatter.description}
                          </span>
                        ) : null}
                        <span className="cartao-nota__rodape">
                          {t.total > 0
                            ? `${plural(t.total, "nota", "notas")} · `
                            : ""}
                          {t.atualizado
                            ? `atualizada em ${dataCurta(t.atualizado)}`
                            : ""}
                        </span>
                      </span>
                      <Pilha pecas={t.pecas} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>

      <Rodape />
    </>
  )
}

export default NotasDeEstudo

export const Head = () => (
  <Seo
    titulo="Notas de estudo"
    descricao="Anotações de estudo de Victor Martinez: resumos, fichamentos e rascunhos por tema, com filtro por estágio e busca."
    caminho="/notas-de-estudo/"
  />
)

export const query = graphql`
  {
    allMarkdownRemark(
      filter: {
        fields: { colecao: { eq: "notas" } }
        frontmatter: { publicado: { ne: false } }
      }
      sort: [{ frontmatter: { ordem: ASC } }, { frontmatter: { title: ASC } }]
    ) {
      nodes {
        id
        fields {
          slug
          caminho
          tema
          nivel
        }
        frontmatter {
          title
          description
          maturidade
          atualizado
        }
      }
    }
  }
`
