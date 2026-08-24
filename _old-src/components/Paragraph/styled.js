import styled from "styled-components"
import media from "styled-media-query"

export const Paragraph = styled.p`
  width: 70em;

  ${media.lessThan("medium")`
    width: 100vw;
    padding: 0 1.5em;
    margin-top: 2em;
  `}
`
