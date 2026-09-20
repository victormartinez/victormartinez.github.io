/**
 * Normalização para busca e para agrupar no índice A–Z: sem acento e em caixa
 * baixa, para "pós" casar com "pos" e "Árvores" cair no grupo do A.
 */
export const normalizar = s =>
  (s || "").normalize("NFD").replace(/\p{M}/gu, "").toLowerCase()

/**
 * Letra do índice A–Z. Tudo que não começa com A–Z (número, símbolo) cai no "#".
 */
export const letraIndice = s => {
  const c = normalizar(s).charAt(0).toUpperCase()
  return c >= "A" && c <= "Z" ? c : "#"
}

export const ALFABETO = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
