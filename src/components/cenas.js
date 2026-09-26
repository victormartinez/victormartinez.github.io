import * as React from "react"
import Cena, { C, tile } from "./lego"

/**
 * As cenas da home, uma por seção. Cada uma guarda o próprio estado (hover,
 * ticker, visibilidade) para que o re-render fique restrito à cena — a home
 * inteira não precisa saber que o monitor do herói acabou de "digitar" um tile.
 */

const reduzMovimento = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches

// ---------------------------------------------------------------- herói

// linhas de código como tiles Lego no monitor: [indent, [largura, cor]...]
const CODIGO = [
  [0, [34, C.M], [58, C.W]],
  [12, [44, C.P], [30, C.N], [26, C.L]],
  [12, [26, C.M], [66, C.W]],
  [24, [40, C.L], [34, C.M]],
  [12, [50, C.N]],
  [0, [22, C.W]],
]
const TILES = []
CODIGO.forEach((ln, r) => {
  let x = 22 + ln[0]
  ln.slice(1).forEach(t => {
    TILES.push({ x, y: 22 + r * 18, w: t[0], c: t[1] })
    x += t[0] + 6
  })
})
const N_TILES = TILES.length

/** Mesa com monitor: o código se digita em tiles e um bloco encaixa no fim do build. */
export function cenaHeroi(tipo) {
  const vis = Math.min(tipo, N_TILES)
  const pronto = tipo >= N_TILES
  const tela = [tile(10, 10, 204, 128, C.D, "4px")]
  TILES.forEach((t, i) =>
    tela.push(tile(t.x, t.y, t.w, 10, t.c, "2px", i < vis ? 1 : 0)),
  )
  const ult = vis > 0 ? TILES[vis - 1] : { x: 22, y: 22, w: -6 }
  tela.push(
    tile(
      ult.x + ult.w + 6,
      ult.y - 1,
      8,
      12,
      C.M,
      "1px",
      pronto ? (tipo % 2 ? 1 : 0.15) : 1,
    ),
  )
  tela.push(tile(106, 150, 12, 6, pronto ? C.M : C.L, "3px"))
  return [
    { x: 0, y: 0, w: 10, d: 7, z: 0, h: 10, c: C.B },
    { x: 3, y: 1, w: 4, d: 2, z: 10, h: 8, c: C.L, liso: true },
    { x: 4, y: 1, w: 2, d: 1, z: 18, h: 32, c: C.L, liso: true },
    { x: 1, y: 2, w: 8, d: 1, z: 50, h: 170, c: C.A, fr: tela },
    {
      x: 2,
      y: 4,
      w: 6,
      d: 2,
      z: 10,
      h: 8,
      c: C.N,
      liso: true,
      fr: Array.from({ length: 12 }, (_, i) =>
        tile(10 + i * 13, 2, 9, 3, C.L, "1px"),
      ),
    },
    { x: 8, y: 5, w: 1, d: 1, z: 10, h: 10, c: C.M, liso: true },
    { x: 0, y: 4, w: 1, d: 2, z: 10, h: 24, c: C.P },
    { x: 0, y: 4, w: 1, d: 2, z: 34, h: 24, c: C.M, up: pronto ? 0 : 60 },
  ]
}

export const CenaHeroi = () => {
  const ref = React.useRef(null)
  const [tipo, setTipo] = React.useState(0)

  React.useEffect(() => {
    if (reduzMovimento()) {
      setTipo(N_TILES)
      return undefined
    }
    let naTela = true
    let observer = null
    if (typeof IntersectionObserver === "function" && ref.current) {
      observer = new IntersectionObserver(es => {
        naTela = es[0].isIntersecting
      })
      observer.observe(ref.current)
    }
    const t = setInterval(() => {
      if (!naTela || document.hidden) return
      setTipo(s => (s >= N_TILES + 16 ? 0 : s + 1))
    }, 190)
    return () => {
      clearInterval(t)
      if (observer) observer.disconnect()
    }
  }, [])

  const vis = Math.min(tipo, N_TILES)
  const pronto = tipo >= N_TILES
  return (
    <div className="heroi__cena" ref={ref}>
      <Cena blocos={cenaHeroi(tipo)} u={28} className="iso--heroi" />
      <span
        className={pronto ? "cena__rotulo cena__rotulo--ok" : "cena__rotulo"}
      >
        {pronto ? "› build ok ✓" : `› compilando ${vis}/${N_TILES}`}
      </span>
    </div>
  )
}

// ---------------------------------------------------------------- assuntos

/** Uma cena por assunto; `on` = hover. */
export function cenaAssunto(i, on) {
  const u = z => (on ? z : 0)

  if (i === 0) {
    // releases: colunas inteiras sobem juntas, em cascata
    const cores = [C.L, C.N, C.P, C.M]
    const out = []
    for (let k = 0; k < 4; k++) {
      for (let lv = 0; lv <= k; lv++) {
        out.push({
          x: 3 - k,
          y: 0,
          w: 1,
          d: 2,
          z: lv * 20,
          h: 20,
          c: cores[k],
          up: u(14),
          dl: `${k * 70}ms`,
        })
      }
    }
    out.push({
      x: 0,
      y: 0,
      w: 1,
      d: 2,
      z: 80,
      h: 6,
      c: C.W,
      liso: true,
      up: u(14),
      dl: "210ms",
    })
    return out
  }

  if (i === 1) {
    // camadas: cada andar sobe e mostra o que tem dentro
    const out = []
    const niveis = [
      { c: C.N, z: 0, dentro: [{ x: 1, y: 1, w: 2, d: 2, h: 20, c: C.M }] },
      {
        c: C.P,
        z: 34,
        dentro: [
          { x: 1, y: 1, w: 1, d: 1, h: 20, c: C.W },
          { x: 2, y: 2, w: 1, d: 1, h: 20, c: C.W },
          { x: 2, y: 1, w: 1, d: 1, h: 12, c: C.N, round: true },
        ],
      },
      { c: C.L, z: 68, dentro: [] },
    ]
    niveis.forEach((n, k) => {
      const up = u(k * 26)
      out.push({
        x: 0,
        y: 0,
        w: 4,
        d: 4,
        z: n.z,
        h: 8,
        c: n.c,
        liso: k === 2,
        up,
      })
      if (k < 2) {
        ;[
          [0, 0],
          [3, 0],
          [0, 3],
          [3, 3],
        ].forEach(p =>
          out.push({
            x: p[0],
            y: p[1],
            w: 1,
            d: 1,
            z: n.z + 8,
            h: 26,
            c: C.L,
            round: true,
            up,
          }),
        )
      }
      n.dentro.forEach(d => out.push({ z: n.z + 8, up, ...d }))
    })
    return out
  }

  if (i === 2) {
    // chip: placa verde, 16 terminais 1x1 prata, placa 4x4 preta e tile estampado por cima
    const out = [{ x: 0, y: 0, w: 6, d: 6, z: 0, h: 8, c: C.P }]
    let n = 0
    const pin = (x, y) =>
      out.push({
        x,
        y,
        w: 1,
        d: 1,
        z: 8,
        h: 6,
        c: C.N,
        liso: true,
        up: u(16),
        dl: `${n++ * 18}ms`,
        tp: [tile(9, 3, 4, 16, "rgba(28,23,32,0.35)", "1px")],
      })
    for (let k = 1; k <= 4; k++) {
      pin(k, 0)
      pin(5, k)
      pin(k, 5)
      pin(0, k)
    }
    out.push({ x: 1, y: 1, w: 4, d: 4, z: 8, h: 8, c: C.A, up: u(44) })
    const q = 26 * 4
    out.push({
      x: 1,
      y: 1,
      w: 4,
      d: 4,
      z: 16,
      h: 7,
      c: C.A,
      liso: true,
      up: u(96),
      rx: on ? -16 : 0,
      to: "50% 50% 0px",
      tp: [
        tile(6, 6, q - 12, q - 12, "#33283F", "3px"),
        tile(24, 24, q - 48, q - 48, C.M, "2px"),
        tile(32, 32, q - 64, q - 64, C.A, "1px"),
        tile(38, 38, q - 76, q - 76, C.M, "1px"),
        tile(11, 11, 6, 6, C.N, "50%"),
      ],
    })
    return out
  }

  // squads: base branca 6x6, quatro times em placas 2x2; no hover cada squad sobe inteiro
  const out = [{ x: 0, y: 0, w: 6, d: 6, z: 0, h: 8, c: C.W }]
  const sq = [
    {
      x: 0,
      y: 0,
      p: C.P,
      m: [
        [0, 0, 20],
        [1, 0, 20],
        [0, 1, 20],
        [1, 1, 20],
      ],
    },
    {
      x: 4,
      y: 0,
      p: C.L,
      m: [
        [0, 0, 20],
        [1, 0, 20],
        [0, 1, 20],
      ],
    },
    {
      x: 0,
      y: 4,
      p: C.A,
      m: [
        [0, 0, 20],
        [1, 1, 20],
        [1, 0, 20],
      ],
    },
    {
      x: 4,
      y: 4,
      p: C.M,
      m: [
        [0, 0, 20],
        [1, 0, 20],
        [0, 1, 20],
        [1, 1, 20],
      ],
    },
  ]
  sq.forEach((t, k) => {
    const up = u(22)
    const dl = `${k * 80}ms`
    out.push({ x: t.x, y: t.y, w: 2, d: 2, z: 8, h: 8, c: t.p, up, dl })
    t.m.forEach(m =>
      out.push({
        x: t.x + m[0],
        y: t.y + m[1],
        w: 1,
        d: 1,
        z: 16,
        h: m[2],
        c: C.N,
        up,
        dl,
      }),
    )
  })
  return out
}

export const CenaAssunto = ({ indice, on }) => (
  <div className="assunto__cena">
    <Cena blocos={cenaAssunto(indice, on)} u={26} className="iso--assunto" />
  </div>
)

// ---------------------------------------------------------------- textos

/** Qual livro da estante corresponde a cada linha da lista (3 textos na home). */
const LIVRO_DA_LINHA = { 1: 0, 4: 1, 6: 2 }

/**
 * Estante de tijolos: cada livro é um tijolo 1x2 alto com a lombada estampada.
 * `sel` = índice da linha em hover (puxa o livro dela); `todos` = hover na
 * estante (puxa todos, em cascata).
 */
export function cenaEstante(sel, todos) {
  const out = [
    { x: 0, y: 0, w: 8, d: 3, z: 0, h: 8, c: C.B },
    { x: 0, y: 0, w: 8, d: 1, z: 8, h: 84, c: C.A, liso: true },
  ]
  const livros = [
    [0, 60, C.P],
    [1, 72, C.M],
    [2, 54, C.N],
    [3, 66, C.L],
    [4, 72, C.W],
    [5, 58, C.P],
    [6, 66, C.M],
    [7, 50, C.N],
  ]
  livros.forEach((l, k) => {
    const on = todos || LIVRO_DA_LINHA[k] === sel
    const esc =
      l[2] === C.W || l[2] === C.N
        ? "rgba(28,23,32,0.35)"
        : "rgba(242,240,238,0.55)"
    out.push({
      x: l[0],
      y: 1,
      w: 1,
      d: 2,
      z: 8,
      h: l[1],
      c: l[2],
      liso: true,
      up: on ? 26 : 0,
      dl: todos ? `${k * 50}ms` : "0ms",
      fr: [
        tile(5, 8, 16, 3, esc, "1px"),
        tile(5, 14, 16, 3, esc, "1px"),
        tile(5, l[1] - 14, 16, 6, esc, "1px"),
      ],
    })
  })
  return out
}

/** `livro` vem da lista ao lado (linha em hover, -1 = nenhuma). */
export const CenaEstante = ({ livro }) => {
  const [todos, setTodos] = React.useState(false)
  return (
    <div
      className="estante"
      role="presentation"
      onMouseEnter={() => setTodos(true)}
      onMouseLeave={() => setTodos(false)}
    >
      <Cena
        blocos={cenaEstante(livro, todos)}
        u={26}
        className="iso--estante"
      />
    </div>
  )
}

// ---------------------------------------------------------------- estudos

/** Página de caderno feita de tiles. `solto` = desmontada. */
export function cenaCaderno(solto) {
  const out = [{ x: 0, y: 0, w: 6, d: 8, z: 0, h: 8, c: C.W }]
  for (let y = 0; y < 8; y += 2)
    out.push({ x: 0, y, w: 1, d: 1, z: 8, h: 8, c: C.L, round: true })
  const linhas = [
    [0, 4, C.A],
    [1, 4, C.P],
    [2, 3, C.L],
    [3, 4, C.L],
    [4, 2, C.M],
    [5, 3, C.P],
    [6, 4, C.L],
    [7, 2, C.L],
  ]
  linhas.forEach((l, k) => {
    const up = solto ? 40 + k * 12 : 0
    const dl = `${(solto ? k : 7 - k) * 45}ms`
    if (k > 0) {
      out.push({
        x: 1,
        y: l[0],
        w: 1,
        d: 1,
        z: 8,
        h: 6,
        c: C.M,
        round: true,
        liso: true,
        up: solto ? up + 18 : 0,
        dl,
      })
    }
    out.push({
      x: k > 0 ? 2 : 1,
      y: l[0],
      w: l[1],
      d: 1,
      z: 8,
      h: 6,
      c: l[2],
      liso: true,
      up,
      dl,
    })
  })
  return out
}

/** Começa desmontada, monta ao entrar na tela e desmonta no hover. */
export const CenaCaderno = () => {
  const ref = React.useRef(null)
  const [vista, setVista] = React.useState(false)
  const [hover, setHover] = React.useState(false)

  React.useEffect(() => {
    if (
      reduzMovimento() ||
      typeof IntersectionObserver !== "function" ||
      !ref.current
    ) {
      setVista(true)
      return undefined
    }
    const io = new IntersectionObserver(
      es => es.forEach(e => setVista(e.isIntersecting)),
      {
        threshold: 0.45,
      },
    )
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  return (
    <div
      className="caderno"
      role="presentation"
      ref={ref}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Cena
        blocos={cenaCaderno(!vista || hover)}
        u={22}
        className="iso--caderno"
      />
    </div>
  )
}

// ---------------------------------------------------------------- contato

/** Robô: no hover, o braço gira na dobradiça e o olho/boca acendem em menta. */
export function cenaRobo(on) {
  const olhoH = on ? 5 : 12
  const olhoT = on ? 16 : 12
  return [
    { x: 0, y: 0, w: 4, d: 3, z: 0, h: 8, c: C.B },
    { x: 1, y: 1, w: 1, d: 1, z: 8, h: 40, c: C.L },
    { x: 2, y: 1, w: 1, d: 1, z: 8, h: 40, c: C.L },
    {
      x: 1,
      y: 1,
      w: 2,
      d: 1,
      z: 48,
      h: 60,
      c: C.M,
      liso: true,
      fr: [
        tile(8, 10, 44, 28, C.A, "4px"),
        tile(14, 20, 8, 8, C.M, "50%"),
        tile(26, 20, 8, 8, C.W, "50%"),
        tile(38, 20, 8, 8, on ? C.M : C.L, "50%"),
        tile(14, 46, 32, 4, C.P, "2px"),
      ],
    },
    { x: 0, y: 1, w: 1, d: 1, z: 62, h: 42, c: C.P, liso: true },
    {
      x: 3,
      y: 1,
      w: 1,
      d: 1,
      z: 62,
      h: 42,
      c: C.P,
      liso: true,
      rx: on ? 90 : 0,
      to: "50% 50% 42px",
    },
    {
      x: 3,
      y: 1,
      w: 1,
      d: 1,
      z: 50,
      h: 12,
      c: C.L,
      round: true,
      liso: true,
      rx: on ? 90 : 0,
      to: "50% 50% 54px",
    },
    { x: 0, y: 1, w: 1, d: 1, z: 50, h: 12, c: C.L, round: true, liso: true },
    {
      x: 1,
      y: 1,
      w: 2,
      d: 1,
      z: 108,
      h: 44,
      c: C.N,
      liso: true,
      fr: [
        tile(10, olhoT, 14, olhoH, C.A, "3px"),
        tile(36, olhoT, 14, olhoH, C.A, "3px"),
        tile(18, 32, 24, 5, on ? C.M : C.L, "3px"),
      ],
    },
    { x: 1.85, y: 1.35, w: 0.3, d: 0.3, z: 152, h: 24, c: C.L, liso: true },
    {
      x: 1.8,
      y: 1.3,
      w: 0.4,
      d: 0.4,
      z: 176,
      h: 10,
      c: on ? C.M : C.W,
      liso: true,
      up: on ? 6 : 0,
    },
  ]
}

export const CenaRobo = ({ on }) => (
  <div className="robo">
    <Cena blocos={cenaRobo(on)} u={30} className="iso--robo" />
    <span className={on ? "cena__rotulo cena__rotulo--ok" : "cena__rotulo"}>
      {on ? "› bora conversar" : "› robô em espera"}
    </span>
  </div>
)
