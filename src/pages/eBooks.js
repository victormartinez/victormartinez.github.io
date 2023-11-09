import React from "react"
import { graphql } from "gatsby"

import LayoutMarketing from "../components/LayoutMarketing"
import SEO from "../components/seo"

import { useIntl } from "gatsby-plugin-intl"

const EbooksIndex = ({ data }) => {
  const intl = useIntl()

  const siteTitle = data.site.siteMetadata[intl.locale].eBooks.title
  const description = data.site.siteMetadata[intl.locale].eBooks.description
  const social = data.site.siteMetadata.social

  return (
    <LayoutMarketing
      title={siteTitle}
      description={description}
      subdescription={``}
      social={social}
    >
      <SEO title={`${siteTitle}`} description={`${siteTitle} ${description}`} />
    </LayoutMarketing>
  )
}

export default EbooksIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        pt {
          eBooks {
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
