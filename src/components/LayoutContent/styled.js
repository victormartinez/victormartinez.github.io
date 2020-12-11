import styled from "styled-components"
import media from "styled-media-query"

export const MainWrapper = styled.main`
  margin: 0 auto;
  width: 70em;
  background-color: #fff;
  margin-top: -5em;
  min-height: 100vh;
  padding: 2em;

  ${media.lessThan("small")`
    width: 100vw;
    padding: 0;
    margin-top: 0;
  `}
`
