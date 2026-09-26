import * as React from "react"
import { StaticImage } from "gatsby-plugin-image"
import site from "../config/site"

/**
 * Rodapé. Na home (`grade`) ele fica transparente sobre o quadriculado; nas
 * páginas internas tem fundo ameixa.
 */
const Rodape = ({ grade = false }) => (
  <footer className={grade ? "rodape rodape--grade" : "rodape"}>
    <div className="rodape__interno">
      <div className="rodape__pessoa">
        <StaticImage
          className="rodape__foto"
          src="../images/victor-retrato.jpg"
          alt="Retrato de Victor Martinez, de camiseta preta, olhando para a câmera"
          width={56}
          height={56}
          quality={95}
          placeholder="none"
          layout="fixed"
          loading="lazy"
        />
        <div>
          <p className="rodape__nome">{site.autor}</p>
          <p className="rodape__papel">{site.papel}</p>
        </div>
      </div>
      <nav className="rodape__links" aria-label="Perfis">
        <a href={site.linkedin} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
        <a href={site.github} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </nav>
    </div>
    <p className="rodape__creditos">{site.creditos}</p>
  </footer>
)

export default Rodape
