import media from "styled-media-query"
import styled from "styled-components"

export const HeroWrapperBg = styled.div`
  display: flex;
  background-color: #000;
  background-image: url("https://images.unsplash.com/photo-1510519138101-570d1dca3d66?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1931&q=80");
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

  ${media.lessThan("large")`
    font-size: 1rem;
    width: 100vw;
    padding: 1em;
  `}
`
