import * as React from "react"
import { graphql, Link } from "gatsby"

import Seo from "../components/seo"
import Topo from "../components/topo"
import Rodape from "../components/rodape"
import Selo, { SeloLegenda } from "../components/selo"
import { normalizar, letraIndice, ALFABETO } from "../utils/texto"
import "../styles/style.css"

const plural = (n, um, muitos) => `${n} ${n === 1 ? um : muitos}`

/**
 * Índice das anotações de estudo.
 *
 * A navegação é por assunto, não por data: o A–Z é o índice mecânico (acha o
 * tema que você já sabe que existe) e o index.md de cada tema é o índice curado
 * (dá o caminho entre as notas de dentro). A busca é um filtro em memória sobre
 * o que o build já entregou — sem lib e sem índice para gerar.
 */
const NotasDeEstudo = ({ data }) => {
  const notas = data.allMarkdownRemark.nodes
  const [busca, setBusca] = React.useState("")

  const { temas, grupos, letrasComTema, totalNotas } = React.useMemo(() => {
    const temas = notas.filter(n => n.fields.nivel === 0)

    // Descendentes por tema: o contador do índice conta a árvore inteira, não
    // só os filhos diretos.
    const porTema = new Map(temas.map(t => [t.fields.tema, []]))
    notas.forEach(n => {
      if (n.fields.nivel === 0) return
      const lista = porTema.get(n.fields.tema)
      if (lista) lista.push(n)
    })

    const enriquecidos = temas.map(t => ({
      ...t,
      filhos: (porTema.get(t.fields.tema) || []).filter(
        n => n.fields.nivel === 1,
      ),
      totalDescendentes: (porTema.get(t.fields.tema) || []).length,
    }))

    const grupos = new Map()
    enriquecidos.forEach(t => {
      const letra = letraIndice(t.frontmatter.title)
      if (!grupos.has(letra)) grupos.set(letra, [])
      grupos.get(letra).push(t)
    })

    const ordenadas = [...grupos.keys()].sort((a, b) =>
      a === "#" ? -1 : b === "#" ? 1 : a.localeCompare(b),
    )

    return {
      temas: enriquecidos,
      grupos: ordenadas.map(letra => [letra, grupos.get(letra)]),
      letrasComTema: new Set(grupos.keys()),
      totalNotas: notas.length,
    }
  }, [notas])

  // Busca em todas as notas, não só nos temas: o que se procura costuma estar
  // numa sub-página.
  const resultados = React.useMemo(() => {
    const termo = normalizar(busca).trim()
    if (!termo) return null
    return notas.filter(n =>
      normalizar(
        `${n.frontmatter.title} ${n.frontmatter.description || ""} ${n.fields.slug}`,
      ).includes(termo),
    )
  }, [busca, notas])

  const buscando = resultados !== null

  return (
    <>
      <a className="pular" href="#conteudo">
        Ir para o conteúdo
      </a>
      <Topo voltar={{ to: "/#notas", rotulo: "← Voltar" }} />

      <main id="conteudo">
        <section className="arquivo grao colunas">
          <div className="interno" style={{ position: "relative" }}>
            <div className="regua">
              <span className="regua__num">06</span>
              <span className="regua__linha" aria-hidden="true"></span>
              <span className="regua__nome">Estudos</span>
            </div>
            <h1 className="arquivo__titulo arquivo__titulo--notas">
              Notas de estudo
            </h1>
            <p className="arquivo__lead">
              Resumos, fichamentos e rascunhos do que eu ando estudando. Não são
              textos acabados — eu volto neles para revisar.
            </p>
            <p className="arquivo__nota">
              {plural(temas.length, "tema", "temas")} ·{" "}
              {plural(totalNotas, "nota", "notas")}
            </p>
          </div>
        </section>

        <section className="secao bloco--nevoa">
          <div className="interno">
            {totalNotas === 0 ? (
              <p className="lead">Nada por aqui ainda.</p>
            ) : (
              <>
                <div className="notas__busca">
                  <label className="notas__rotulo" htmlFor="busca">
                    Buscar
                  </label>
                  <input
                    id="busca"
                    type="search"
                    className="notas__campo"
                    placeholder="filtrar por tema, título ou resumo…"
                    value={busca}
                    onChange={e => setBusca(e.target.value)}
                    autoComplete="off"
                  />
                </div>

                <SeloLegenda />

                <p className="notas__status" role="status" aria-live="polite">
                  {buscando
                    ? `${plural(resultados.length, "nota encontrada", "notas encontradas")}`
                    : ""}
                </p>

                {buscando ? (
                  resultados.length > 0 ? (
                    <ul className="lista">
                      {resultados.map(n => (
                        <li key={n.id}>
                          <Link className="lista__item" to={n.fields.caminho}>
                            <span className="lista__meta">
                              <Selo maturidade={n.frontmatter.maturidade} />
                            </span>
                            <span>
                              <span className="lista__titulo">
                                {n.frontmatter.title}
                              </span>
                              <span className="lista__resumo">
                                {n.frontmatter.description ||
                                  n.excerpt ||
                                  n.fields.slug}
                              </span>
                            </span>
                            <span className="lista__seta" aria-hidden="true">
                              →
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="lead">
                      Nenhuma nota com “{busca}”. Tente o nome do tema.
                    </p>
                  )
                ) : (
                  <>
                    <nav className="azbar" aria-label="Índice alfabético">
                      {(letrasComTema.has("#") ? ["#"] : [])
                        .concat(ALFABETO)
                        .map(l =>
                          letrasComTema.has(l) ? (
                            <a
                              className="azbar__letra"
                              href={`#letra-${l}`}
                              key={l}
                            >
                              {l}
                            </a>
                          ) : (
                            <span
                              className="azbar__letra azbar__letra--vazia"
                              aria-hidden="true"
                              key={l}
                            >
                              {l}
                            </span>
                          ),
                        )}
                    </nav>

                    {grupos.map(([letra, doGrupo]) => (
                      <section
                        className="grupo"
                        key={letra}
                        id={`letra-${letra}`}
                        aria-labelledby={`tit-letra-${letra}`}
                      >
                        <h2 className="grupo__letra" id={`tit-letra-${letra}`}>
                          {letra}
                        </h2>
                        <ul className="lista">
                          {doGrupo.map(t => (
                            <li key={t.id}>
                              <Link
                                className="lista__item"
                                to={t.fields.caminho}
                              >
                                <span className="lista__meta">
                                  <Selo maturidade={t.frontmatter.maturidade} />
                                  {t.totalDescendentes > 0 ? (
                                    <>
                                      {" · "}
                                      {plural(
                                        t.totalDescendentes,
                                        "nota",
                                        "notas",
                                      )}
                                    </>
                                  ) : null}
                                </span>
                                <span>
                                  <span className="lista__titulo">
                                    {t.frontmatter.title}
                                  </span>
                                  {t.frontmatter.description ? (
                                    <span className="lista__resumo">
                                      {t.frontmatter.description}
                                    </span>
                                  ) : null}
                                </span>
                                <span
                                  className="lista__seta"
                                  aria-hidden="true"
                                >
                                  →
                                </span>
                              </Link>
                              {t.filhos.length > 0 ? (
                                <ul className="tema__filhos">
                                  {t.filhos.map(f => (
                                    <li key={f.id}>
                                      <Link
                                        className="filho"
                                        to={f.fields.caminho}
                                      >
                                        <span aria-hidden="true">↳</span>{" "}
                                        {f.frontmatter.title}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              ) : null}
                            </li>
                          ))}
                        </ul>
                      </section>
                    ))}
                  </>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Rodape solto />
    </>
  )
}

export default NotasDeEstudo

export const Head = () => (
  <Seo
    titulo="Notas de estudo"
    descricao="Anotações de estudo de Victor Martinez: resumos, fichamentos e rascunhos por tema, com índice alfabético e busca."
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
        excerpt(pruneLength: 120)
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
        }
      }
    }
  }
`
