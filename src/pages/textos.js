import * as React from "react"
import { graphql, Link } from "gatsby"

import Seo from "../components/seo"
import Topo from "../components/topo"
import Rodape from "../components/rodape"
import { mesAno } from "../utils/data"
import "../styles/style.css"

const Textos = ({ data }) => {
  const textos = data.allMarkdownRemark.nodes
  const n = textos.length

  return (
    <>
      <a className="pular" href="#conteudo">
        Ir para o conteúdo
      </a>
      <Topo voltar={{ to: "/#textos", rotulo: "← Voltar" }} />

      <main id="conteudo">
        <section className="arquivo grao colunas">
          <div className="interno" style={{ position: "relative" }}>
            <div className="regua">
              <span className="regua__num">05</span>
              <span className="regua__linha" aria-hidden="true"></span>
              <span className="regua__nome">Arquivo</span>
            </div>
            <h1 className="arquivo__titulo">Textos</h1>
            <p className="arquivo__lead">
              Textos mais longos sobre engenharia, arquitetura, gestão e IA
              aplicada. Sem periodicidade.
            </p>
            <p className="arquivo__nota">
              {n} {n === 1 ? "texto" : "textos"} · engenharia e carreira
            </p>
          </div>
        </section>

        <section className="secao bloco--nevoa">
          <div className="interno">
            {n > 0 ? (
              <ul className="lista">
                {textos.map(t => (
                  <li key={t.id}>
                    <Link
                      className="lista__item"
                      to={`/textos/${t.fields.slug}/`}
                    >
                      <span className="lista__meta">
                        {mesAno(t.frontmatter.date)} · {t.timeToRead} min
                        {t.frontmatter.category ? (
                          <>
                            {" · "}
                            <span className="lista__tag">
                              {t.frontmatter.category}
                            </span>
                          </>
                        ) : null}
                      </span>
                      <span>
                        <span className="lista__titulo">
                          {t.frontmatter.title}
                        </span>
                        <span className="lista__resumo">
                          {t.frontmatter.description || t.excerpt}
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
              <p className="lead">Nada publicado por aqui ainda.</p>
            )}
          </div>
        </section>
      </main>

      <Rodape solto />
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
