import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import NotFound from "../components/NotFound"

const NotFoundPage = ({ data, location }) => {
  const social = data.site.siteMetadata.social

  return (
    <Layout footerSocial={social}>
      <SEO title="404: Not Found" />
      <NotFound />
    </Layout>
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
