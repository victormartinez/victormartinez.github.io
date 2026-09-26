import * as React from "react"
import { graphql, Link } from "gatsby"

import Seo from "../components/seo"
import Topo from "../components/topo"
import Rodape from "../components/rodape"
import AvisoIdade from "../components/aviso-idade"
import Indice, { SECOES_PARA_INDICE } from "../components/indice"
import { Regua, Progresso, PilhaFim } from "../components/pecas"
import { useLeitura } from "../utils/leitura"
import { dataLonga, iso8601, mesAno } from "../utils/data"
import "../styles/style.css"

const Texto = ({ data }) => {
  const texto = data.markdownRemark
  const vizinhos = data.vizinhos.nodes
  const { title, category, date, nota } = texto.frontmatter
  const secoes = texto.headings

  const corpoRef = React.useRef(null)
  const { fracao, ativa, fim } = useLeitura(corpoRef)
  const temIndice = secoes.length >= SECOES_PARA_INDICE

  return (
    <>
      <a className="pular" href="#conteudo">
        Ir para o conteúdo
      </a>
      <Topo voltar={{ to: "/textos/", rotulo: "← Textos" }}>
        <Progresso fracao={fracao} />
      </Topo>

      <main id="conteudo" className="pagina">
        <article>
          <header className="cabecalho grade">
            <div className="cabecalho__interno cabecalho__interno--leitura">
              {category ? (
                <p className="cabecalho__kicker">{category}</p>
              ) : null}
              <Regua />
              <h1 className="cabecalho__titulo cabecalho__titulo--texto">
                {title}
              </h1>
              <div className="cabecalho__meta">
                <span>
                  <time dateTime={iso8601(date)}>{dataLonga(date)}</time> · ~
                  {texto.timeToRead} min de leitura
                </span>
                {nota ? <span className="cabecalho__nota">{nota}</span> : null}
              </div>
            </div>
          </header>

          <div className="leitura">
            <div className="leitura__interno leitura__interno--texto">
              <Indice
                titulo="Neste texto"
                secoes={secoes}
                ativa={ativa}
                fim={fim}
                rotulo={
                  fim
                    ? "› montado ✓"
                    : `› peça ${ativa + 1} de ${secoes.length}`
                }
              />
              <div
                className={temIndice ? "post" : "post post--solto"}
                ref={corpoRef}
              >
                <AvisoIdade tipo="texto" data={date} />
                <div
                  className="post__corpo"
                  dangerouslySetInnerHTML={{ __html: texto.html }}
                />
                <footer className="post__fim">
                  <div className="post__fim-esq">
                    <Regua clara />
                    <Link className="post__voltar" to="/textos/">
                      ← Voltar para os textos
                    </Link>
                  </div>
                  <PilhaFim />
                </footer>
              </div>
            </div>
          </div>
        </article>

        {vizinhos.length > 0 ? (
          <section className="proximos" aria-label="Outros textos">
            <div className="proximos__interno">
              {vizinhos.map(v => (
                <Link
                  className="cartao-claro"
                  to={`/textos/${v.fields.slug}/`}
                  key={v.id}
                >
                  <span className="cartao-claro__meta">
                    {mesAno(v.frontmatter.date)} · {v.timeToRead} min
                  </span>
                  <span className="cartao-claro__titulo">
                    {v.frontmatter.title}
                  </span>
                  <span className="cartao-claro__resumo">
                    {v.frontmatter.description || v.excerpt}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </main>

      <Rodape />
    </>
  )
}

export default Texto

export const Head = ({ data }) => {
  const t = data.markdownRemark
  return (
    <Seo
      titulo={t.frontmatter.title}
      descricao={t.frontmatter.description || t.excerpt}
      caminho={`/textos/${t.fields.slug}/`}
      tipo="article"
    />
  )
}

export const query = graphql`
  query ($id: String!, $vizinhos: [String]!) {
    markdownRemark(id: { eq: $id }) {
      html
      timeToRead
      excerpt(pruneLength: 160)
      headings(depth: h2) {
        id
        value
      }
      fields {
        slug
      }
      frontmatter {
        title
        description
        category
        nota
        date
      }
    }
    vizinhos: allMarkdownRemark(
      filter: { id: { in: $vizinhos } }
      sort: { frontmatter: { date: DESC } }
    ) {
      nodes {
        id
        timeToRead
        excerpt(pruneLength: 120)
        fields {
          slug
        }
        frontmatter {
          title
          description
          date
        }
      }
    }
  }
`
