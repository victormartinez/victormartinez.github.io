/**
 * Datas em pt-BR, formatadas com Intl (mesmo resultado no build Node e no
 * browser). A data do frontmatter vem sem timezone, então é lida como UTC
 * para não escorregar um dia.
 */
const paraData = iso => {
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? null : d
}

const capitaliza = s => s.charAt(0).toUpperCase() + s.slice(1)

/** "Jan 2026" — usado no metadado das listagens. */
export const mesAno = iso => {
  const d = paraData(iso)
  if (!d) return ""
  const mes = new Intl.DateTimeFormat("pt-BR", {
    month: "short",
    timeZone: "UTC",
  })
    .format(d)
    .replace(/\.$/, "")
  return `${capitaliza(mes)} ${d.getUTCFullYear()}`
}

/** "24 de agosto de 2026" — usado no topo do texto. */
export const dataLonga = iso => {
  const d = paraData(iso)
  if (!d) return ""
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(d)
}

/** ISO curto para o atributo `datetime` do <time>. */
export const iso8601 = iso => {
  const d = paraData(iso)
  return d ? d.toISOString().slice(0, 10) : ""
}

/** Anos inteiros entre `iso` e hoje. Devolve 0 quando a data é inválida. */
export const anosDesde = iso => {
  const d = paraData(iso)
  if (!d) return 0
  const agora = new Date()
  let anos = agora.getUTCFullYear() - d.getUTCFullYear()
  const mes = agora.getUTCMonth() - d.getUTCMonth()
  if (mes < 0 || (mes === 0 && agora.getUTCDate() < d.getUTCDate())) anos--
  return Math.max(0, anos)
}
