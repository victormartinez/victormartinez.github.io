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
  const { previous, next } = data

  return (
    <Layout footerSocial={social}>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      />
      <Article post={post} />
      <ArticleNav previous={previous} next={next} />
      <Divider />
      <Comments />
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
        social {
          twitter
          github
          linkedin
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
