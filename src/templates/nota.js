import * as React from "react"
import { graphql, Link } from "gatsby"

import Seo from "../components/seo"
import Topo from "../components/topo"
import Rodape from "../components/rodape"
import Selo, { SeloComGlosa } from "../components/selo"
import AvisoIdade from "../components/aviso-idade"
import Indice, { SECOES_PARA_INDICE } from "../components/indice"
import { Regua } from "../components/pecas"
import { useLeitura, useCopiarComandos } from "../utils/leitura"
import { dataCurta, iso8601 } from "../utils/data"
import "../styles/style.css"

const plural = (n, um, muitos) => `${n} ${n === 1 ? um : muitos}`

const Nota = ({ data, pageContext }) => {
  const nota = data.markdownRemark
  const filhos = data.filhos.nodes
  const { trilha, paiCaminho, paiTitulo } = pageContext
  const { title, description, maturidade, atualizado } = nota.frontmatter
  const secoes = nota.headings

  const corpoRef = React.useRef(null)
  const { ativa, fim } = useLeitura(corpoRef)
  useCopiarComandos(corpoRef)

  const temIndice = secoes.length >= SECOES_PARA_INDICE
  const temLateral = filhos.length > 0 || trilha.length > 0

  return (
    <>
      <a className="pular" href="#conteudo">
        Ir para o conteúdo
      </a>
      <Topo voltar={{ to: paiCaminho, rotulo: `← ${paiTitulo}` }} />

      <main id="conteudo" className="pagina">
        <article>
          <header className="cabecalho cabecalho--nota grade">
            <div className="cabecalho__interno">
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
              <h1 className="cabecalho__titulo cabecalho__titulo--nota">
                {title}
              </h1>
              {description ? (
                <p className="cabecalho__lead cabecalho__lead--nota">
                  {description}
                </p>
              ) : null}
              <div className="cabecalho__meta cabecalho__meta--selo">
                <SeloComGlosa maturidade={maturidade} />
                <span>
                  {filhos.length > 0
                    ? `${plural(filhos.length, "nota", "notas")} · `
                    : ""}
                  {atualizado ? (
                    <>
                      atualizada em{" "}
                      <time dateTime={iso8601(atualizado)}>
                        {dataCurta(atualizado)}
                      </time>
                    </>
                  ) : null}
                </span>
              </div>
            </div>
          </header>

          <div className="leitura leitura--nota">
            <div className="leitura__interno">
              <Indice
                titulo="Nesta nota"
                secoes={secoes}
                ativa={ativa}
                fim={fim}
                numerado
              />

              <div
                className={
                  temIndice || temLateral ? "post" : "post post--solto"
                }
                ref={corpoRef}
              >
                <AvisoIdade tipo="nota" data={atualizado} />
                <div
                  className="post__corpo post__corpo--nota"
                  dangerouslySetInnerHTML={{ __html: nota.html }}
                />
                <footer className="post__fim">
                  <div className="post__fim-esq">
                    <Regua clara />
                    <Link className="post__voltar" to={paiCaminho}>
                      ← Voltar para {paiTitulo}
                    </Link>
                  </div>
                </footer>
              </div>

              {temLateral ? (
                <aside className="lateral">
                  {filhos.length > 0 ? (
                    <div className="lateral__bloco">
                      <p className="lateral__titulo">Se desdobra em</p>
                      {filhos.map(f => (
                        <Link
                          className="lateral__link"
                          to={f.fields.caminho}
                          key={f.id}
                        >
                          <span>{f.frontmatter.title}</span>
                          <Selo maturidade={f.frontmatter.maturidade} />
                        </Link>
                      ))}
                    </div>
                  ) : null}
                  {trilha.length > 0 ? (
                    <div className="lateral__bloco">
                      <p className="lateral__titulo">Faz parte de</p>
                      <Link className="lateral__destaque" to={paiCaminho}>
                        {paiTitulo}
                      </Link>
                    </div>
                  ) : null}
                </aside>
              ) : null}
            </div>
          </div>
        </article>
      </main>

      <Rodape />
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
      excerpt(pruneLength: 160)
      headings(depth: h2) {
        id
        value
      }
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
          maturidade
        }
      }
    }
  }
`
