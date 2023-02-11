import styled from "styled-components"
import media from "styled-media-query"

import { Link } from "gatsby"
import Img from "gatsby-image"

export const TalkItemWrapper = styled.article`
  background-color: #f3f3f3;
  display: flex;
  margin-bottom: 3em;

  ${media.lessThan("medium")`
    flex-direction: column;
    padding: 1em;
  `};
`

export const ImageSection = styled.div``

export const Url = styled(Link)``

export const Image = styled(Img)`
  ${media.greaterThan("small")`
    width: 20em;
    height: 12em;
  `}

  ${media.between("small", "medium")`
    width: 95vw;
    height: 25vh;
  `}
`

export const TextSection = styled.section`
  width: 100%;
  padding: 1em 1em 0em 1.5em;
`

export const Header = styled.header`
  margin-bottom: 1em;
`

export const Title = styled.h2`
  font-size: 1.3rem;
  font-weight: 600;
`

export const BodyItems = styled.ul`
  list-style-type: disc;
  padding-left: 1em;
`

export const Item = styled.li`
  margin-bottom: 0.6em;
`

export const ItemText = styled.span``
