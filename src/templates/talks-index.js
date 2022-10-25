import React from "react"
import { graphql } from "gatsby"

import LayoutContent from "../components/LayoutContent"
import TalkItem from "../components/TalkItem"
import Paragraph from "../components/Paragraph"
import SEO from "../components/seo"

import { useIntl } from "gatsby-plugin-intl"

const TalksIndex = ({ data }) => {
  const intl = useIntl()

  const siteTitle = data.site.siteMetadata[intl.locale].talks.title
  const noPosts = data.site.siteMetadata[intl.locale].noPosts
  const description = data.site.siteMetadata[intl.locale].talks.description
  const social = data.site.siteMetadata.social
  const posts = data.talks.nodes
  const author = data.site.siteMetadata.author.name
  const keywords = data.site.siteMetadata.keywords
  const image = data.allFile.edges[0].node.publicURL

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
          <TalkItem
            key={post.fields.slug}  
            title={post.frontmatter.title}  
            date={post.frontmatter.date}
            image={post.frontmatter.image}
            slides={post.frontmatter.slides}
            event={post.frontmatter.event}
            where={post.frontmatter.where}
            video={post.frontmatter.video}
            website={post.frontmatter.website}
          />
        )
      })}
    </LayoutContent>
  )
}

export default TalksIndex

export const pageQuery = graphql`
  query TalksList {
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
          talks {
            title
            description
          }
        }
      }
    }
    talks: allMarkdownRemark(
      filter: {
        fileAbsolutePath: { regex: "/content/talks/" }
        frontmatter: { layout: { eq: "talk" } }
      }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      nodes {
        excerpt(pruneLength: 200)
        fields {
          slug
        }
        frontmatter {
          date
          title
          slides
          event
          where
          video
          website
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
