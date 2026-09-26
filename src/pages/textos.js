import * as React from "react"
import { graphql, Link } from "gatsby"

import Seo from "../components/seo"
import Topo from "../components/topo"
import Rodape from "../components/rodape"
import { Regua, PecaMini, PecaBotao } from "../components/pecas"
import { mesAno, anoDe } from "../utils/data"
import { normalizar } from "../utils/texto"
import "../styles/style.css"

/** Cor do tijolo de cada categoria, na ordem em que as categorias aparecem. */
const CORES = ["#0B6A4C", "#19B183", "#6E6678", "#241A2E"]
const TODOS = "Todos"

/**
 * Arquivo de textos: filtro por categoria, busca e agrupamento por ano.
 * Tudo em memória sobre o que o build já entregou — sem lib, sem índice.
 */
const Textos = ({ data }) => {
  const textos = data.allMarkdownRemark.nodes
  const [cat, setCat] = React.useState(TODOS)
  const [busca, setBusca] = React.useState("")

  const { categorias, corDe } = React.useMemo(() => {
    const conta = new Map()
    textos.forEach(t => {
      const c = t.frontmatter.category
      if (c) conta.set(c, (conta.get(c) || 0) + 1)
    })
    const ordenadas = [...conta.entries()].sort((a, b) => b[1] - a[1])
    const cor = new Map(ordenadas.map(([c], i) => [c, CORES[i % CORES.length]]))
    return {
      categorias: [[TODOS, textos.length], ...ordenadas],
      corDe: c => cor.get(c) || CORES[0],
    }
  }, [textos])

  const anos = React.useMemo(() => {
    const q = normalizar(busca).trim()
    const lista = textos.filter(
      t =>
        (cat === TODOS || t.frontmatter.category === cat) &&
        (!q ||
          normalizar(
            `${t.frontmatter.title} ${t.frontmatter.description || ""} ${t.excerpt}`,
          ).includes(q)),
    )
    const grupos = []
    lista.forEach(t => {
      const ano = anoDe(t.frontmatter.date)
      let g = grupos.find(a => a.ano === ano)
      if (!g) grupos.push((g = { ano, itens: [] }))
      g.itens.push(t)
    })
    return grupos
  }, [textos, cat, busca])

  const n = textos.length
  const vazio = n > 0 && anos.length === 0

  return (
    <>
      <a className="pular" href="#conteudo">
        Ir para o conteúdo
      </a>
      <Topo voltar={{ to: "/#textos", rotulo: "← Início" }} />

      <main id="conteudo" className="pagina">
        <section className="cabecalho grade">
          <div className="cabecalho__interno cabecalho__interno--leitura">
            <p className="cabecalho__kicker">Textos</p>
            <Regua />
            <h1 className="cabecalho__titulo">Todos os textos</h1>
            <p className="cabecalho__lead">
              Textos mais longos sobre engenharia, arquitetura, gestão e IA
              aplicada. Sem periodicidade.
            </p>
          </div>
        </section>

        {n > 0 ? (
          <div className="filtros">
            <div className="filtros__interno filtros__interno--leitura">
              <div
                className="filtros__grupo"
                role="group"
                aria-label="Filtrar por categoria"
              >
                {categorias.map(([c, qtd]) => (
                  <PecaBotao
                    ativo={c === cat}
                    onClick={() => setCat(c)}
                    key={c}
                  >
                    {c} · {qtd}
                  </PecaBotao>
                ))}
              </div>
              <label className="busca">
                <span className="busca__barra" aria-hidden="true">
                  /
                </span>
                <input
                  type="search"
                  placeholder="Buscar texto"
                  aria-label="Buscar texto"
                  value={busca}
                  onChange={e => setBusca(e.target.value)}
                  autoComplete="off"
                />
              </label>
            </div>
          </div>
        ) : null}

        <section className="arquivo">
          <div className="arquivo__interno arquivo__interno--leitura">
            {n === 0 ? (
              <p className="vazio">› nada publicado por aqui ainda</p>
            ) : null}
            {vazio ? (
              <p className="vazio" role="status">
                › nenhuma peça encontrada para "{busca}"
              </p>
            ) : null}
            {anos.map(g => (
              <section
                className="ano"
                key={g.ano}
                aria-labelledby={`ano-${g.ano}`}
              >
                <div className="ano__cab">
                  <h2 className="ano__num" id={`ano-${g.ano}`}>
                    {g.ano}
                  </h2>
                  <div className="ano__pecas">
                    {g.itens.map(t => (
                      <PecaMini
                        cor={corDe(t.frontmatter.category)}
                        key={t.id}
                      />
                    ))}
                  </div>
                </div>
                <ul className="ano__lista">
                  {g.itens.map(t => (
                    <li className="ano__item" key={t.id}>
                      <Link
                        className="texto-linha"
                        to={`/textos/${t.fields.slug}/`}
                      >
                        <span className="texto-linha__corpo">
                          <span className="texto-linha__meta">
                            <span>
                              {mesAno(t.frontmatter.date)} · {t.timeToRead} min
                            </span>
                            {t.frontmatter.category ? (
                              <span className="texto-linha__cat">
                                <span
                                  className="texto-linha__cor"
                                  style={{
                                    background: corDe(t.frontmatter.category),
                                  }}
                                  aria-hidden="true"
                                />
                                {t.frontmatter.category}
                              </span>
                            ) : null}
                          </span>
                          <span className="texto-linha__titulo">
                            {t.frontmatter.title}
                          </span>
                          <span className="texto-linha__resumo">
                            {t.frontmatter.description || t.excerpt}
                          </span>
                        </span>
                        <span className="texto-linha__seta" aria-hidden="true">
                          →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </section>
      </main>

      <Rodape />
    </>
  )
}

export default Textos

export const Head = () => (
  <Seo
    titulo="Todos os textos"
    descricao="Todos os textos de Victor Martinez sobre engenharia, arquitetura, gestão e IA aplicada, do mais recente ao mais antigo."
    caminho="/textos/"
  />
)

export const query = graphql`
  {
    allMarkdownRemark(
      filter: {
        fields: { colecao: { eq: "blog" } }
        frontmatter: { publicado: { eq: true } }
      }
      sort: { frontmatter: { date: DESC } }
    ) {
      nodes {
        id
        timeToRead
        excerpt(pruneLength: 130)
        fields {
          slug
        }
        frontmatter {
          title
          description
          category
          date
        }
      }
    }
  }
`
