import React from "react"
import { useIntl } from "gatsby-plugin-intl"
import { graphql } from "gatsby"

import Article from "../components/Article"
import Comments from "../components/Comments"
import Divider from "../components/Divider"
import LayoutArticle from "../components/LayoutArticle"
import SEO from "../components/seo"
import { articleUrl } from "../utils/routing.js"

const BlogPostTemplate = ({ data }) => {
  const intl = useIntl()
  const post = data.markdownRemark
  const social = data.site.siteMetadata.social
  const title = post.frontmatter.title
  const path = articleUrl(intl.locale, post.fields.slug)
  const url = `${data.site.siteMetadata.siteUrl}${path}`
  const imageURL = post.frontmatter.image.publicURL

  return (
    <LayoutArticle social={social}>
      <SEO
        title={title}
        description={post.frontmatter.description || post.excerpt}
        image={imageURL}
        meta={[
          {
            property: `keywords`,
            content: post.frontmatter.tags.join(", "),
          },
        ]}
      />
      <Article post={post} />
      <Divider />
      <Comments url={url} identifier={path} title={title} />
    </LayoutArticle>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($id: String!) {
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
        date
        description
        tags
        image_url
        image_author
        image {
          publicURL
        }
      }
      fields {
        slug
      }
      timeToRead
    }
  }
`
