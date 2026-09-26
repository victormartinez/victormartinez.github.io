import * as React from "react"

/**
 * Selo de maturidade da anotação. O estágio é dito na cara em vez de escondido:
 * anotação é feita para ser revisitada, e quem lê precisa saber o quanto já foi
 * checado.
 *
 * São dois estágios de propósito: a diferença entre "comecei" e "estou no meio"
 * dá trabalho de manter e não muda nada para quem lê.
 *
 * Cada estágio tem duas formas:
 * - `rotulo`  o selo em si
 * - `glosa`   fica ao lado do selo na página da nota, para o significado não
 *             depender de tooltip (que não existe no celular)
 */
export const ESTAGIOS = {
  "em-aberto": { rotulo: "Em aberto", glosa: "ainda mexendo" },
  revisada: { rotulo: "Revisada", glosa: "reli e confio" },
}

export const MATURIDADES = Object.keys(ESTAGIOS)
export const MATURIDADE_PADRAO = "em-aberto"

export const estagioDe = maturidade =>
  ESTAGIOS[maturidade] ? maturidade : MATURIDADE_PADRAO

const Selo = ({ maturidade }) => {
  const chave = estagioDe(maturidade)
  return <span className={`selo selo--${chave}`}>{ESTAGIOS[chave].rotulo}</span>
}

/** Selo + a glosa curta ao lado. Usado no cabeçalho da nota. */
export const SeloComGlosa = ({ maturidade }) => {
  const chave = estagioDe(maturidade)
  return (
    <>
      <Selo maturidade={chave} />{" "}
      <span className="selo__glosa">{ESTAGIOS[chave].glosa}</span>
    </>
  )
}

export default Selo
