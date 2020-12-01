import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const Talks = ({ data, location }) => {
  const talks = data.site.siteMetadata.talks
  const social = data.site.siteMetadata.social

  return (
    <Layout
      location={location}
      title={talks.title}
      description={talks.description}
      heroSocial={social}
      footerSocial={social}
    >
      <SEO title="Talks" />
      <main>Talks</main>
    </Layout>
  )
}

export default Talks

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        description
        social {
          twitter
          github
          linkedin
        }
        talks {
          title
          description
          data {
            event
            website
            when
            where
            title
            slides
            video
          }
        }
      }
    }
  }
`
