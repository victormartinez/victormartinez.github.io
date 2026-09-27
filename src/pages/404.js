import * as React from "react"
import { Link } from "gatsby"

import Seo from "../components/seo"
import Topo from "../components/topo"
import Rodape from "../components/rodape"
import { Regua, Rotulo } from "../components/pecas"
import { CenaMuro } from "../components/cenas"
import "../styles/style.css"

/**
 * O endereço que não existe, lido depois de montar: no build esta página é
 * gerada uma vez só (/404.html) e o GitHub Pages a serve para qualquer URL
 * que falte, então quem sabe o caminho de verdade é o navegador. Abrir a
 * própria /404/ não mostra caminho nenhum.
 */
const useCaminhoPerdido = () => {
  const [caminho, setCaminho] = React.useState(null)
  React.useEffect(() => {
    const p = window.location.pathname
    if (p && p !== "/" && !/^\/404(\.html|\/)?$/.test(p)) {
      try {
        setCaminho(decodeURIComponent(p))
      } catch {
        setCaminho(p)
      }
    }
  }, [])
  return caminho
}

const NaoEncontrada = () => {
  const caminho = useCaminhoPerdido()

  return (
    <>
      <a className="pular" href="#conteudo">
        Ir para o conteúdo
      </a>
      <div className="perdida">
        <Topo voltar={{ to: "/", rotulo: "← Início" }} />

        <main id="conteudo" className="perdida__main grade">
          <div className="perdida__interno">
            <div>
              <Rotulo num="404" nome="Página não encontrada" />
              <Regua />
              <h1 className="cabecalho__titulo perdida__titulo">
                Essa peça não veio no kit.
              </h1>
              <p className="cabecalho__lead perdida__lead">
                {caminho ? (
                  <>
                    O endereço <code>{caminho}</code> não existe ou mudou de
                    lugar.
                  </>
                ) : (
                  "O endereço que você abriu não existe ou mudou de lugar."
                )}
              </p>
              <div className="perdida__acoes">
                <Link className="botao" to="/">
                  ← Voltar ao início
                </Link>
                <nav className="perdida__atalhos" aria-label="Outras páginas">
                  <Link to="/textos/">Textos</Link>
                  <Link to="/notas-de-estudo/">Notas</Link>
                  <Link to="/#contato">Contato</Link>
                </nav>
              </div>
            </div>

            <CenaMuro />
          </div>
        </main>

        <Rodape grade />
      </div>
    </>
  )
}

export default NaoEncontrada

export const Head = () => (
  <Seo
    titulo="Página não encontrada"
    descricao="O endereço que você abriu não existe."
    caminho="/404/"
  />
)
