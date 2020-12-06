import styled from "styled-components"
import { Link } from "gatsby"
import Img from "gatsby-image"

export const TalkItemWrapper = styled.article`
  margin-bottom: 3em;
  background-color: #f3f3f3;
  height: 35rem;
  max-width: 30em;
`

export const ImageSection = styled.div`
  max-width: 30em;
  max-height: 20em;
`

export const Url = styled(Link)``

export const Image = styled(Img)`
  width: 30em;
  height: 20em;
`

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

export const BodyItems = styled.ul``

export const Item = styled.li`
  height: 2em;

  & > svg {
    height: 2em;
  }
`

export const ItemText = styled.span``
