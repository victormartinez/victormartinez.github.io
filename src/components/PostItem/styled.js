import styled from "styled-components"
import media from "styled-media-query"
import { Link } from "gatsby"
import Img from "gatsby-image"

export const PostItemWrapper = styled.article`
  display: flex;
  margin-bottom: 0.5em;
  
  ${media.greaterThan("medium")`
    color: white;
  `};

  ${media.lessThan("medium")`
    flex-direction: column;
    padding: 1em;
    background-color: #f3f3f3;
    margin-bottom: 3em;
    border-radius: 10px;
  `};
`

export const ImageSection = styled.div``

export const PostLink = styled(Link)``

export const Image = styled(Img)`

  border-radius: 10px 10px 0 0;


  ${media.greaterThan("medium")`
    display: None;
  `};

  ${media.greaterThan("small")`
    width: 20em;
    height: 7em;
  `}

  ${media.between("small", "medium")`
    width: 95vw;
    height: 25vh;
  `}
`

export const TextSection = styled.section`
  width: 100vw;
  padding: 1em 1em 0em 0em;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  ${media.lessThan("small")`
    width: 95vw;
  `};
`

export const Header = styled.header`
`

export const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  line-height: 1.5;
`

export const Metadata = styled.div`
  margin: 0.4em 0;
  font-weight: 300;
  line-height: 1.8;
  font-size: 0.9rem;

  ${media.greaterThan("medium")`
    font-weight: 400;
  `};
`

export const Bullet = styled.span`
  margin: 0 1em;
`

export const Category = styled.span``

export const Date = styled.time``

export const ReadingTime = styled.span``
