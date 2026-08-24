import * as React from "react"
import { Link } from "gatsby"

/**
 * Cabeçalho sticky. Duas formas, iguais às do site estático:
 * - home: marca + navegação das seções
 * - páginas internas: "← voltar" + marca
 */
const Topo = ({ voltar }) => (
  <header className="topo">
    {voltar ? (
      <Link className="voltar" to={voltar.to}>
        {voltar.rotulo}
      </Link>
    ) : null}
    <Link className="marca" to={voltar ? "/" : "/#topo"}>
      <img
        src="/assets/img/simbolo-vcr.svg"
        alt=""
        width="20"
        height="20"
        aria-hidden="true"
      />
      <span>vcrmartinez</span>
    </Link>
    {voltar ? null : (
      <nav className="nav" aria-label="Seções da página">
        <a href="#sobre">Sobre</a>
        <a href="#assuntos">Assuntos</a>
        <a href="#palestras">Palestras</a>
        <a href="#textos">Textos</a>
        <a className="sempre" href="#contato">
          Contato
        </a>
      </nav>
    )}
  </header>
)

export default Topo
