import * as React from "react"

/** A partir de quantas seções vale a pena mostrar o índice lateral. */
export const SECOES_PARA_INDICE = 2

/**
 * Índice lateral ("Neste texto" / "Nesta nota") com o estado da leitura: seção
 * já lida, seção atual e as que faltam. `secoes` vem de `headings(depth: h2)`.
 *
 * - `numerado`: "01", "02"... em vez do tijolo (a nota usa números).
 * - `rotulo`: linha de status no fim ("› peça 2 de 4").
 */
const Indice = ({ titulo, secoes, ativa, fim, numerado = false, rotulo }) => {
  if (secoes.length < SECOES_PARA_INDICE) return null
  return (
    <aside className="indice">
      <p className="indice__titulo">{titulo}</p>
      <nav className="indice__nav" aria-label={titulo}>
        {secoes.map((s, i) => {
          const feita = fim || i < ativa
          const agora = !fim && i === ativa
          return (
            <a
              className={
                agora ? "indice__item indice__item--agora" : "indice__item"
              }
              href={`#${s.id}`}
              key={s.id}
              aria-current={agora ? "true" : undefined}
            >
              {numerado ? (
                <span className="indice__num">
                  {String(i + 1).padStart(2, "0")}
                </span>
              ) : (
                <span
                  className={
                    agora
                      ? "indice__peca indice__peca--agora"
                      : feita
                        ? "indice__peca indice__peca--feita"
                        : "indice__peca"
                  }
                  aria-hidden="true"
                />
              )}
              <span>{s.value}</span>
            </a>
          )
        })}
      </nav>
      {rotulo ? <p className="indice__rotulo">{rotulo}</p> : null}
    </aside>
  )
}

export default Indice
