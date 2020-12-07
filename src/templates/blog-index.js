import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import PostItem from "../components/PostItem"
import Pagination from "../components/Pagination"
import SEO from "../components/seo"

const BlogIndex = ({ data, pageContext }) => {
  const siteTitle = data.site.siteMetadata?.title
  const description = data.site.siteMetadata.description
  const social = data.site.siteMetadata.social
  const posts = data.allMarkdownRemark.nodes

  const { currentPage, numPages } = pageContext
  const isFirst = currentPage === 1
  const isLast = currentPage === numPages
  const prevPage = currentPage - 1 === 1 ? "/" : `/page/${currentPage - 1}`
  const nextPage = `/page/${currentPage + 1}`

  if (posts.length === 0) {
    return (
      <Layout title={siteTitle}>
        <SEO title={`${siteTitle}`} />
        <p>No blog posts found.</p>
      </Layout>
    )
  }

  return (
    <Layout
      title={siteTitle}
      description={description}
      heroSocial={social}
      footerSocial={social}
    >
      <SEO title={`${siteTitle}`} description={`${siteTitle} ${description}`} />
      {posts.map(post => {
        return (
          <PostItem
            key={post.fields.slug}
            slug={post.fields.slug}
            title={post.frontmatter.title || post.fields.slug}
            date={post.frontmatter.date}
            description={post.frontmatter.description || post.excerpt}
            timeToRead={post.timeToRead}
            category={post.frontmatter.category}
            image={post.frontmatter.image}
          />
        )
      })}
      <Pagination
        isFirst={isFirst}
        isLast={isLast}
        currentPage={currentPage}
        numPages={numPages}
        prevPage={prevPage}
        nextPage={nextPage}
      />
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query PostList($skip: Int!, $limit: Int!) {
    site {
      siteMetadata {
        title
        description
        social {
          twitter
          github
          linkedin
          speakerdeck
        }
      }
    }
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/content/blog/" } }
      sort: { fields: [frontmatter___date], order: DESC }
      limit: $limit
      skip: $skip
    ) {
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
          image {
            publicURL
            childImageSharp {
              fluid(maxHeight: 368, maxWidth: 640) {
                ...GatsbyImageSharpFluid_tracedSVG
              }
            }
          }
        }
        timeToRead
      }
    }
  }
`
