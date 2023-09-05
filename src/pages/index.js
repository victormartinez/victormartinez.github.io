import React from "react"
import { graphql } from "gatsby"

import LayoutMarketing from "../components/LayoutMarketing"
import SEO from "../components/seo"

import { useIntl } from "gatsby-plugin-intl"

const HomeIndex = ({ data }) => {
  const intl = useIntl()

  const siteTitle = data.site.siteMetadata[intl.locale].title
  const description = data.site.siteMetadata[intl.locale].description
  const subdescription = data.site.siteMetadata[intl.locale].subdescription
  const social = data.site.siteMetadata.social
  const author = data.site.siteMetadata.author.name
  const keywords = data.site.siteMetadata.keywords
  const image = data.allFile.edges[0].node.publicURL

  return (
    <>
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
      <LayoutMarketing
        title={siteTitle}
        description={description}
        subdescription={subdescription}
        social={social}
      />
    </>
  )
}

export default HomeIndex

export const pageQuery = graphql`
  query {
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
        keywords
        author {
          name
        }
        pt {
          title
          description
          subdescription
        }
        social {
          twitter
          github
          linkedin
          speakerdeck
          instagram
        }
      }
    }
  }
`
