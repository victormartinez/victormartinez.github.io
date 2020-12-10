import React from "react"
import { graphql } from "gatsby"

import LayoutContent from "../components/LayoutContent"
import PostItem from "../components/PostItem"
import Pagination from "../components/Pagination"
import SEO from "../components/seo"

import { useIntl } from "gatsby-plugin-intl"
import {
  articleUrl,
  nextPageBlogUrl,
  prevPageBlogUrl,
} from "../utils/routing.js"

const BlogIndex = ({ data, pageContext }) => {
  const intl = useIntl()

  const siteTitle = data.site.siteMetadata[intl.locale].blog.title
  const description = data.site.siteMetadata[intl.locale].blog.description
  const social = data.site.siteMetadata.social
  const allPosts = data.allMarkdownRemark.nodes

  // Filtering posts by locale
  const posts = allPosts.filter(node =>
    node.frontmatter.language.includes(intl.locale)
  )

  const { currentPage, numPages } = pageContext
  const isFirst = currentPage === 1
  const isLast = currentPage === numPages
  const prevPage = prevPageBlogUrl(intl.locale, currentPage)
  const nextPage = nextPageBlogUrl(intl.locale, currentPage)

  if (posts.length === 0) {
    return (
      <LayoutContent
        title={siteTitle}
        description={description}
        social={social}
      >
        <SEO title={`${siteTitle}`} />
        <p>No blog posts found.</p>
      </LayoutContent>
    )
  }

  return (
    <LayoutContent title={siteTitle} description={description} social={social}>
      <SEO title={`${siteTitle}`} description={`${siteTitle} ${description}`} />
      {posts.map(post => {
        return (
          <PostItem
            key={post.fields.slug}
            path={`${articleUrl(intl.locale, post.fields.slug)}`}
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
    </LayoutContent>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query PostList($skip: Int!, $limit: Int!) {
    site {
      siteMetadata {
        en {
          author {
            name
          }
          blog {
            title
            description
          }
        }
        pt {
          title
          description
          author {
            name
          }
          blog {
            title
            description
          }
        }
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
          date(formatString: "MMM DD, YYYY")
          title
          description
          category
          language
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
