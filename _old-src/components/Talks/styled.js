import styled from "styled-components"
import media from "styled-media-query"

import { Link } from "gatsby"
import Img from "gatsby-image"

export const TalkMain = styled.div`
  ${media.greaterThan("medium")`
    display: grid;
    grid-template-columns: auto auto auto;
  `};
`

export const TalkItemWrapper = styled.article`
  display: flex;
  flex-direction: column;
  margin: 0 2em 2em 0;
  background-color: #f3f3f3;
  padding-bottom: 0.5em;
  border-radius: 10px;


  ${media.lessThan("medium")`
    flex-direction: column;
    padding: 1em;
  `};
`

export const ImageSection = styled.div``

export const Url = styled(Link)``

export const Image = styled(Img)`
  border-radius: 10px 10px 0 0;

  ${media.greaterThan("small")`
    height: 12em;
  `}

  ${media.between("small", "medium")`
    height: 25vh;
  `}
`

export const TextSection = styled.section`
  width: 100%;
  padding: 1em 1em 0em 1.5em;
`

export const Header = styled.header`
  
`

export const Title = styled.h2`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 0.5em;
`

export const BodyItems = styled.ul`
  list-style-type: disc;
  padding-left: 1em;
`

export const Item = styled.li`
  margin-bottom: 0.6em;
`

export const ItemText = styled.span``
