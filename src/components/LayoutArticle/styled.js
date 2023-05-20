import styled from "styled-components"
import media from "styled-media-query"

export const MainWrapper = styled.main`
  margin: 0 auto;
  width: 70em;
  min-height: 100vh;

  ${media.lessThan("large")`
    width: 100vw;
  `}
`
