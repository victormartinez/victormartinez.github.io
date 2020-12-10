import React from "react"
import { graphql } from "gatsby"

import LayoutMarketing from "../components/LayoutMarketing"
import SEO from "../components/seo"

import { useIntl } from "gatsby-plugin-intl"

const HomeIndex = ({ data }) => {
  const intl = useIntl()

  const siteTitle = data.site.siteMetadata[intl.locale].title
  const description = data.site.siteMetadata[intl.locale].description
  const social = data.site.siteMetadata.social

  return (
    <LayoutMarketing
      title={siteTitle}
      description={description}
      social={social}
    >
      <SEO title={`${siteTitle}`} description={`${siteTitle} ${description}`} />
      AQUI É A PÁGINA INICIAL
    </LayoutMarketing>
  )
}

export default HomeIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        en {
          title
          description
          author {
            name
          }
        }
        pt {
          title
          description
          author {
            name
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
      limit: 3
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
