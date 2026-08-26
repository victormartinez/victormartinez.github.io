/**
 * Configuração do site vcrmartinez.com — Gatsby 5 / React 18.
 *
 * O conteúdo antigo (blog 2018–2023, talks, archive, assets) vive em
 * `content/_old/` e NÃO é lido por nenhum source plugin: a única pasta
 * fonteada é `content/blog`, e o `ignore` abaixo é o cinto de segurança.
 */
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
})

const siteUrl = "https://vcrmartinez.com"

module.exports = {
  siteMetadata: {
    title: "Victor Martinez",
    titleCompleto: "Victor Martinez — engenharia contada de dentro",
    description:
      "Victor Martinez: doze anos construindo software, quatro liderando times. Textos e palestras sobre engenharia, arquitetura, gestão e IA aplicada.",
    siteUrl,
    author: "Victor Martinez",
    lang: "pt-BR",
    social: {
      linkedin: "https://linkedin.com/in/vcrmartinez",
      github: "https://github.com/victormartinez",
    },
  },
  trailingSlash: "always",
  graphqlTypegen: false,
  plugins: [
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "blog",
        path: `${__dirname}/content/blog`,
        ignore: ["**/_old/**", "**/.DS_Store"],
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          {
            resolve: "gatsby-remark-images",
            options: { maxWidth: 900, linkImagesToOriginal: false },
          },
          {
            resolve: "gatsby-remark-responsive-iframe",
            options: { wrapperStyle: "margin-bottom: 1.6rem" },
          },
          "gatsby-remark-prismjs",
          "gatsby-remark-copy-linked-files",
          "gatsby-remark-smartypants",
        ],
      },
    },
    "gatsby-transformer-sharp",
    "gatsby-plugin-sharp",
    "gatsby-plugin-image",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: "Victor Martinez",
        short_name: "vcrmartinez",
        start_url: "/",
        background_color: "#241A2E",
        theme_color: "#241A2E",
        display: "minimal-ui",
        lang: "pt-BR",
        icon: "src/images/icone-512.png",
      },
    },
    {
      resolve: "gatsby-plugin-sitemap",
      options: {
        // O sitemap nasce das páginas realmente construídas — como `_old`
        // nunca vira página, nenhum texto antigo entra aqui.
        output: "/",
        excludes: ["/404/", "/404.html", "/dev-404-page/"],
      },
    },
    {
      resolve: "gatsby-plugin-feed",
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) =>
              allMarkdownRemark.nodes.map(node => ({
                title: node.frontmatter.title,
                description: node.frontmatter.description || node.excerpt,
                date: node.frontmatter.date,
                url: `${site.siteMetadata.siteUrl}/textos/${node.fields.slug}/`,
                guid: `${site.siteMetadata.siteUrl}/textos/${node.fields.slug}/`,
                custom_elements: [{ "content:encoded": node.html }],
              })),
            query: `
              {
                allMarkdownRemark(
                  filter: { frontmatter: { publicado: { eq: true } } }
                  sort: { frontmatter: { date: DESC } }
                ) {
                  nodes {
                    excerpt
                    html
                    fields { slug }
                    frontmatter { title date description }
                  }
                }
              }
            `,
            output: "/rss.xml",
            title: "Victor Martinez — engenharia contada de dentro",
            match: "^/textos/",
          },
        ],
      },
    },
  ],
}
