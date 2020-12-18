import styled from "styled-components"
import { Link } from "gatsby"

export const NotFoundWrapper = styled.section`
  text-align: center;
  display: flex;
  flex-direction: column;
`

export const Oops = styled.span`
  font-size: 6rem;
  margin-top: 1em;
`

export const Title = styled.h1`
  font-size: 2rem;
  margin: 1em 0;
`

export const Description = styled.p`
  font-weight: 300;
`

export const Footer = styled.footer`
  margin: 1em 0;
  font-weight: 300;
`

export const Url = styled(Link)``
