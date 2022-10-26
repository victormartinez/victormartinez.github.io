import styled from "styled-components"
import media from "styled-media-query"

export const Wrapper = styled.div`
  display: flex;
  background-color: #090b0b;
  

  ${media.lessThan("small")`
    margin-bottom: 2em;  
  `}
`

export const Container = styled.div`
  margin: 0 auto;
  width: 70em;
  padding: 5em 0 2em 0;

  ${media.lessThan("large")`
    width: 100vw;
    padding: 1.5em;
    padding-top: 6em;
  `}
`

export const Title = styled.h1`
  color: #fff;
  font-size: 4rem;
  padding-bottom: 0.6rem;
  
  background: #21B8CF;
  background: linear-gradient(to right, #21B8CF 0%, #4BCF77 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  ${media.lessThan("small")`
    font-size: 2.8rem;
  `}
`
export const Description = styled.p`
  color: #fff;
  font-size: 1.5rem;
  width: 30em;
  line-height: 1.5;

  ${media.lessThan("medium")`
    font-size: 1rem;
    width: 85vw;
  `}

  ${media.lessThan("small")`
    font-size: 0.8rem;
  `}
`
