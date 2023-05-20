import styled from "styled-components"
import media from "styled-media-query"

export const Headline = styled.h1`
  font-size: 3.5rem;
  font-weight: 600;
  line-height: 1.5;
  text-align: center;

  ${media.lessThan("small")`
    font-size: 2.8rem;
  `}
`
export const Article = styled.article`
  line-height: 2.2rem;
  font-size: 1.2rem;
  color: #c8c8c8;
  margin-bottom: 1em;
`

export const Header = styled.header`
  text-align: center;
`

export const DateBox = styled.div``

export const Date = styled.span``

export const TagsWrapper = styled.div``

export const TagsList = styled.ul`
  display: flex;
  flex-direction: row;
  list-style-type: none;
  margin-top: 4em;
  flex-wrap: wrap;
`

export const TagItem = styled.li`
  margin-right: 1em;
  background-color: #f5f2f0;
  color: #222631;
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

    pre {
      background-color: #2b2f3a;

      code {
        text-shadow: none;
      }
    }
  }
`
