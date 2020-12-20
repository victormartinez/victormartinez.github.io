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
  const author = data.site.siteMetadata.author.name

  return (
    <LayoutMarketing
      title={siteTitle}
      description={description}
      social={social}
    >
      <SEO
        title={`${author} | ${siteTitle}`}
        description={`${siteTitle} ${description}`}
      />
    </LayoutMarketing>
  )
}

export default HomeIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        author {
          name
        }
        en {
          title
          description
        }
        pt {
          title
          description
        }
        social {
          twitter
          github
          linkedin
          speakerdeck
        }
      }
    }
  }
`
