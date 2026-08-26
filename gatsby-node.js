const path = require("path")

/**
 * Slug do texto: nome da pasta em `content/blog/` sem o prefixo de data.
 * `2026-08-24-o-que-a-ia-acelerou` -> `o-que-a-ia-acelerou`
 */
const slugDaPasta = caminho => {
  const pasta = path.basename(path.dirname(caminho))
  return pasta.replace(/^\d{4}-\d{2}-\d{2}-/, "")
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  if (node.internal.type !== "MarkdownRemark") return
  const { createNodeField } = actions
  const arquivo = getNode(node.parent)
  createNodeField({ node, name: "slug", value: slugDaPasta(arquivo.absolutePath) })
}

exports.createSchemaCustomization = ({ actions }) => {
  // Tipos explícitos: o build não quebra quando não há nenhum texto publicado.
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
    }

    type Fields {
      slug: String
    }
  `)
}

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions
  const templateTexto = path.resolve("./src/templates/texto.js")

  const resultado = await graphql(`
    {
      allMarkdownRemark(
        filter: { frontmatter: { publicado: { eq: true } } }
        sort: { frontmatter: { date: DESC } }
      ) {
        nodes {
          id
          fields {
            slug
          }
        }
      }
    }
  `)

  if (resultado.errors) {
    reporter.panicOnBuild("Erro ao carregar os textos", resultado.errors)
    return
  }

  const textos = resultado.data.allMarkdownRemark.nodes

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

  reporter.info(`vcrmartinez: ${textos.length} texto(s) publicado(s) em /textos/`)
}
