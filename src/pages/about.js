import React from "react"
import { graphql } from "gatsby"
import Image from "gatsby-image"

import Layout from "../components/layout"
import SEO from "../components/seo"

const BlogIndex = ({ data, location }) => {
  const avatar = data?.avatar
  const author = data.site.siteMetadata?.author.name
  const siteTitle = data.site.siteMetadata?.about.title
  const description = data.site.siteMetadata?.about.description
  const social = data.site.siteMetadata.social

  return (
    <Layout
      location={location}
      title={siteTitle}
      description={description}
      heroSocial={social}
      footerSocial={social}
    >
      <SEO title="All posts" />
      <div style={{ height: "200em" }}>
        <Image
          fluid={avatar?.childImageSharp.fluid}
          alt={author?.name || ``}
          imgStyle={{ borderRadius: "50%" }}
          style={{ width: "20em" }}
        />
      </div>
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    avatar: file(absolutePath: { regex: "/profile-removebg.png/" }) {
      childImageSharp {
        fluid {
          ...GatsbyImageSharpFluid_tracedSVG
        }
      }
    }
    site {
      siteMetadata {
        title
        description
        author {
          name
        }
        social {
          twitter
          github
          linkedin
          speakerdeck
        }
        about {
          title
          description
        }
      }
    }
  }
`
