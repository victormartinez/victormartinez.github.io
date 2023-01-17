import styled from "styled-components"
import media from "styled-media-query"

export const Headline = styled.h1`
  font-size: 3.5rem;
  font-weight: 900;
  line-height: 1.5;
  text-align: center;

  ${media.lessThan("small")`
    font-size: 2.8rem;
  `}
`
export const Article = styled.article`
  line-height: 2.3rem;
  font-size: 1.1rem;
`
export const Header = styled.header`
  text-align: center;
`

export const DateBox = styled.div`
  color: gray;
`

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
  color: gray;
  padding: 0 0.5em;
  font-weight: 300;

  ${media.lessThan("small")`
    margin-top: 0.5em;
  `}
`

export const TagItemFirst = styled.li`
  font-weight: 600;
  margin-right: 1em;
  color: gray;

  ${media.lessThan("small")`
    margin-top: 0.5em;
  `}
`

export const Section = styled.section`
  margin-top: 2em;

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
    margin-bottom: 0.5em;
  }

  ul {
    list-style-type: disc;
    margin-left: 1em;
    margin-bottom: 2em;
    margin-top: 0.5em;
  }

  h1 {
    font-size: 3.5rem;
    font-weight: 900;
  }

  h2 {
    font-weight: 900;
    font-size: 2rem;
    margin-top: 1.2em;
  }

  h3 {
    font-weight: 900;
    font-size: 1.4rem;
    margin-top: 0.5em;
  }

  h4,
  h5,
  h6 {
    font-weight: 900;
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
    font-weight: 900;
  }

  .gatsby-highlight {
    margin-bottom: 2em;
  }
`
