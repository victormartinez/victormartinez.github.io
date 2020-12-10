import styled from "styled-components"

export const Wrapper = styled.div`
  display: flex;
  background-color: #090b0b;
  height: ${props => (props.content ? `40vh` : `20vh`)};
`

export const Container = styled.div`
  margin: 0 auto;
  width: 70em;
  margin-top: 10vh;
`

export const Title = styled.h1`
  margin-bottom: 0.5em;
  color: #fff;
  font-size: 4rem;
`
export const Description = styled.p`
  color: #fff;
  font-size: 1.5rem;
  width: 30em;
  line-height: 1.5;
`
