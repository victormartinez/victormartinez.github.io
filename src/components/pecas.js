import * as React from "react"

/**
 * Peças decorativas 2D que aparecem fora das cenas 3D: régua, rótulo de seção,
 * barra de progresso, pilha de tijolos. Todas `aria-hidden` — são só visuais.
 */

/** Régua menta de 120×10 (pinheiro na variante clara). */
export const Regua = ({ clara = false }) => (
  <span
    className={clara ? "regua regua--pinheiro" : "regua"}
    aria-hidden="true"
  />
)

/** Rótulo de seção: "NN" em menta e o nome em névoa a 70%. */
export const Rotulo = ({ num, nome }) => (
  <p className="rotulo">
    <span className="rotulo__num">{num}</span>
    <span className="rotulo__nome">{nome}</span>
  </p>
)

/** Barra de progresso da leitura: 24 tijolos que vão ficando menta. */
export const Progresso = ({ fracao }) => {
  const n = Math.round(Math.max(0, Math.min(1, fracao)) * 24)
  return (
    <div className="progresso" aria-hidden="true">
      {Array.from({ length: 24 }, (_, i) => (
        <span
          className={
            i < n ? "progresso__peca progresso__peca--feita" : "progresso__peca"
          }
          key={i}
        />
      ))}
    </div>
  )
}

/** Pilha fixa de quatro tijolos, no rodapé do texto. */
export const PilhaFim = () => (
  <span className="pilha-fim" aria-hidden="true">
    <span />
    <span />
    <span />
    <span />
  </span>
)

/**
 * Pilha vertical de tijolos, um por nota: cheio = revisada, vazio = em aberto.
 * `pecas` é uma lista de booleanos (true = revisada).
 */
export const Pilha = ({ pecas, max = 8 }) => (
  <span className="pilha" aria-hidden="true">
    {pecas.slice(0, max).map((cheia, i) => (
      <span
        className={cheia ? "pilha__peca" : "pilha__peca pilha__peca--vazia"}
        key={i}
      />
    ))}
  </span>
)

/** Tijolo pequeno horizontal, na coluna do ano em /textos/. */
export const PecaMini = ({ cor }) => (
  <span
    className="peca-mini"
    style={{ background: cor, color: cor }}
    aria-hidden="true"
  />
)

/** Botão-peça dos filtros (Todos · 12), com os pinos em cima. */
export const PecaBotao = ({ ativo, onClick, children }) => (
  <button
    type="button"
    className={ativo ? "peca-botao peca-botao--ativo" : "peca-botao"}
    aria-pressed={ativo}
    onClick={onClick}
  >
    {children}
  </button>
)
