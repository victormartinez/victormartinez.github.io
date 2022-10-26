import styled from "styled-components"
import media from "styled-media-query"

export const MainWrapper = styled.main`
  margin: 0 auto;
  width: 70em;
  background-color: #fff;
  min-height: 100vh;
  padding: 2em;

  ${media.lessThan("large")`
    width: 100vw;
  `}
`
