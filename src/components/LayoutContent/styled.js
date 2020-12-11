import styled from "styled-components"
import media from "styled-media-query"

export const MainWrapper = styled.main`
  background-color: #fff;
  margin-top: -5em;
  min-height: 100vh;
  padding: 2em;
  width: 100vw;

  ${media.greaterThan("large")`
    width: 70em;
    margin: 0 auto;
    margin-top: -5em;
  `}

  ${media.lessThan("medium")`
    width: 100vw;
    padding: 0;
    margin-top: 0;
  `}
`
