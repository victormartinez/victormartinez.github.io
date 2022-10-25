import media from "styled-media-query"
import styled from "styled-components"

import officeBackground from "../../../content/assets/office-background.jpeg"

export const HeroWrapperBg = styled.div`
  display: flex;
  background-color: #090b0b;
  /*background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url(${officeBackground});*/
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 90vh;
`

export const HeroContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  width: 100%;
  text-align: center;
`

export const Title = styled.h1`
  margin-bottom: 0.5em;
  color: #fff;
  font-size: 4rem;

  background: #21B8CF;
  background: linear-gradient(to right, #21B8CF 0%, #4BCF77 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  ${media.lessThan("large")`
    font-size: 2.8rem;
  `}
`
export const Description = styled.p`
  color: #fff;
  font-size: 1.5rem;
  margin: 0 auto;
  width: 30em;
  line-height: 1.5;
  text-align: center;
  margin-bottom: 1em;

  ${media.lessThan("large")`
    font-size: 1rem;
    width: 100vw;
    padding: 1em;
  `}
`
