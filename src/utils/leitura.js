import * as React from "react"

/**
 * Acompanha a leitura de um artigo: fração lida (para a barra de progresso),
 * índice da seção `h2[id]` atual e se o fim já apareceu na tela.
 *
 * Mede num requestAnimationFrame por evento de scroll e só troca o estado
 * quando algo relevante mudou, para não re-renderizar a página a cada pixel.
 */
export function useLeitura(ref) {
  const [estado, setEstado] = React.useState({
    fracao: 0,
    ativa: 0,
    fim: false,
  })

  React.useEffect(() => {
    let raf = null
    const medir = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = null
        const el = ref.current
        if (!el) return
        const r = el.getBoundingClientRect()
        const vh = window.innerHeight
        const fracao = Math.max(
          0,
          Math.min(1, (vh * 0.35 - r.top) / Math.max(1, r.height - vh * 0.5)),
        )
        let ativa = 0
        el.querySelectorAll("h2[id]").forEach((s, i) => {
          if (s.getBoundingClientRect().top < vh * 0.4) ativa = i
        })
        const fim = r.bottom < vh * 0.9
        setEstado(a =>
          Math.abs(fracao - a.fracao) > 0.004 ||
          ativa !== a.ativa ||
          fim !== a.fim
            ? { fracao, ativa, fim }
            : a,
        )
      })
    }
    window.addEventListener("scroll", medir, { passive: true })
    window.addEventListener("resize", medir)
    medir()
    return () => {
      window.removeEventListener("scroll", medir)
      window.removeEventListener("resize", medir)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [ref])

  return estado
}

/**
 * Põe um botão "copiar" em cada bloco de código do artigo. Melhoria
 * progressiva: sem JS (ou sem clipboard) o bloco fica como está.
 */
export function useCopiarComandos(ref) {
  React.useEffect(() => {
    const el = ref.current
    if (!el || typeof navigator === "undefined" || !navigator.clipboard)
      return undefined
    const criados = []
    el.querySelectorAll("pre").forEach(pre => {
      // O prismjs ja envolve o <pre> num .gatsby-highlight; um bloco sem
      // linguagem vem solto e ganha o mesmo invólucro aqui.
      let caixa = pre.closest(".gatsby-highlight")
      let envolvido = false
      if (!caixa) {
        caixa = document.createElement("div")
        pre.parentNode.insertBefore(caixa, pre)
        caixa.appendChild(pre)
        envolvido = true
      }
      caixa.classList.add("comando")
      const botao = document.createElement("button")
      botao.type = "button"
      botao.className = "copiar"
      botao.textContent = "copiar"
      let t = null
      botao.addEventListener("click", () => {
        navigator.clipboard
          .writeText(pre.textContent)
          .then(() => {
            botao.textContent = "copiado ✓"
            botao.classList.add("copiar--ok")
            clearTimeout(t)
            t = setTimeout(() => {
              botao.textContent = "copiar"
              botao.classList.remove("copiar--ok")
            }, 1400)
          })
          .catch(() => {})
      })
      caixa.appendChild(botao)
      criados.push(() => {
        clearTimeout(t)
        botao.remove()
        caixa.classList.remove("comando")
        if (envolvido) caixa.replaceWith(pre)
      })
    })
    return () => criados.forEach(limpar => limpar())
  }, [ref])
}
