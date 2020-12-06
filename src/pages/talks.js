import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import TalkItem from "../components/TalkItem"
import SEO from "../components/seo"

const Talks = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.talks.title
  const description = data.site.siteMetadata.talks.description
  const social = data.site.siteMetadata.social
  const talks = data.allMarkdownRemark.nodes

  return (
    <Layout
      location={location}
      title={siteTitle}
      description={description}
      heroSocial={social}
      footerSocial={social}
      heroBackground={`https://images.unsplash.com/photo-1544531585-f14f463149ec?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1950&q=80`}
    >
      <SEO title="Talks" />
      <div
        style={{
          display: "flex",
          width: "65em",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        {talks.map(talk => {
          return (
            <TalkItem
              key={talk.fields.slug}
              title={talk.frontmatter.title}
              date={talk.frontmatter.date}
              image={talk.frontmatter.image}
              slides={talk.frontmatter.slides}
              event={talk.frontmatter.event}
              where={talk.frontmatter.where}
              video={talk.frontmatter.video}
              website={talk.frontmatter.website}
            />
          )
        })}
      </div>
    </Layout>
  )
}

export default Talks

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
        talks {
          title
          description
        }
      }
    }
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/content/talks/" } }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      nodes {
        fields {
          slug
        }
        frontmatter {
          title
          date(formatString: "MMMM DD, YYYY")
          slides
          event
          where
          video
          website
          image {
            childImageSharp {
              fluid(maxHeight: 368, maxWidth: 640) {
                ...GatsbyImageSharpFluid_tracedSVG
              }
            }
          }
        }
      }
    }
  }
`
