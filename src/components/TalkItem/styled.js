import styled from "styled-components"
import media from "styled-media-query"

import { Link } from "gatsby"
import Img from "gatsby-image"

export const TalkItemWrapper = styled.article`
  margin-bottom: 3em;
  background-color: #f3f3f3;
  display: flex;
  flex-direction: row;

  ${media.lessThan("medium")`
    flex-direction: column;
    padding: 1em;
  `};
`

export const ImageSection = styled.div`
  max-width: 30em;
  max-height: 20em;
`

export const Url = styled(Link)``

export const Image = styled(Img)`
  ${media.greaterThan("small")`
    width: 20em;
    height: 15em;
  `}

  ${media.between("small", "medium")`
    width: 95vw;
    height: 25vh;
  `}
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
