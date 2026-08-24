import * as React from "react"
import { Link } from "gatsby"

import Seo from "../components/seo"
import Topo from "../components/topo"
import Rodape from "../components/rodape"
import "../styles/style.css"

const NaoEncontrada = () => (
  <>
    <a className="pular" href="#conteudo">
      Ir para o conteúdo
    </a>
    <Topo voltar={{ to: "/", rotulo: "← Início" }} />

    <main id="conteudo">
      <section className="arquivo grao colunas">
        <div className="interno" style={{ position: "relative" }}>
          <div className="regua">
            <span className="regua__num">404</span>
            <span className="regua__linha" aria-hidden="true"></span>
            <span className="regua__nome">Página não encontrada</span>
          </div>
          <h1 className="arquivo__titulo">Nada aqui.</h1>
          <p className="arquivo__lead">
            O endereço que você abriu não existe (ou não existe mais). Volte para o
            início ou dê uma olhada nos textos.
          </p>
        </div>
      </section>

      <section className="secao secao--compacta bloco--nevoa">
        <div className="interno">
          <ul className="lista">
            <li>
              <Link className="lista__item" to="/">
                <span className="lista__meta">Início</span>
                <span>
                  <span className="lista__titulo">Victor Martinez</span>
                  <span className="lista__resumo">
                    Sobre, assuntos, palestras, textos e contato.
                  </span>
                </span>
                <span className="lista__seta" aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
            <li>
              <Link className="lista__item" to="/textos/">
                <span className="lista__meta">Arquivo</span>
                <span>
                  <span className="lista__titulo">Todos os textos</span>
                  <span className="lista__resumo">
                    Textos mais longos, sem periodicidade.
                  </span>
                </span>
                <span className="lista__seta" aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </main>

    <Rodape solto />
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
