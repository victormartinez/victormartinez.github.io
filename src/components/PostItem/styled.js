import styled from "styled-components"
import media from "styled-media-query"
import { Link } from "gatsby"
import Img from "gatsby-image"

export const PostItemWrapper = styled.article`
  background-color: #f3f3f3;
  display: flex;
  margin-bottom: 3em;

  ${media.lessThan("medium")`
    flex-direction: column;
    padding: 1em;
  `};
`

export const ImageSection = styled.div``

export const PostLink = styled(Link)``

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
  width: 100vw;
  padding: 1em 1em 0em 1.5em;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  ${media.lessThan("small")`
    width: 95vw;
  `};
`

export const Header = styled.header`
  margin-bottom: 1em;
`

export const Title = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.5;
`

export const Description = styled.p`
  line-height: 1.8;
  font-size: 1rem;
  font-weight: 300;
`

export const Metadata = styled.div`
  margin: 0.5em 0;
  font-weight: 300;
  line-height: 1.8;
  font-size: 0.9rem;
`

export const Bullet = styled.span`
  margin: 0 1em;
`

export const Category = styled.span``

export const Date = styled.time``

export const ReadingTime = styled.span``
