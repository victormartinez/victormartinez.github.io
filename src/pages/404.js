import * as React from "react"
import { Link } from "gatsby"

import Seo from "../components/seo"
import Topo from "../components/topo"
import Rodape from "../components/rodape"
import { Regua } from "../components/pecas"
import "../styles/style.css"

const ATALHOS = [
  {
    to: "/",
    meta: "Início",
    titulo: "Victor Martinez",
    resumo: "Sobre, assuntos, palestras, textos e contato.",
  },
  {
    to: "/textos/",
    meta: "Arquivo",
    titulo: "Todos os textos",
    resumo: "Textos mais longos, sem periodicidade.",
  },
  {
    to: "/notas-de-estudo/",
    meta: "Estudos",
    titulo: "Notas de estudo",
    resumo: "Anotações por tema, em aberto ou revisadas.",
  },
]

const NaoEncontrada = () => (
  <>
    <a className="pular" href="#conteudo">
      Ir para o conteúdo
    </a>
    <Topo voltar={{ to: "/", rotulo: "← Início" }} />

    <main id="conteudo" className="pagina">
      <section className="cabecalho grade">
        <div className="cabecalho__interno cabecalho__interno--leitura">
          <p className="cabecalho__kicker">404 · página não encontrada</p>
          <Regua />
          <h1 className="cabecalho__titulo">Nada aqui.</h1>
          <p className="cabecalho__lead">
            O endereço que você abriu não existe (ou não existe mais). Volte
            para o início ou dê uma olhada nos textos.
          </p>
        </div>
      </section>

      <section className="proximos">
        <div className="proximos__interno">
          {ATALHOS.map(a => (
            <Link className="cartao-claro" to={a.to} key={a.to}>
              <span className="cartao-claro__meta">{a.meta}</span>
              <span className="cartao-claro__titulo">{a.titulo}</span>
              <span className="cartao-claro__resumo">{a.resumo}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>

    <Rodape />
  </>
)

export default NaoEncontrada

export const Head = () => (
  <Seo
    titulo="Página não encontrada"
    descricao="O endereço que você abriu não existe."
    caminho="/404/"
  />
)
