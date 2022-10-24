import React from "react"
import { graphql } from "gatsby"

import LayoutContent from "../components/LayoutContent"
import PostItem from "../components/PostItem"
import Pagination from "../components/Pagination"
import Paragraph from "../components/Paragraph"
import SEO from "../components/seo"

import { useIntl } from "gatsby-plugin-intl"
import {
  pageDetailUrl,
  nextPageUrl,
  prevPageUrl,
} from "../utils/routing.js"

const BlogIndex = ({ data, pageContext }) => {
  const intl = useIntl()

  const siteTitle = data.site.siteMetadata[intl.locale].blog.title
  const noPosts = data.site.siteMetadata[intl.locale].noPosts
  const description = data.site.siteMetadata[intl.locale].blog.description
  const social = data.site.siteMetadata.social
  const posts = data.portuguesePosts.nodes
  const author = data.site.siteMetadata.author.name
  const keywords = data.site.siteMetadata.keywords
  const image = data.allFile.edges[0].node.publicURL

  const routeName = 'blog'
  const { currentPage, numPages } = pageContext
  const isFirst = currentPage === 1
  const isLast = currentPage === numPages
  const prevPage = prevPageUrl(intl.locale, routeName, currentPage)
  const nextPage = nextPageUrl(intl.locale, routeName, currentPage)

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
            path={`${pageDetailUrl(intl.locale, routeName, post.fields.slug)}`}
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
          blog {
            title
            description
          }
        }
      }
    }
    portuguesePosts: allMarkdownRemark(
      filter: {
        fileAbsolutePath: { regex: "/content/blog/" }
        frontmatter: { layout: { eq: "post" } }
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
