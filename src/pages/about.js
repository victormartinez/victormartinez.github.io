import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import PostItem from "../components/PostItem"
import SEO from "../components/seo"

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const description = data.site.siteMetadata.description
  const social = data.site.siteMetadata.social
  const posts = data.allMarkdownRemark.nodes

  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <SEO title="All posts" />
        <p>
          No blog posts found. Add markdown posts to "content/blog" (or the
          directory you specified for the "gatsby-source-filesystem" plugin in
          gatsby-config.js).
        </p>
      </Layout>
    )
  }

  return (
    <Layout
      location={location}
      title={siteTitle}
      description={description}
      heroSocial={social}
      footerSocial={social}
    >
      <SEO title="All posts" />
      <main>ABOUT</main>
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        description
        social {
          twitter
          github
          linkedin
        }
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      nodes {
        excerpt(pruneLength: 250)
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
          category
        }
        timeToRead
      }
    }
  }
`
