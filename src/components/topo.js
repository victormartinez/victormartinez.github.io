import * as React from "react"
import { Link } from "gatsby"

/**
 * Cabeçalho sticky. Duas formas:
 * - home: marca + navegação das seções (no celular, só "Contato" fica visível);
 * - páginas internas: "← voltar" | marca.
 * `children` entra abaixo da linha principal (a barra de progresso do texto).
 */
const Topo = ({ voltar, children }) => (
  <header className="topo">
    <div className="topo__linha">
      <div className="topo__interno">
        <div className="topo__esq">
          {voltar ? (
            <>
              <Link className="voltar" to={voltar.to}>
                {voltar.rotulo}
              </Link>
              <span className="topo__sep" aria-hidden="true" />
            </>
          ) : null}
          <Link className="marca" to={voltar ? "/" : "/#topo"}>
            <img
              src="/assets/img/simbolo-vcr.svg"
              alt=""
              width="28"
              height="28"
              aria-hidden="true"
            />
            <span>vcrmartinez</span>
          </Link>
        </div>
        {voltar ? null : (
          <nav className="nav" aria-label="Seções da página">
            <a href="#sobre">Sobre</a>
            <a href="#assuntos">Assuntos</a>
            <a href="#palestras">Palestras</a>
            <a href="#textos">Textos</a>
            <a href="#notas">Notas</a>
            <a className="sempre" href="#contato">
              Contato
            </a>
          </nav>
        )}
      </div>
    </div>
    {children}
  </header>
)

export default Topo
