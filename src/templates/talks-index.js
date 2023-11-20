import React from "react"
import { graphql } from "gatsby"

import LayoutContent from "../components/LayoutContent"
import Talks from "../components/Talks"
import Paragraph from "../components/Paragraph"
import SEO from "../components/seo"

import { useIntl } from "gatsby-plugin-intl"

const TalksIndex = ({ data }) => {
  const intl = useIntl()

  const siteTitle = data.site.siteMetadata[intl.locale].talks.title
  const noTalks = data.site.siteMetadata[intl.locale].noTalks
  const description = data.site.siteMetadata[intl.locale].talks.description
  const social = data.site.siteMetadata.social
  const posts = data.talks.nodes
  const author = data.site.siteMetadata.author.name
  const keywords = data.site.siteMetadata.keywords
  const image = data.allFile.edges[0].node.publicURL
  const talkElements = posts.map(element => {
    return {
      key: element.fields.slug,
      title: element.frontmatter.title,
      date: element.frontmatter.date,
      image: element.frontmatter.image,
      slides: element.frontmatter.slides,
      event: element.frontmatter.event,
      where: element.frontmatter.where,
      video: element.frontmatter.video,
      website: element.frontmatter.website,
    }
  });

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
        <Paragraph text={noTalks} />
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

      <Talks talks={talkElements} />
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
          noTalks
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
