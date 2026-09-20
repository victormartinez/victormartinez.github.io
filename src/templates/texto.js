import * as React from "react"
import { graphql, Link } from "gatsby"

import Seo from "../components/seo"
import Topo from "../components/topo"
import Rodape from "../components/rodape"
import AvisoIdade from "../components/aviso-idade"
import { dataLonga, iso8601 } from "../utils/data"
import "../styles/style.css"

const Texto = ({ data }) => {
  const texto = data.markdownRemark
  const { title, category, date, nota } = texto.frontmatter

  return (
    <>
      <a className="pular" href="#conteudo">
        Ir para o conteúdo
      </a>
      <Topo voltar={{ to: "/textos/", rotulo: "← Textos" }} />

      <main id="conteudo">
        <article>
          <header className="post__topo grao colunas">
            <div className="post__topo-interno">
              {category ? (
                <p className="post__kicker">
                  {category}
                  <span aria-hidden="true"></span>
                </p>
              ) : null}
              <h1 className="post__titulo">{title}</h1>
              <p className="post__meta">
                <time dateTime={iso8601(date)}>{dataLonga(date)}</time> · ~
                {texto.timeToRead} min de leitura
              </p>
              {nota ? <p className="post__nota">{nota}</p> : null}
            </div>
          </header>
          <div className="post">
            <div className="post__interno">
              <AvisoIdade tipo="texto" data={date} />
              <div
                className="post__corpo"
                dangerouslySetInnerHTML={{ __html: texto.html }}
              />
              <footer className="post__fim">
                <Link className="post__voltar" to="/textos/">
                  ← Voltar para os textos
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
  query ($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      timeToRead
      excerpt(pruneLength: 160)
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
  }
`
