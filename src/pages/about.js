import React from "react"
import { graphql } from "gatsby"

import LayoutMarketing from "../components/LayoutMarketing"
import SEO from "../components/seo"

import { useIntl } from "gatsby-plugin-intl"

const AboutIndex = ({ data }) => {
  const intl = useIntl()

  const siteTitle = data.site.siteMetadata[intl.locale].about.title
  const description = data.site.siteMetadata[intl.locale].about.description
  const social = data.site.siteMetadata.social

  return (
    <LayoutMarketing
      title={siteTitle}
      description={description}
      social={social}
    >
      <SEO title={`${siteTitle}`} description={`${siteTitle} ${description}`} />
    </LayoutMarketing>
  )
}

export default AboutIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        pt {
          about {
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
  }
`
