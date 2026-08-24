import * as React from "react"
import { graphql, Link } from "gatsby"

import Seo from "../components/seo"
import Topo from "../components/topo"
import Rodape from "../components/rodape"
import Campo from "../components/campo"
import Email from "../components/email"
import palestras from "../data/palestras"
import { mesAno } from "../utils/data"
import site from "../config/site"
import "../styles/style.css"

const ASSUNTOS = [
  {
    num: "01",
    spot: "spot-engenharia-claro.svg",
    titulo: "Engenharia de Software",
    linha: "Entrega, qualidade e o custo real de cada decisão.",
  },
  {
    num: "02",
    spot: "spot-arquitetura-claro.svg",
    titulo: "Arquitetura de Software",
    linha: "Fronteiras, acoplamento e o que sustenta produção.",
  },
  {
    num: "03",
    spot: "spot-ia-claro.svg",
    titulo: "IA aplicada no time",
    linha: "O que acelerou, o que encareceu e onde ainda atrapalha.",
  },
  {
    num: "04",
    spot: "spot-gestao-claro.svg",
    titulo: "Gestão de times de tecnologia",
    linha: "Contratar bem, dar ritmo e ter as conversas difíceis na hora certa.",
  },
]

const Home = ({ data }) => {
  const textos = data.allMarkdownRemark.nodes

  return (
    <>
      <a className="pular" href="#conteudo">
        Ir para o conteúdo
      </a>
      <Topo />

      <main id="conteudo">
        <section className="heroi grao" id="topo" aria-labelledby="nome-victor">
          <Campo densidade={1000} forca={5.2} />
          <div className="heroi__conteudo">
            <h1 className="heroi__nome" id="nome-victor">
              <span>Victor</span>
              <span>Martinez</span>
            </h1>
            <div className="heroi__base">
              <p className="heroi__lead">
                Construo software há doze anos e lidero times há quatro. De vez em
                quando escrevo sobre o que vivo nesse trabalho — engenharia,
                arquitetura, gestão e IA aplicada.
              </p>
              <p className="heroi__dica">passe o mouse pelo campo</p>
            </div>
          </div>
        </section>

        <section
          className="secao bloco--giz"
          id="sobre"
          aria-labelledby="tit-sobre"
        >
          <div className="interno">
            <div className="regua">
              <span className="regua__num">02</span>
              <span className="regua__linha" aria-hidden="true"></span>
              <span className="regua__nome">Sobre mim</span>
            </div>
            <div className="sobre">
              <div className="sobre__col">
                <h2 className="titulo" id="tit-sobre">
                  Doze anos construindo coisas que precisam ficar de pé.
                </h2>
                <img
                  className="sobre__foto"
                  src="/assets/img/hero-victor-wide.jpg"
                  srcSet="/assets/img/hero-victor-wide-1080.jpg 1080w, /assets/img/hero-victor-wide.jpg 1536w"
                  sizes="(min-width: 900px) 50vw, 100vw"
                  alt="Victor Martinez, de camiseta preta, trabalhando no MacBook sobre uma mesa de madeira"
                  width="1536"
                  height="1024"
                  decoding="async"
                />
              </div>
              <div className="sobre__prosa">
                <p>
                  Comecei mantendo centenas de crawlers que rodavam todo dia para
                  manter a maior base de documentos jurídicos do Brasil. Depois
                  vieram sistemas complexos envolvendo contabilidade. Aprendi que
                  sistemas importantes podem (e devem) ser construídos
                  progressivamente, <strong>release após release</strong>, com uma
                  base forte de engenharia.
                </p>
                <p>
                  Participei da construção de uma plataforma de pedidos take away em
                  praças de alimentação comprada pela Alelo. Fui o primeiro
                  engenheiro de um produto de crédito que suportava a emissão de{" "}
                  <strong>centenas de milhares de contratos por dia</strong>.
                  Experiências que só se sustentaram com decisões defensivas e
                  tomadas cuidadosamente com o time.
                </p>
                <p>
                  Hoje lidero um time de engenharia como Head de Engenharia. O
                  trabalho é o mesmo de sempre em outra escala. Eu gerencio
                  lideranças, contribuo com arquiteturas robustas,{" "}
                  <strong>decido junto com o time</strong> e coleciono aprendizados
                  ao longo do caminho.
                </p>
                <div className="numeros">
                  <div className="numero">
                    <p className="numero__valor">+12</p>
                    <p className="numero__rotulo">anos de código</p>
                  </div>
                  <div className="numero">
                    <p className="numero__valor">+04</p>
                    <p className="numero__rotulo">liderando times</p>
                  </div>
                  <div className="numero">
                    <p className="numero__valor">+5</p>
                    <p className="numero__rotulo">startups impactadas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="secao bloco--ameixa"
          id="assuntos"
          aria-labelledby="tit-assuntos"
        >
          <div className="interno">
            <div className="regua">
              <span className="regua__num">03</span>
              <span className="regua__linha" aria-hidden="true"></span>
              <span className="regua__nome">Assuntos</span>
            </div>
            <h2 className="titulo" id="tit-assuntos">
              Quatro assuntos que eu acompanho de perto.
            </h2>
            <ul className="assuntos">
              {ASSUNTOS.map(a => (
                <li className="assunto" key={a.num}>
                  <p className="assunto__num">{a.num}</p>
                  <img
                    className="assunto__spot"
                    src={`/assets/img/${a.spot}`}
                    alt=""
                    width="132"
                    height="132"
                    loading="lazy"
                    decoding="async"
                    aria-hidden="true"
                  />
                  <h3 className="assunto__titulo">{a.titulo}</h3>
                  <p className="assunto__linha">{a.linha}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          className="secao secao--compacta bloco--giz"
          id="palestras"
          aria-labelledby="tit-palestras"
        >
          <div className="interno">
            <div className="regua">
              <span className="regua__num">04</span>
              <span className="regua__linha" aria-hidden="true"></span>
              <span className="regua__nome">Palestras</span>
            </div>
            <h2 className="titulo" id="tit-palestras">
              Palestras e conversas ao longo do caminho.
            </h2>
            <p className="lead">Desde 2016, em eventos, meetups e dentro de empresas.</p>
            <ul className="palestras">
              {palestras.map((p, i) => (
                <li className="palestra" key={`${p.titulo}-${i}`}>
                  <span className="palestra__ano">{p.ano}</span>
                  <span className="palestra__evento">{p.evento}</span>
                  <span className="palestra__titulo">{p.titulo}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          className="secao bloco--nevoa"
          id="textos"
          aria-labelledby="tit-textos"
        >
          <div className="interno">
            <div className="regua">
              <span className="regua__num">05</span>
              <span className="regua__linha" aria-hidden="true"></span>
              <span className="regua__nome">Textos</span>
            </div>
            <h2 className="titulo" id="tit-textos">
              Textos
            </h2>
            <p className="lead">Textos mais longos, sem periodicidade.</p>
            {textos.length > 0 ? (
              <ul className="lista" style={{ marginTop: "clamp(36px, 4.6vw, 56px)" }}>
                {textos.map(t => (
                  <li key={t.id}>
                    <Link className="lista__item" to={`/textos/${t.fields.slug}/`}>
                      <span className="lista__meta">
                        {mesAno(t.frontmatter.date)} · {t.timeToRead} min
                      </span>
                      <span>
                        <span className="lista__titulo">{t.frontmatter.title}</span>
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
              <p className="lead" style={{ marginTop: "clamp(36px, 4.6vw, 56px)" }}>
                Nada publicado por aqui ainda.
              </p>
            )}
            {textos.length > 0 ? (
              <Link className="todos" to="/textos/">
                Todos os textos →
              </Link>
            ) : null}
          </div>
        </section>

        <section
          className="secao bloco--ameixa"
          id="contato"
          aria-labelledby="tit-contato"
        >
          <div className="interno">
            <div className="regua">
              <span className="regua__num">06</span>
              <span className="regua__linha" aria-hidden="true"></span>
              <span className="regua__nome">Contato</span>
            </div>
            <div className="contato">
              <div className="contato__texto">
                <h2 className="contato__titulo" id="tit-contato">
                  Para conversar, palestrar ou aconselhar,
                </h2>
                <p className="contato__lead">
                  escreva para o e-mail abaixo ou me chame no LinkedIn.
                </p>
              </div>
              <div className="contato__links">
                <Email />
                <a href={site.linkedin} target="_blank" rel="noopener noreferrer">
                  linkedin.com/in/vcrmartinez
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Rodape />
    </>
  )
}

export default Home

export const Head = () => <Seo tipo="profile" caminho="/" />

export const query = graphql`
  {
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }, limit: 3) {
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
