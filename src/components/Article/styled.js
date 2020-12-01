import styled from "styled-components"

export const Headline = styled.h1`
  font-size: 4rem;
  font-weight: 900;
  line-height: 1.5;
`
export const Article = styled.article`
  line-height: 2;
  font-size: 1.2rem;
`
export const Header = styled.header``

export const Date = styled.span`
  color: gray;
`

export const Section = styled.section`
  margin-top: 2em;

  ul,
  ol {
    margin-top: -0.5em;
  }

  ol {
    list-style-type: decimal;
    margin-left: 1em;
    margin-bottom: 2em;
  }

  ul {
    list-style-type: disc;
    margin-left: 1em;
    margin-bottom: 2em;
  }

  h1 {
    font-size: 4rem;
    font-weight: 900;
  }

  h2 {
    font-weight: 900;
    font-size: 2.5rem;
  }

  h3 {
    font-weight: 900;
    font-size: 1.5rem;
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
    margin-top: 1em;
  }

  p {
    margin: 0 0 2em 0;
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
