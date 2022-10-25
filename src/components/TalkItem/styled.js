import styled from "styled-components"
import { Link } from "gatsby"
import Img from "gatsby-image"

export const TalkItemWrapper = styled.article`
  margin-bottom: 3em;
  background-color: #f3f3f3;
  display: flex;
  flex-direction: row;
`

export const ImageSection = styled.div`
  max-width: 30em;
  max-height: 20em;
`

export const Url = styled(Link)``

export const Image = styled(Img)`
  width: 20em;
  height: 15em;
  filter: grayscale(100%);
  -webkit-filter: grayscale(100%);

  :hover {
    filter: none;
    -webkit-filter: grayscale(0);
  }
`

export const TextSection = styled.section`
  width: 100%;
  padding: 0.5em 1.5em;
`

export const Header = styled.header`
  margin-bottom: 0.5em;
`

export const Title = styled.h2`
  font-size: 1.8em;
  font-weight: 600;
  line-height: 1.5;
  margin-bottom: 0.5em;
`

export const BodyItems = styled.ul`
  list-style-type: disc;
  padding-left: 1em;
`

export const Item = styled.li`
  height: 2em;
`

export const ItemText = styled.span``
