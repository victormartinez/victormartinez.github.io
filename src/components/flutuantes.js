import * as React from "react"
import { iso, tile, Bloco, C } from "./lego"

/**
 * Peças flutuantes da home: grupos de 2–3 peças pousados só no vão entre uma
 * seção e outra. A posição vertical vem do topo de cada `<section>` (o vão
 * `g` é a fronteira entre a seção g e a g+1), com um balanço leve de ±6px.
 * Somem se colidirem com elementos marcados com `data-evita`.
 *
 * Camada decorativa: `aria-hidden`, `pointer-events: none` e `z-index: -1`
 * sob o conteúdo (o `main` da home isola o contexto de empilhamento).
 *
 * Esquema: [vão, fração da largura, escala, rotação, blocos]
 */
const ENTRE = [
  [
    0,
    0.34,
    0.8,
    -8,
    [
      { x: 0, y: 0, w: 2, d: 2, z: 0, h: 22, c: C.M },
      {
        x: 0.5,
        y: 0.5,
        w: 1,
        d: 1,
        z: 22,
        h: 8,
        c: C.W,
        liso: true,
        jumper: true,
      },
    ],
  ],
  [0, 0.58, 0.85, 14, [{ x: 0, y: 0, w: 2, d: 2, z: 0, h: 22, c: C.L }]],
  [0, 0.76, 0.9, -16, [{ x: 0, y: 0, w: 1, d: 3, z: 0, h: 8, c: C.P }]],
  [1, 0.22, 0.9, 10, [{ x: 0, y: 0, w: 2, d: 3, z: 0, h: 22, c: C.N }]],
  [
    1,
    0.5,
    0.85,
    -4,
    [
      { x: 0, y: 0, w: 2, d: 4, z: 0, h: 8, c: C.A },
      { x: 0, y: 1, w: 2, d: 2, z: 8, h: 22, c: C.M },
    ],
  ],
  [
    1,
    0.8,
    0.85,
    18,
    [
      { x: 0, y: 0, w: 2, d: 2, z: 0, h: 8, c: C.P },
      { x: 0.5, y: 0.5, w: 1, d: 1, z: 8, h: 18, c: C.W, round: true },
    ],
  ],
  [2, 0.3, 0.9, -14, [{ x: 0, y: 0, w: 2, d: 4, z: 0, h: 22, c: C.M }]],
  [
    2,
    0.64,
    0.8,
    8,
    [
      {
        x: 0,
        y: 0,
        w: 2,
        d: 2,
        z: 0,
        h: 8,
        c: C.W,
        liso: true,
        tp: [
          tile(8, 8, 20, 4, C.A, "1px"),
          tile(8, 16, 14, 4, C.A, "1px"),
          tile(8, 24, 18, 4, C.M, "1px"),
        ],
      },
    ],
  ],
  [
    3,
    0.2,
    0.75,
    12,
    [
      { x: 0, y: 0, w: 2, d: 3, z: 0, h: 8, c: C.L },
      { x: 0, y: 0, w: 1, d: 1, z: 8, h: 22, c: C.P },
    ],
  ],
  [
    3,
    0.46,
    0.85,
    -18,
    [
      { x: 0, y: 0, w: 2, d: 2, z: 0, h: 22, c: C.A },
      { x: 0, y: 0, w: 2, d: 1, z: 22, h: 8, c: C.N },
    ],
  ],
  [3, 0.84, 0.9, 4, [{ x: 0, y: 0, w: 1, d: 4, z: 0, h: 8, c: C.M }]],
  [
    4,
    0.36,
    0.8,
    -10,
    [
      { x: 0, y: 0, w: 2, d: 2, z: 0, h: 22, c: C.P },
      { x: 0, y: 0, w: 1, d: 2, z: 22, h: 22, c: C.M },
    ],
  ],
  [
    4,
    0.7,
    0.9,
    16,
    [
      { x: 0, y: 0, w: 2, d: 3, z: 0, h: 8, c: C.A },
      { x: 0, y: 1, w: 2, d: 2, z: 8, h: 22, c: C.L },
    ],
  ],
  [5, 0.26, 0.9, 6, [{ x: 0, y: 0, w: 2, d: 2, z: 0, h: 22, c: C.W }]],
  [
    5,
    0.55,
    0.75,
    -12,
    [{ x: 0, y: 0, w: 2, d: 2, z: 0, h: 8, c: C.M, liso: true, jumper: true }],
  ],
  [
    5,
    0.8,
    0.9,
    20,
    [
      { x: 0, y: 0, w: 1, d: 1, z: 0, h: 18, c: C.P, round: true },
      { x: 0, y: 0, w: 1, d: 1, z: 18, h: 18, c: C.L, round: true },
    ],
  ],
].map((e, k) => ({
  g: e[0],
  fx: e[1],
  s: e[2],
  r: e[3],
  blocos: iso(e[4], 18),
  fase: k * 2.3,
}))

const RAIO = 58

const Flutuantes = () => {
  const caixa = React.useRef(null)
  const refs = React.useRef([])

  React.useEffect(() => {
    const box = caixa.current
    if (!box) return undefined
    const reduz =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    // Abaixo de 760px a camada está com display:none (ver style.css): nada a
    // posicionar, e o loop nem começa.
    const celular = window.matchMedia("(max-width: 760px)")
    const t0 = performance.now()

    const posicionar = agora => {
      const br = box.getBoundingClientRect()
      const W = box.offsetWidth
      const obst = Array.from(document.querySelectorAll("[data-evita]")).map(
        o => {
          const r = o.getBoundingClientRect()
          return {
            l: r.left - br.left,
            r: r.right - br.left,
            t: r.top - br.top,
            b: r.bottom - br.top,
          }
        },
      )
      // O vão g fica no topo da seção g+1.
      const vaos = Array.from(
        box.parentNode.querySelectorAll(":scope > section"),
      )
        .slice(1)
        .map(s => s.getBoundingClientRect().top - br.top)
      const t = (agora - t0) / 1000
      ENTRE.forEach((p, k) => {
        const el = refs.current[k]
        if (!el) return
        const y0 = vaos[p.g]
        if (y0 == null) {
          el.style.visibility = "hidden"
          return
        }
        const bob = reduz ? 0 : Math.sin(t * 0.8 + p.fase) * 6
        const rot = reduz ? p.r : p.r + Math.sin(t * 0.45 + p.fase) * 5
        const x = p.fx * W
        const y = y0 + bob
        const raio = RAIO * p.s
        const bate = obst.some(
          o =>
            x + raio > o.l &&
            x - raio < o.r &&
            y + raio > o.t &&
            y - raio < o.b,
        )
        el.style.visibility = "visible"
        el.style.opacity = bate ? "0" : "1"
        el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${p.s})`
        el.firstChild.style.transform = `rotateX(60deg) rotateZ(${45 + rot}deg)`
      })
    }

    if (reduz) {
      // Sem balanço não há o que animar: posiciona quando o layout muda.
      const medir = () => {
        if (!celular.matches) posicionar(t0)
      }
      medir()
      window.addEventListener("resize", medir)
      window.addEventListener("load", medir)
      return () => {
        window.removeEventListener("resize", medir)
        window.removeEventListener("load", medir)
      }
    }

    let raf = null
    const quadro = agora => {
      posicionar(agora)
      raf = requestAnimationFrame(quadro)
    }
    const roda = () => {
      if (raf === null && !document.hidden && !celular.matches) {
        raf = requestAnimationFrame(quadro)
      }
    }
    const para = () => {
      if (raf !== null) cancelAnimationFrame(raf)
      raf = null
    }
    const rever = () => (document.hidden || celular.matches ? para() : roda())
    document.addEventListener("visibilitychange", rever)
    celular.addEventListener("change", rever)
    roda()
    return () => {
      para()
      document.removeEventListener("visibilitychange", rever)
      celular.removeEventListener("change", rever)
    }
  }, [])

  return (
    <div className="flutuantes" ref={caixa} aria-hidden="true">
      {ENTRE.map((p, k) => (
        <div
          className="flutuante"
          key={k}
          ref={el => {
            refs.current[k] = el
          }}
          style={{ visibility: "hidden" }}
        >
          <div className="flutuante__iso">
            {p.blocos.map((b, i) => (
              <Bloco b={b} key={i} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Flutuantes
