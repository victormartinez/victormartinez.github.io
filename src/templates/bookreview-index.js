import React from "react"
import { graphql } from "gatsby"

import LayoutContent from "../components/LayoutContent"
import PostItem from "../components/PostItem"
import Pagination from "../components/Pagination"
import Paragraph from "../components/Paragraph"
import SEO from "../components/seo"

import { useIntl } from "gatsby-plugin-intl"
import {
  reviewUrl,
  nextPageBookReviewUrl,
  prevPageBookReviewUrl,
} from "../utils/routing.js"

const BookReviewIndex = ({ data, pageContext }) => {
  const intl = useIntl()

  const siteTitle = data.site.siteMetadata[intl.locale].bookreviews.title
  const noPosts = data.site.siteMetadata[intl.locale].noPosts
  const description = data.site.siteMetadata[intl.locale].bookreviews.description
  const social = data.site.siteMetadata.social
  const posts = data.portugueseBookReviews.nodes
  const author = data.site.siteMetadata.author.name
  const keywords = data.site.siteMetadata.keywords
  const image = data.allFile.edges[0].node.publicURL

  const { currentPage, numPages } = pageContext
  const isFirst = currentPage === 1
  const isLast = currentPage === numPages
  const prevPage = prevPageBookReviewUrl(intl.locale, currentPage)
  const nextPage = nextPageBookReviewUrl(intl.locale, currentPage)

  if (posts.length === 0) {
    return (
      <LayoutContent
        title={siteTitle}
        description={description}
        social={social}
      >
        <SEO
          title={`${author} | ${siteTitle}`}
          description={description}
          image={image}
          meta={[
            {
              property: `keywords`,
              content: keywords.join(", "),
            },
          ]}
        />
        <Paragraph text={noPosts} />
      </LayoutContent>
    )
  }

  return (
    <LayoutContent
      itemscope
      itemtype="https://schema.org/Blog"
      title={siteTitle}
      description={description}
      social={social}
    >
      <SEO
        title={`${author} | ${siteTitle}`}
        description={`${siteTitle} ${description}`}
        image={image}
        meta={[
          {
            property: `keywords`,
            content: keywords.join(", "),
          },
        ]}
      />
      {posts.map(post => {
        return (
          <PostItem
            key={post.fields.slug}
            path={`${reviewUrl(intl.locale, post.fields.slug)}`}
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

export default BookReviewIndex

export const pageQuery = graphql`
  query BookReviewList($skip: Int!, $limit: Int!) {
    allFile(
      filter: {
        absolutePath: { regex: "/content/assets/" }
        name: { eq: "cover" }
      }
    ) {
      edges {
        node {
          name
          publicURL
        }
      }
    }
    site {
      siteMetadata {
        author {
          name
        }
        social {
          twitter
          github
          linkedin
          speakerdeck
        }
        keywords
        pt {
          noPosts
          bookreviews {
            title
            description
          }
        }
      }
    }
    portugueseBookReviews: allMarkdownRemark(
      filter: {
        fileAbsolutePath: { regex: "/content/bookreviews/" }
        frontmatter: { layout: { eq: "bookreview" } }
      }
      sort: { fields: [frontmatter___date], order: DESC }
      limit: $limit
      skip: $skip
    ) {
      nodes {
        excerpt(pruneLength: 200)
        fields {
          slug
        }
        frontmatter {
          date
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
