import styled from "styled-components"
import { Link } from "gatsby"

export const PostItemWrapper = styled.article`
  margin-bottom: 3em;
  background-color: #f3f3f3;
  display: flex;
  max-height: 23rem;
`

export const ImageSection = styled.div`
  width: 40em;
  height: 23em;
  background-color: blue;
`

export const ImageLink = styled(Link)``

export const Image = styled.img``

export const TextSection = styled.section`
  width: 100%;
  padding: 1em 1.5em;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

export const Header = styled.header`
  margin-bottom: 1em;
`

export const Title = styled.h2`
  font-size: 1.8em;
  font-weight: 600;
  line-height: 1.5;
  margin-bottom: 0.5em;
`

export const Description = styled.p`
  line-height: 1.8;
  font-size: 1.1rem;
  font-weight: 300;
`

export const Footer = styled.footer`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 2em;
`

export const FooterItem = styled.p``
