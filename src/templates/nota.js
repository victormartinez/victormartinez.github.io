import * as React from "react"
import { graphql, Link } from "gatsby"

import Seo from "../components/seo"
import Topo from "../components/topo"
import Rodape from "../components/rodape"
import Selo, { SeloComGlosa } from "../components/selo"
import AvisoIdade from "../components/aviso-idade"
import { dataLonga, iso8601 } from "../utils/data"
import "../styles/style.css"

/** Só vale a pena montar sumário quando a nota tem seções de verdade. */
const SECOES_PARA_SUMARIO = 3

const Nota = ({ data, pageContext }) => {
  const nota = data.markdownRemark
  const filhos = data.filhos.nodes
  const { trilha, paiCaminho, paiTitulo } = pageContext
  const { title, description, maturidade, atualizado } = nota.frontmatter

  const secoes = (nota.tableOfContents.match(/<li>/g) || []).length
  const temSumario = secoes >= SECOES_PARA_SUMARIO

  return (
    <>
      <a className="pular" href="#conteudo">
        Ir para o conteúdo
      </a>
      <Topo voltar={{ to: paiCaminho, rotulo: `← ${paiTitulo}` }} />

      <main id="conteudo">
        <article>
          <header className="post__topo grao colunas">
            <div className="post__topo-interno">
              <nav className="trilha" aria-label="Trilha">
                <Link to="/notas-de-estudo/">Notas de estudo</Link>
                {trilha.map(a => (
                  <React.Fragment key={a.caminho}>
                    <span className="trilha__sep" aria-hidden="true">
                      /
                    </span>
                    <Link to={a.caminho}>{a.titulo}</Link>
                  </React.Fragment>
                ))}
              </nav>
              <h1 className="post__titulo">{title}</h1>
              <p className="post__meta">
                <SeloComGlosa maturidade={maturidade} />
                {atualizado ? (
                  <>
                    {" · "}
                    atualizada em{" "}
                    <time dateTime={iso8601(atualizado)}>
                      {dataLonga(atualizado)}
                    </time>
                  </>
                ) : null}
              </p>
              {description ? <p className="post__nota">{description}</p> : null}
            </div>
          </header>

          <div className="post">
            <div className="post__interno">
              <AvisoIdade tipo="nota" data={atualizado} />
              {temSumario ? (
                <nav className="sumario" aria-label="Sumário desta nota">
                  <p className="sumario__titulo">Nesta página</p>
                  <div
                    dangerouslySetInnerHTML={{ __html: nota.tableOfContents }}
                  />
                </nav>
              ) : null}

              <div
                className="post__corpo"
                dangerouslySetInnerHTML={{ __html: nota.html }}
              />

              {filhos.length > 0 ? (
                <section className="desdobra" aria-labelledby="tit-desdobra">
                  <h2 className="desdobra__titulo" id="tit-desdobra">
                    Se desdobra em
                  </h2>
                  <ul className="lista">
                    {filhos.map(f => (
                      <li key={f.id}>
                        <Link className="lista__item" to={f.fields.caminho}>
                          <span className="lista__meta">
                            <Selo maturidade={f.frontmatter.maturidade} />
                          </span>
                          <span>
                            <span className="lista__titulo">
                              {f.frontmatter.title}
                            </span>
                            {f.frontmatter.description ? (
                              <span className="lista__resumo">
                                {f.frontmatter.description}
                              </span>
                            ) : null}
                          </span>
                          <span className="lista__seta" aria-hidden="true">
                            →
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              <footer className="post__fim">
                <Link className="post__voltar" to={paiCaminho}>
                  ← Voltar para {paiTitulo}
                </Link>
              </footer>
            </div>
          </div>
        </article>
      </main>

      <Rodape solto />
    </>
  )
}

export default Nota

export const Head = ({ data }) => {
  const n = data.markdownRemark
  return (
    <Seo
      titulo={n.frontmatter.title}
      descricao={n.frontmatter.description || n.excerpt}
      caminho={n.fields.caminho}
      tipo="article"
    />
  )
}

export const query = graphql`
  query ($id: String!, $globFilhos: String!, $nivelFilhos: Int!) {
    markdownRemark(id: { eq: $id }) {
      html
      tableOfContents(maxDepth: 2)
      excerpt(pruneLength: 160)
      fields {
        caminho
      }
      frontmatter {
        title
        description
        maturidade
        atualizado
      }
    }
    filhos: allMarkdownRemark(
      filter: {
        fields: {
          colecao: { eq: "notas" }
          slug: { glob: $globFilhos }
          nivel: { eq: $nivelFilhos }
        }
        frontmatter: { publicado: { ne: false } }
      }
      sort: [{ frontmatter: { ordem: ASC } }, { frontmatter: { title: ASC } }]
    ) {
      nodes {
        id
        fields {
          caminho
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
