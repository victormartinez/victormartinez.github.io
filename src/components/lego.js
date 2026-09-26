import * as React from "react"

/**
 * Motor de blocos Lego isométricos — porte do `iso()` da proposta C.
 *
 * Cada cena é um contêiner com `transform: rotateX(60deg) rotateZ(45deg)` e
 * `transform-style: preserve-3d`. Cada bloco vira um `div` com três faces:
 * topo (`translateZ(h)`), frente (+y, `rotateX(90deg)`) e direita (+x,
 * `rotateY(-90deg)`). As laterais recebem os tons mais escuros do mapa SHADE.
 *
 * Esquema de um bloco:
 *   { x, y, w, d   posição e tamanho em unidades de pino (inteiros)
 *     z, h         altura da base e espessura, em px
 *     c            cor (uma chave de SHADE)
 *     liso         true = tile sem pinos
 *     round        tijolo redondo (pilha de discos de 1px)
 *     jumper       placa com um pino central
 *     up           deslocamento extra em Z (animado)
 *     mx, my       deslocamento em X/Y em unidades (animado)
 *     rx, to       rotação em X e transform-origin (dobradiça)
 *     dl           transition-delay
 *     tp: [tile()] estampas na face de topo
 *     fr: [tile()] estampas na face frontal }
 *
 * Regras do dono: peças sempre na grade inteira; Lego não muda de cor (o hover
 * só move peças); movimentos possíveis no Lego real; easing sem overshoot.
 */

export const C = {
  A: "#241A2E", // ameixa
  M: "#19B183", // menta
  P: "#0B6A4C", // pinheiro
  N: "#D8D3DE", // névoa
  L: "#6E6678", // lavanda
  W: "#F2F0EE", // giz
  B: "#3A2D47", // ameixa-escura
  K: "#E9BC93", // pele (só nas peças)
  D: "#120C17", // tela do monitor
}

const SHADE = {
  "#241A2E": ["#1A1221", "#120C17"],
  "#19B183": ["#13956E", "#0E7656"],
  "#0B6A4C": ["#08553C", "#06412E"],
  "#D8D3DE": ["#B8B0C2", "#9A91A6"],
  "#6E6678": ["#5A5363", "#48424F"],
  "#F2F0EE": ["#D3CFD6", "#B7B1BC"],
  "#3A2D47": ["#2D2238", "#231A2C"],
  "#E9BC93": ["#CFA07A", "#B88863"],
}

const px = v => `${v}px`

/** Estampa retangular numa face (posição e tamanho em px). */
export const tile = (l, t, w, h, c, r = "2px", op = 1) => ({
  l: px(l),
  t: px(t),
  w: px(w),
  h: px(h),
  c,
  r,
  op,
})

/** Projeta a lista de blocos nas faces que o componente desenha. `u` = px por pino. */
export function iso(lista, u) {
  let x0 = Infinity
  let x1 = -Infinity
  let y0 = Infinity
  let y1 = -Infinity
  lista.forEach(b => {
    x0 = Math.min(x0, b.x)
    x1 = Math.max(x1, b.x + b.w)
    y0 = Math.min(y0, b.y)
    y1 = Math.max(y1, b.y + b.d)
  })
  const cx = ((x0 + x1) / 2) * u
  const cy = ((y0 + y1) / 2) * u
  const hs = Math.max(3, Math.round(u * 0.2)) // altura do pino
  const s = u * 0.56 // diâmetro do pino

  const pino = (out, l, t, sh, c) => {
    for (let k = 0; k < hs; k++) {
      out.push({
        l: px(l),
        t: px(t),
        s: px(s),
        c: k === 0 ? sh[1] : sh[0],
        z: `translateZ(${k}px)`,
        sh: "none",
      })
    }
    out.push({
      l: px(l),
      t: px(t),
      s: px(s),
      c,
      z: `translateZ(${hs}px)`,
      sh: "inset 1px 1px 0 rgba(255,255,255,0.35), inset -1px -1px 0 rgba(0,0,0,0.12)",
    })
  }

  return lista.map(b => {
    const sh = SHADE[b.c] || [b.c, b.c]
    const studs = []

    if (b.round) {
      // tijolo redondo: pilha de discos de 1px
      const ds = u * 0.9
      const dl = (b.w * u - ds) / 2
      const dt = (b.d * u - ds) / 2
      for (let k = -b.h; k <= 0; k++) {
        studs.push({
          l: px(dl),
          t: px(dt),
          s: px(ds),
          c: k === 0 ? b.c : k === -b.h ? sh[1] : sh[0],
          z: `translateZ(${k}px)`,
          sh: k === 0 ? "inset 2px 2px 0 rgba(255,255,255,0.25)" : "none",
        })
      }
    }

    if (b.jumper) {
      pino(studs, (b.w * u) / 2 - s / 2, (b.d * u) / 2 - s / 2, sh, b.c)
    } else if (!b.liso) {
      const nx = Math.floor(b.w + 0.01)
      const ny = Math.floor(b.d + 0.01)
      const ox = ((b.w - nx) * u) / 2
      const oy = ((b.d - ny) * u) / 2
      for (let i = 0; i < nx; i++) {
        for (let j = 0; j < ny; j++) {
          pino(
            studs,
            ox + (i + 0.5) * u - s / 2,
            oy + (j + 0.5) * u - s / 2,
            sh,
            b.c,
          )
        }
      }
    }

    const oco = b.round ? "transparent" : null
    const mx = (b.mx || 0) * u
    const my = (b.my || 0) * u
    const z = b.z + (b.up || 0)

    return {
      studs,
      l: px(b.x * u - cx),
      t: px(b.y * u - cy),
      w: px(b.w * u),
      d: px(b.d * u),
      h: px(b.h),
      tz: `translate3d(${mx}px, ${my}px, ${z}px)${b.rx ? ` rotateX(${b.rx}deg)` : ""}`,
      to: b.to || "50% 50% 0px",
      tt: `translateZ(${b.h}px)`,
      c: oco || b.c,
      c1: oco || sh[0],
      c2: oco || sh[1],
      tp: b.tp || [],
      fr: b.fr || [],
      dl: b.dl || "0ms",
    }
  })
}

const Estampa = ({ f, topo }) => (
  <div
    className={topo ? "tile tile--topo" : "tile"}
    style={{
      left: f.l,
      top: f.t,
      width: f.w,
      height: f.h,
      background: f.c,
      borderRadius: f.r,
      opacity: f.op,
    }}
  />
)

/** Um bloco já projetado por `iso()`: as três faces, estampas e pinos. */
export const Bloco = ({ b }) => (
  <div
    className="bloco"
    style={{
      left: b.l,
      top: b.t,
      width: b.w,
      height: b.d,
      transform: b.tz,
      transformOrigin: b.to,
      transitionDelay: b.dl,
    }}
  >
    <div className="bloco__frente" style={{ height: b.h, background: b.c2 }}>
      <div className="bloco__frente-int">
        {b.fr.map((f, j) => (
          <Estampa f={f} key={j} />
        ))}
      </div>
    </div>
    <div className="bloco__dir" style={{ width: b.h, background: b.c1 }} />
    <div
      className="bloco__topo"
      style={{ transform: b.tt, backgroundColor: b.c }}
    >
      {b.tp.map((f, j) => (
        <Estampa f={f} topo key={j} />
      ))}
      {b.studs.map((p, j) => (
        <div
          className="pino"
          key={j}
          style={{
            left: p.l,
            top: p.t,
            width: p.s,
            height: p.s,
            background: p.c,
            transform: p.z,
            boxShadow: p.sh,
          }}
        />
      ))}
    </div>
  </div>
)

/**
 * Desenha uma cena. `blocos` é a lista no esquema acima, `u` os px por pino.
 * A ordem da lista precisa ser estável entre renders: é ela que preserva as
 * transições de cada peça (as chaves são o índice).
 */
export const Cena = ({ blocos, u, className = "" }) => (
  <div className={`iso ${className}`.trim()} aria-hidden="true">
    {iso(blocos, u).map((b, i) => (
      <Bloco b={b} key={i} />
    ))}
  </div>
)

export default Cena
