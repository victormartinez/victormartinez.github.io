import React from "react"
import { graphql } from "gatsby"

import LayoutContent from "../components/LayoutContent"
import PostItem from "../components/PostItem"
import Pagination from "../components/Pagination"
import Paragraph from "../components/Paragraph"
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
  const noPosts = data.site.siteMetadata[intl.locale].noPosts
  const description = data.site.siteMetadata[intl.locale].blog.description
  const social = data.site.siteMetadata.social
  const englishPosts = data.englishPosts.nodes
  const portuguesePosts = data.portuguesePosts.nodes
  const author = data.site.siteMetadata.author.name
  const keywords = data.site.siteMetadata.keywords
  const image = data.allFile.edges[0].node.publicURL

  // Filtering posts by locale
  const posts = intl.locale === "pt" ? portuguesePosts : englishPosts

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
        en {
          noPosts
          blog {
            title
            description
          }
        }
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
        frontmatter: { language: { eq: "pt" } }
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
    englishPosts: allMarkdownRemark(
      filter: {
        fileAbsolutePath: { regex: "/content/blog/" }
        frontmatter: { language: { eq: "en" } }
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
