import styled from "styled-components"
import media from "styled-media-query"

export const Headline = styled.h1`
  font-size: 3.5rem;
  font-weight: 600;
  line-height: 1.5;
  text-align: center;
  color: white;

  ${media.lessThan("small")`
    font-size: 2.8rem;
  `}
`
export const Article = styled.article`
  line-height: 2.2rem;
  font-size: 1.3rem;
  color: #c8c8c8;
  margin-bottom: 1em;

  .gatsby-highlight, .gatsby-highlight pre {
    background-color: #fdf6e3;
    border-radius: 0.3em;
    padding: 0.5em 1em;
    overflow: auto;
  }
`

export const Header = styled.header`
  text-align: center;
  color: white;
`

export const DateBox = styled.div``

export const Date = styled.span``

export const TagsWrapper = styled.div`
  font-style: italic;
`

export const TagsList = styled.ul`
  display: flex;
  flex-direction: row;
  list-style-type: none;
  margin-top: 4em;
  flex-wrap: wrap;
  font-size: 1rem;
`

export const TagItem = styled.li`
  margin-right: 1em;
  padding: 0 0.5em;
  font-weight: 600;

  ${media.lessThan("small")`
    margin-top: 0.5em;
  `}
`

export const TagItemFirst = styled.li`
  font-weight: 600;
  margin-right: 1em;
  color: white;

  ${media.lessThan("small")`
    margin-top: 0.5em;
  `}
`

export const Section = styled.section`
  margin-top: 4em;

  b, strong {
    color: white;
  }

  ul,
  ol {
    margin-top: -0.5em;
    padding-left: 1em;
  }

  ol {
    list-style-type: decimal;
    margin-left: 1em;
    margin-bottom: 2em;
  }

  li {
    margin-bottom: 1em;
  }

  ul {
    list-style-type: disc;
    margin-left: 1em;
    margin-bottom: 2em;
    margin-top: 0.5em;
  }

  h1 {
    font-size: 3.5rem;
    font-weight: 600;
  }

  h2 {
    font-weight: 600;
    font-size: 2rem;
    margin-top: 1.5em;
  }

  h3 {
    font-weight: 600;
    font-size: 1.4rem;
    margin-top: 0.8em;
  }

  h4,
  h5,
  h6 {
    font-weight: 600;
    font-size: 1rem;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-bottom: 0.5em;
  }

  p {
    margin: 0 0 1em 0;
  }

  li code, p code {
    font-size: 0.8em;
    padding: 0.2em 0.3em;
  }

  ul > p,
  li > p {
    margin: -0.5em 0 1em 0;
  }

  table {
    width: 100%;
  }

  thead,
  th,
  tr {
    border-bottom: 1px solid #222;
    text-align: center;
  }

  td {
    text-align: center;
  }

  blockquote {
    border-left: 4px solid gray;
    padding-left: 1em;
    font-style: italic;
  }

  strong {
    font-weight: 600;
  }

  .gatsby-highlight {
    margin-bottom: 2em;
    font-size: 0.8em;

    pre {
      code {
        text-shadow: none;
      }
    }
  }
`
