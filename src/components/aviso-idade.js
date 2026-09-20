import * as React from "react"
import { anosDesde } from "../utils/data"

/** A partir de quantos anos a página avisa que pode ter envelhecido. */
export const ANOS_PARA_AVISAR = 1

const TEXTOS = {
  texto:
    "Este texto foi publicado há mais de um ano e o assunto pode ter mudado " +
    "desde então. Confira novas referências antes de confiar.",
  nota:
    "Esta anotação não é revisada há mais de um ano e o assunto pode ter mudado " +
    "desde então. Confira novas referências antes de confiar.",
}

/**
 * Avisa que a página pode estar obsoleta.
 *
 * A idade é calculada duas vezes de propósito. No build, para quem lê sem JS e
 * para o aviso já vir no HTML; e de novo ao montar, porque o site só é
 * reconstruído quando eu publico algo — sem a segunda conta, uma página que
 * cruzasse a marca de um ano entre dois deploys ficaria sem aviso justamente
 * quando ele passou a fazer falta.
 *
 * `tipo`: "texto" | "nota". `data`: ISO — a publicação do texto, a última
 * revisão da nota.
 */
const AvisoIdade = ({ tipo, data }) => {
  const noBuild = anosDesde(data)
  const [anos, setAnos] = React.useState(noBuild)

  React.useEffect(() => {
    const agora = anosDesde(data)
    if (agora !== noBuild) setAnos(agora)
  }, [data, noBuild])

  if (!data || anos < ANOS_PARA_AVISAR) return null

  return (
    <aside className="aviso" role="note">
      <p className="aviso__titulo">
        <span aria-hidden="true">⏳</span> Conteúdo antigo
      </p>
      <p className="aviso__corpo">{TEXTOS[tipo]}</p>
    </aside>
  )
}

export default AvisoIdade
