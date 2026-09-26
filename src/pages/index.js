import * as React from "react"
import { graphql, Link } from "gatsby"

import Seo from "../components/seo"
import Topo from "../components/topo"
import Rodape from "../components/rodape"
import Email from "../components/email"
import Selo from "../components/selo"
import { Regua, Rotulo } from "../components/pecas"
import Flutuantes from "../components/flutuantes"
import {
  CenaHeroi,
  CenaAssunto,
  CenaEstante,
  CenaCaderno,
  CenaRobo,
} from "../components/cenas"
import palestras from "../data/palestras"
import { mesAno } from "../utils/data"
import site from "../config/site"
import "../styles/style.css"

const ASSUNTOS = [
  {
    titulo: "Engenharia de Software",
    linha: "Entrega, qualidade e o custo real de cada decisão.",
  },
  {
    titulo: "Arquitetura de Software",
    linha: "Fronteiras, acoplamento e o que sustenta produção.",
  },
  {
    titulo: "IA aplicada no time",
    linha: "O que acelerou, o que encareceu e onde ainda atrapalha.",
  },
  {
    titulo: "Gestão de times de tecnologia",
    linha:
      "Contratar bem, dar ritmo e ter as conversas difíceis na hora certa.",
  },
]

/** Card de assunto: a cena só se move enquanto o ponteiro está em cima. */
const Assunto = ({ indice, titulo, linha }) => {
  const [on, setOn] = React.useState(false)
  return (
    // O hover só move as peças da cena (decorativa); o conteúdo do card não
    // depende dele, então não há ação a expor para teclado.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <li
      className="assunto"
      onMouseEnter={() => setOn(true)}
      onMouseLeave={() => setOn(false)}
    >
      <CenaAssunto indice={indice} on={on} />
      <div className="assunto__texto">
        <h3 className="assunto__titulo">{titulo}</h3>
        <p className="assunto__linha">{linha}</p>
      </div>
    </li>
  )
}

const plural = (n, um, muitos) => `${n} ${n === 1 ? um : muitos}`

const Home = ({ data }) => {
  const textos = data.textos.nodes
  const temas = data.temas.nodes
  const [contato, setContato] = React.useState(false)
  // Linha de texto em hover: a estante ao lado puxa o livro dela.
  const [livro, setLivro] = React.useState(-1)

  // Quantas notas cada tema tem abaixo dele (a árvore inteira, não só filhos).
  const notasPorTema = React.useMemo(() => {
    const m = new Map()
    data.notas.nodes.forEach(n => {
      if (n.fields.nivel === 0) return
      m.set(n.fields.tema, (m.get(n.fields.tema) || 0) + 1)
    })
    return m
  }, [data.notas.nodes])

  // Linha do tempo em estilo log: ano vazio = mesma safra da anterior (nó menor).
  const log = palestras.map((p, i) => ({ ...p, i, novoAno: Boolean(p.ano) }))

  return (
    <>
      <a className="pular" href="#conteudo">
        Ir para o conteúdo
      </a>
      <Topo />

      <main id="conteudo" className="inicio grade">
        <Flutuantes />
        <section className="heroi" id="topo" aria-labelledby="nome-victor">
          <div className="heroi__texto">
            <div className="heroi__kicker">
              <p>{site.papel}</p>
              <Regua />
            </div>
            <h1 className="heroi__nome" id="nome-victor">
              <span>Victor</span>
              <span>Martinez</span>
            </h1>
            <p className="heroi__lead">
              Construo software desde 2012, peça a peça. Hoje lidero times que
              transformam esses blocos em resultado, e cada entrega deixa um
              aprendizado novo na pilha.
            </p>
          </div>
          <CenaHeroi />
        </section>

        <section className="secao" id="sobre" aria-labelledby="tit-sobre">
          <div className="interno">
            <Rotulo num="02" nome="Sobre mim" />
            <h2 className="titulo titulo--folga" id="tit-sobre">
              Desde 2012 construindo coisas que precisam ficar de pé.
            </h2>
            <div className="sobre">
              <div className="sobre__foto-col">
                <img
                  className="sobre__foto"
                  src="/assets/img/hero-victor-wide.jpg"
                  srcSet="/assets/img/hero-victor-wide-1080.jpg 1080w, /assets/img/hero-victor-wide.jpg 1536w"
                  sizes="(min-width: 900px) 58vw, 100vw"
                  alt="Victor Martinez, de camiseta preta, trabalhando no MacBook sobre uma mesa de madeira"
                  width="1536"
                  height="1024"
                  decoding="async"
                />
              </div>
              <div className="sobre__prosa">
                <p>
                  Comecei mantendo centenas de crawlers que rodavam todo dia
                  para manter a maior base de documentos jurídicos do Brasil.
                  Depois vieram sistemas complexos envolvendo contabilidade.
                  Aprendi que sistemas importantes podem (e devem) ser
                  construídos progressivamente,{" "}
                  <strong>release após release</strong>, com uma base forte de
                  engenharia.
                </p>
                <p>
                  Participei da construção de uma plataforma de pedidos take
                  away em praças de alimentação comprada pela Alelo. Fui o
                  primeiro engenheiro de um produto de crédito que suportava a
                  emissão de{" "}
                  <strong>centenas de milhares de contratos por dia</strong>.
                  Experiências que só se sustentaram com decisões defensivas e
                  tomadas cuidadosamente com o time.
                </p>
                <p>
                  Hoje lidero um time de engenharia como Head de Engenharia. O
                  trabalho é o mesmo de sempre em outra escala. Eu gerencio
                  lideranças, contribuo com arquiteturas robustas,{" "}
                  <strong>decido junto com o time</strong> e coleciono
                  aprendizados ao longo do caminho.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="secao" id="assuntos" aria-labelledby="tit-assuntos">
          <div className="interno">
            <Rotulo num="03" nome="Assuntos" />
            <h2 className="titulo titulo--folga" id="tit-assuntos">
              Quatro assuntos que eu acompanho de perto.
            </h2>
            <ul className="assuntos">
              {ASSUNTOS.map((a, i) => (
                <Assunto
                  indice={i}
                  titulo={a.titulo}
                  linha={a.linha}
                  key={a.titulo}
                />
              ))}
            </ul>
          </div>
        </section>

        <section
          className="secao"
          id="palestras"
          aria-labelledby="tit-palestras"
        >
          <div className="interno">
            <Rotulo num="04" nome="Palestras" />
            <h2 className="titulo" id="tit-palestras">
              Palestras e conversas ao longo do caminho.
            </h2>
            <p className="lead lead--lista">
              Desde 2016, em eventos, meetups e dentro de empresas.
            </p>
            <div className="log" data-evita="">
              <ol className="log__lista">
                {log.map(p => (
                  <li className="log__item" key={`${p.titulo}-${p.i}`}>
                    <span className="log__linha" aria-hidden="true" />
                    <span
                      className={
                        p.novoAno ? "log__no" : "log__no log__no--menor"
                      }
                      aria-hidden="true"
                    />
                    <span className="log__ano">{p.ano}</span>
                    <span className="log__texto">
                      <span className="log__evento">{p.evento}</span>
                      <span className="log__titulo">{p.titulo}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="secao" id="textos" aria-labelledby="tit-textos">
          <div className="interno estudos">
            <div>
              <Rotulo num="05" nome="Textos" />
              <h2 className="titulo" id="tit-textos">
                Textos
              </h2>
              <p className="lead lead--temas">
                Textos mais longos, sem periodicidade.
              </p>
              {textos.length > 0 ? (
                <>
                  <ul className="temas">
                    {textos.map((t, i) => (
                      <li key={t.id}>
                        <Link
                          className="tema"
                          to={`/textos/${t.fields.slug}/`}
                          onMouseEnter={() => setLivro(i)}
                          onMouseLeave={() => setLivro(-1)}
                        >
                          <span className="tema__nome">
                            {t.frontmatter.title}
                          </span>
                          <span className="tema__meta tema__meta--fixa">
                            {mesAno(t.frontmatter.date)} · {t.timeToRead} min
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link className="botao botao--solto" to="/textos/">
                    Todos os textos →
                  </Link>
                </>
              ) : (
                <p className="vazio">› nada publicado por aqui ainda</p>
              )}
            </div>
            <CenaEstante livro={livro} />
          </div>
        </section>

        <section className="secao" id="notas" aria-labelledby="tit-notas">
          <div className="interno estudos">
            <div>
              <Rotulo num="06" nome="Estudos" />
              <h2 className="titulo" id="tit-notas">
                Notas de estudo
              </h2>
              <p className="lead lead--temas">
                Anotações dos meus estudos, por tema — algumas em aberto, outras
                já revisadas.
              </p>
              {temas.length > 0 ? (
                <>
                  <ul className="temas">
                    {temas.map(t => {
                      const n = notasPorTema.get(t.fields.tema) || 0
                      return (
                        <li key={t.id}>
                          <Link className="tema" to={t.fields.caminho}>
                            <span className="tema__nome">
                              {t.frontmatter.title}
                            </span>
                            <span className="tema__meta">
                              {n > 0 ? (
                                <span>{plural(n, "nota", "notas")}</span>
                              ) : null}
                              <Selo maturidade={t.frontmatter.maturidade} />
                            </span>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                  <Link className="botao botao--solto" to="/notas-de-estudo/">
                    Todas as notas →
                  </Link>
                </>
              ) : (
                <p className="vazio">› nada por aqui ainda</p>
              )}
            </div>
            <CenaCaderno />
          </div>
        </section>

        <section className="secao" id="contato" aria-labelledby="tit-contato">
          {/* Idem: o hover só anima o robô. */}
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
          <div
            className="interno contato"
            onMouseEnter={() => setContato(true)}
            onMouseLeave={() => setContato(false)}
          >
            <div className="contato__texto">
              <div>
                <Rotulo num="07" nome="Contato" />
                <h2 className="contato__titulo" id="tit-contato">
                  Para conversar, palestrar ou aconselhar,
                </h2>
                <p className="lead lead--contato">
                  me mande um e-mail ou me chame no LinkedIn.
                </p>
              </div>
              <div className="contato__acoes">
                <Email className="botao" />
                <a
                  className="botao botao--nevoa"
                  href={site.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn →
                </a>
              </div>
            </div>
            <CenaRobo on={contato} />
          </div>
        </section>
      </main>

      <Rodape grade />
    </>
  )
}

export default Home

export const Head = () => <Seo tipo="profile" caminho="/" />

export const query = graphql`
  {
    textos: allMarkdownRemark(
      filter: {
        fields: { colecao: { eq: "blog" } }
        frontmatter: { publicado: { eq: true } }
      }
      sort: { frontmatter: { date: DESC } }
      limit: 3
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
    temas: allMarkdownRemark(
      filter: {
        fields: { colecao: { eq: "notas" }, nivel: { eq: 0 } }
        frontmatter: { publicado: { ne: false } }
      }
      sort: { frontmatter: { atualizado: DESC } }
      limit: 6
    ) {
      nodes {
        id
        fields {
          caminho
          tema
        }
        frontmatter {
          title
          maturidade
        }
      }
    }
    notas: allMarkdownRemark(
      filter: {
        fields: { colecao: { eq: "notas" } }
        frontmatter: { publicado: { ne: false } }
      }
    ) {
      nodes {
        fields {
          tema
          nivel
        }
      }
    }
  }
`
