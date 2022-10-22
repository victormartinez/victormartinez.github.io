const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  // Get all markdown blog posts sorted by date
  const result = await graphql(
    `
      {
        allMarkdownRemark(sort: { fields: frontmatter___date, order: DESC }) {
          nodes {
            id
            fields {
              slug
            }
            frontmatter {
              layout
            }
          }
        }
      }
    `
  )

  if (result.errors) {
    reporter.panicOnBuild(
      `There was an error loading your blog posts`,
      result.errors
    )
    return
  }

  const allMarkdowns = result.data.allMarkdownRemark.nodes
  const posts = allMarkdowns.filter(markdown => markdown.frontmatter.layout === "post")

  // Create blog posts pages
  // But only if there's at least one markdown file found at "content/blog" (defined in gatsby-config.js)
  // `context` is available in the template as a prop and as a variable in GraphQL
  posts.forEach((post, index) => {
    createPage({
      path: `/blog${post.fields.slug}`,
      component: path.resolve(`./src/templates/blog-post.js`),
      context: {
        id: post.id,
      },
    })

    const postsPerPage = 6
    const totalPosts = posts.length
    const numPages = Math.ceil(totalPosts / postsPerPage)

    Array.from({ length: numPages }).forEach((_, index) => {
      createPage({
        path: index === 0 ? `/blog` : `/blog/page/${index + 1}`,
        component: path.resolve(`./src/templates/blog-index.js`),
        context: {
          limit: postsPerPage,
          skip: index * postsPerPage,
          numPages,
          postsPerPage,
          currentPage: index + 1,
        },
      })
    })
  })

  // Create reviews pages
  const bookReviews = allMarkdowns.filter(markdown => markdown.frontmatter.layout === "bookreview")
  bookReviews.forEach((review, index) => {
    createPage({
      path: `/bookreviews${review.fields.slug}`,
      component: path.resolve(`./src/templates/bookreview-post.js`),
      context: {
        id: review.id,
      },
    })

    const reviewsPerPage = 6
    const totalReviews = bookReviews.length
    const numReviewPages = Math.ceil(totalReviews / reviewsPerPage)

    Array.from({ length: numReviewPages }).forEach((_, index) => {
      createPage({
        path: index === 0 ? `/bookreviews` : `/bookreviews/page/${index + 1}`,
        component: path.resolve(`./src/templates/bookreview-index.js`),
        context: {
          limit: reviewsPerPage,
          skip: index * reviewsPerPage,
          numPages: numReviewPages,
          postsPerPage: reviewsPerPage,
          currentPage: index + 1,
        },
      })
    })
  })

  // Create talks pages
  const talks = allMarkdowns.filter(markdown => markdown.frontmatter.layout === "talk")
  talks.forEach((talkItem, index) => {
    const talksPerPage = 6
    const totalTalks = talks.length
    const numTalksPerPage = Math.ceil(totalTalks / talksPerPage)

    Array.from({ length: numTalksPerPage }).forEach((_, index) => {
      createPage({
        path: index === 0 ? `/talks` : `/talks/page/${index + 1}`,
        component: path.resolve(`./src/templates/talks-index.js`),
        context: {
          limit: talksPerPage,
          skip: index * talksPerPage,
          numPages: numTalksPerPage,
          postsPerPage: talksPerPage,
          currentPage: index + 1,
        },
      })
    })
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })

    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  // Explicitly define the siteMetadata {} object
  // This way those will always be defined even if removed from gatsby-config.js

  // Also explicitly define the Markdown frontmatter
  // This way the "MarkdownRemark" queries will return `null` even when no
  // blog posts are stored inside "content/blog" instead of returning an error
  createTypes(`
    type SiteSiteMetadata {
      author: Author
      siteUrl: String
      social: Social
    }

    type Author {
      name: String
      summary: String
    }

    type Social {
      twitter: String
    }

    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Frontmatter {
      title: String
      description: String
      date: Date @dateformat
    }

    type Fields {
      slug: String
    }
  `)
}
