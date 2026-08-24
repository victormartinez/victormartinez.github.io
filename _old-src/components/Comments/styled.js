import styled from "styled-components"

export const CommentsWrapper = styled.section`
  color: #c8c8c8;
  background-color: #222631;
  border-top: 1px solid #c8c8c8;
  padding-top: 1em;

  iframe[src*="ads-iframe"] {
    display: none;
  }

  #disqus_thread {
    a {
      color: #1fa1f2 !important;
    }
  }
`