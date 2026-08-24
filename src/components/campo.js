import * as React from "react"

/**
 * Campo generativo do herói — porte fiel de `js/campo.js` do site estático
 * (mesmo ruído, mesma repulsão do ponteiro, mesmas cores).
 *
 * O que muda em relação ao script original, sem mexer no visual:
 * - só começa depois do `load` + `requestIdleCallback`, para não disputar a
 *   main thread com a hidratação do React;
 * - pausa quando o herói sai da tela ou a aba fica em segundo plano;
 * - cancela tudo (rAF, listeners, observers) no unmount.
 */
const Campo = ({ densidade = 1000, forca = 5.2, className = "heroi__campo" }) => {
  const ref = React.useRef(null)

  React.useEffect(() => {
    const cv = ref.current
    if (!cv || !cv.getContext) return undefined

    let cancelado = false
    let idle = null
    let limpar = () => {}

    const iniciar = () => {
      if (cancelado) return

      const ctx = cv.getContext("2d")
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const reduz =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      const ps = []
      let W = 0
      let H = 0
      let t = 0
      let raf = null
      let naTela = true

      const dimensiona = limpa => {
        const r = cv.getBoundingClientRect()
        const w = Math.round(r.width) || 1280
        const h = Math.round(r.height) || 820
        if (w === W && h === H) return
        W = w
        H = h
        cv.width = W * dpr
        cv.height = H * dpr
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        if (limpa) {
          ctx.fillStyle = "#241A2E"
          ctx.fillRect(0, 0, W, H)
        }
      }

      dimensiona(true)
      for (let i = 0; i < densidade; i++) {
        ps.push({
          x: Math.random() * W,
          y: Math.random() * H,
          v: 0.5 + Math.random(),
        })
      }

      const mouse = { x: -9999, y: -9999 }
      const aoMover = e => {
        const r = cv.getBoundingClientRect()
        mouse.x = e.clientX - r.left
        mouse.y = e.clientY - r.top
      }
      const aoSair = () => {
        mouse.x = -9999
        mouse.y = -9999
      }
      const aoRedimensionar = () => dimensiona(false)

      cv.addEventListener("pointermove", aoMover)
      cv.addEventListener("pointerleave", aoSair)
      window.addEventListener("resize", aoRedimensionar)

      const passo = comPonteiro => {
        t += 0.0022
        ctx.fillStyle = "rgba(36, 26, 46, 0.075)"
        ctx.fillRect(0, 0, W, H)
        ctx.lineWidth = 1
        for (let i = 0; i < ps.length; i++) {
          const p = ps[i]
          const ang =
            (Math.sin(p.x * 0.0035 + t * 2.2) + Math.cos(p.y * 0.0042 - t * 1.7)) *
            Math.PI
          let dx = Math.cos(ang) * p.v * 1.5
          let dy = Math.sin(ang) * p.v * 1.5
          let perto = 0
          if (comPonteiro) {
            const mx = p.x - mouse.x
            const my = p.y - mouse.y
            const d2 = mx * mx + my * my
            if (d2 < 30000) {
              const d = Math.sqrt(d2) || 1
              perto = 1 - d / 173
              dx += (mx / d) * perto * forca
              dy += (my / d) * perto * forca
            }
          }
          const nx = p.x + dx
          const ny = p.y + dy
          ctx.strokeStyle =
            perto > 0.05
              ? "rgba(25, 177, 131, " + (0.18 + perto * 0.62).toFixed(3) + ")"
              : "rgba(110, 102, 120, 0.34)"
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(nx, ny)
          ctx.stroke()
          p.x = nx
          p.y = ny
          if (p.x < -20 || p.x > W + 20 || p.y < -20 || p.y > H + 20) {
            p.x = Math.random() * W
            p.y = Math.random() * H
          }
        }
      }

      const quadro = () => {
        passo(true)
        raf = requestAnimationFrame(quadro)
      }

      const roda = () => {
        if (raf === null && naTela && !document.hidden) {
          raf = requestAnimationFrame(quadro)
        }
      }
      const para = () => {
        if (raf !== null) {
          cancelAnimationFrame(raf)
          raf = null
        }
      }

      let observer = null
      const aoTrocarVisibilidade = () => (document.hidden ? para() : roda())

      if (reduz) {
        // prefers-reduced-motion: desenha ~90 quadros e congela.
        for (let k = 0; k < 90; k++) passo(false)
      } else {
        document.addEventListener("visibilitychange", aoTrocarVisibilidade)
        if (typeof IntersectionObserver === "function") {
          observer = new IntersectionObserver(
            entradas => {
              naTela = entradas[0].isIntersecting
              if (naTela) roda()
              else para()
            },
            { threshold: 0 }
          )
          observer.observe(cv)
        }
        roda()
      }

      limpar = () => {
        para()
        cv.removeEventListener("pointermove", aoMover)
        cv.removeEventListener("pointerleave", aoSair)
        window.removeEventListener("resize", aoRedimensionar)
        document.removeEventListener("visibilitychange", aoTrocarVisibilidade)
        if (observer) observer.disconnect()
      }
    }

    // Depois do load (hidratação já paga) e só quando a thread estiver ociosa.
    const agendar = () => {
      if (cancelado) return
      if (typeof window.requestIdleCallback === "function") {
        idle = window.requestIdleCallback(iniciar, { timeout: 2000 })
      } else {
        idle = window.setTimeout(iniciar, 300)
      }
    }

    let onLoad = null
    if (document.readyState === "complete") {
      agendar()
    } else {
      onLoad = () => agendar()
      window.addEventListener("load", onLoad, { once: true })
    }

    return () => {
      cancelado = true
      if (onLoad) window.removeEventListener("load", onLoad)
      if (idle !== null) {
        if (typeof window.cancelIdleCallback === "function") {
          window.cancelIdleCallback(idle)
        } else {
          window.clearTimeout(idle)
        }
      }
      limpar()
    }
  }, [densidade, forca])

  return <canvas ref={ref} className={className} aria-hidden="true" />
}

export default Campo
