import styled from "styled-components"
import media from "styled-media-query"

export const CommentsWrapper = styled.section`
  color: #c8c8c8;
  background-color: #222631;
  border-top: 1px solid #c8c8c8;
  padding-top: 1em;
  margin-top: 5em;

  iframe[src*="ads-iframe"] {
    display: none;
  }

  #disqus_thread {
    a {
      color: #1fa1f2 !important;
    }
  }
`

export const CommentsTitle = styled.h2`
  font-weight: 900;
  font-size: 1.5rem;

  ${media.lessThan("small")`
    margin-bottom: 2em;
  `}
`
