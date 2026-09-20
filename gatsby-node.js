const path = require("path")

/** Raiz das URLs das anotações de estudo. */
const RAIZ_NOTAS = "/notas-de-estudo"

/**
 * Slug do texto: nome da pasta em `content/blog/` sem o prefixo de data.
 * `2026-08-24-o-que-a-ia-acelerou` -> `o-que-a-ia-acelerou`
 */
const slugDaPasta = caminho => {
  const pasta = path.basename(path.dirname(caminho))
  return pasta.replace(/^\d{4}-\d{2}-\d{2}-/, "")
}

/**
 * Slug da nota: caminho da pasta relativo a `content/notas/`, com as barras
 * preservadas — é ele que carrega a hierarquia.
 * `content/notas/kubernetes/networking/index.md` -> `kubernetes/networking`
 */
const slugDaNota = (caminho, raiz) =>
  path
    .relative(raiz, path.dirname(caminho))
    .split(path.sep)
    .filter(Boolean)
    .join("/")

exports.onCreateNode = ({ node, actions, getNode }) => {
  if (node.internal.type !== "MarkdownRemark") return
  const { createNodeField } = actions
  const arquivo = getNode(node.parent)
  const colecao = arquivo.sourceInstanceName

  // Em content/notas a pasta é que define a URL, então só o index.md dela é
  // nota. Qualquer outro .md (README, rascunho solto) fica sem `fields` e, como
  // toda query filtra por `colecao`, não vira página nem aparece em lugar nenhum.
  if (
    colecao === "notas" &&
    path.basename(arquivo.absolutePath) !== "index.md"
  ) {
    return
  }

  // `colecao` é o que separa texto de anotação: os dois viram MarkdownRemark, e
  // sem essa marca toda query do site enxergaria os dois de uma vez.
  createNodeField({ node, name: "colecao", value: colecao })

  if (colecao === "notas") {
    const raiz = path.join(__dirname, "content", "notas")
    const slug = slugDaNota(arquivo.absolutePath, raiz)
    const partes = slug.split("/")

    createNodeField({ node, name: "slug", value: slug })
    createNodeField({ node, name: "caminho", value: `${RAIZ_NOTAS}/${slug}/` })
    createNodeField({ node, name: "tema", value: partes[0] })
    createNodeField({ node, name: "nivel", value: partes.length - 1 })
    createNodeField({
      node,
      name: "pai",
      value: partes.length > 1 ? partes.slice(0, -1).join("/") : null,
    })
    return
  }

  createNodeField({
    node,
    name: "slug",
    value: slugDaPasta(arquivo.absolutePath),
  })
}

exports.createSchemaCustomization = ({ actions }) => {
  // Tipos explícitos: o build não quebra quando não há nenhum texto publicado.
  // Campo não declarado aqui também não é consultável, então tudo que o
  // frontmatter de nota usa precisa aparecer em `Frontmatter`.
  actions.createTypes(`
    type SiteSiteMetadata {
      title: String
      titleCompleto: String
      description: String
      siteUrl: String
      author: String
      lang: String
      social: Social
    }

    type Social {
      linkedin: String
      github: String
    }

    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Frontmatter {
      title: String
      description: String
      category: String
      date: Date @dateformat
      nota: String
      publicado: Boolean
      maturidade: String
      atualizado: Date @dateformat
      ordem: Int
    }

    type Fields {
      slug: String
      colecao: String
      caminho: String
      tema: String
      pai: String
      nivel: Int
    }
  `)
}

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions
  const templateTexto = path.resolve("./src/templates/texto.js")
  const templateNota = path.resolve("./src/templates/nota.js")

  const resultado = await graphql(`
    {
      textos: allMarkdownRemark(
        filter: {
          fields: { colecao: { eq: "blog" } }
          frontmatter: { publicado: { eq: true } }
        }
        sort: { frontmatter: { date: DESC } }
      ) {
        nodes {
          id
          fields {
            slug
          }
        }
      }
      notas: allMarkdownRemark(
        filter: {
          fields: { colecao: { eq: "notas" } }
          frontmatter: { publicado: { ne: false } }
        }
        sort: { fields: { slug: ASC } }
      ) {
        nodes {
          id
          fields {
            slug
            caminho
            pai
            nivel
          }
          frontmatter {
            title
          }
        }
      }
    }
  `)

  if (resultado.errors) {
    reporter.panicOnBuild("Erro ao carregar o conteúdo", resultado.errors)
    return
  }

  const textos = resultado.data.textos.nodes

  textos.forEach((texto, i) => {
    createPage({
      path: `/textos/${texto.fields.slug}/`,
      component: templateTexto,
      context: {
        id: texto.id,
        anteriorId: i === textos.length - 1 ? null : textos[i + 1].id,
        proximoId: i === 0 ? null : textos[i - 1].id,
      },
    })
  })

  const notas = resultado.data.notas.nodes
  const porSlug = new Map(notas.map(n => [n.fields.slug, n]))

  /**
   * Ancestrais da nota, do tema até o pai direto. Os títulos vêm do frontmatter
   * de cada ancestral, então a trilha mostra "Kubernetes", não "kubernetes".
   * Devolve `null` se algum ancestral não existir — nota órfã não vira página.
   */
  const trilhaDe = slug => {
    const partes = slug.split("/")
    const trilha = []
    for (let i = 1; i < partes.length; i++) {
      const ancestral = porSlug.get(partes.slice(0, i).join("/"))
      if (!ancestral) return null
      trilha.push({
        titulo: ancestral.frontmatter.title,
        caminho: ancestral.fields.caminho,
      })
    }
    return trilha
  }

  let orfas = 0

  notas.forEach(nota => {
    const { slug, caminho, pai } = nota.fields
    const trilha = trilhaDe(slug)

    if (!trilha) {
      reporter.warn(
        `vcrmartinez: a nota "content/notas/${slug}/index.md" não tem index.md em ` +
          `todas as pastas acima dela — ela ficou de fora do site. ` +
          `Crie os index.md que faltam (ou use "make nova-nota", que cria sozinho).`,
      )
      orfas++
      return
    }

    createPage({
      path: caminho,
      component: templateNota,
      context: {
        id: nota.id,
        slug,
        trilha,
        paiCaminho: pai ? porSlug.get(pai).fields.caminho : `${RAIZ_NOTAS}/`,
        paiTitulo: pai ? porSlug.get(pai).frontmatter.title : "Notas de estudo",
        // Filhos diretos: o glob não atravessa "/", e o nível confirma. O
        // template usa os dois no filtro do GraphQL.
        globFilhos: `${slug}/*`,
        nivelFilhos: slug.split("/").length,
      },
    })
  })

  reporter.info(
    `vcrmartinez: ${textos.length} texto(s) em /textos/ e ` +
      `${notas.length - orfas} nota(s) em ${RAIZ_NOTAS}/` +
      (orfas ? ` (${orfas} órfã(s) fora do site)` : ""),
  )
}
