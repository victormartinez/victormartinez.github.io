import React from "react"
import { graphql } from "gatsby"

import Article from "../components/Article"
import ArticleNav from "../components/ArticleNav"
import Comments from "../components/Comments"
import Divider from "../components/Divider"
import Layout from "../components/layout"
import SEO from "../components/seo"

const BlogPostTemplate = ({ data }) => {
  const post = data.markdownRemark
  const social = data.site.siteMetadata.social
  const title = post.frontmatter.title
  const url = `${data.site.siteMetadata.siteUrl}${post.fields.slug}`
  const { previous, next } = data

  return (
    <Layout footerSocial={social}>
      <SEO
        title={title}
        description={post.frontmatter.description || post.excerpt}
      />
      <Article post={post} />
      <ArticleNav previous={previous} next={next} />
      <Divider />
      <Comments url={url} title={title} />
    </Layout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    site {
      siteMetadata {
        title
        siteUrl
        social {
          twitter
          github
          linkedin
          speakerdeck
        }
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        tags
        rating
        image_url
        image_author
      }
      fields {
        slug
      }
      timeToRead
    }
    previous: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`
