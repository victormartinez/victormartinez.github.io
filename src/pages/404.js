import React from "react"
import { graphql } from "gatsby"

import LayoutContent from "../components/LayoutContent"
import SEO from "../components/seo"
import NotFound from "../components/NotFound"

const NotFoundPage = ({ data, location }) => {
  const social = data.site.siteMetadata.social

  return (
    <LayoutContent footerSocial={social}>
      <SEO title="404: Not Found" />
      <NotFound />
    </LayoutContent>
  )
}

export default NotFoundPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
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
