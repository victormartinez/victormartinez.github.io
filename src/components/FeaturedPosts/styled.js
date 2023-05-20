import styled from "styled-components"
import media from "styled-media-query"
import { Link } from "gatsby"
import Img from "gatsby-image"


export const FeaturedPostsRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  ${media.lessThan("medium")`
    flex-direction: column;
  `};
`

export const PostItemFeaturedWrapper = styled.article`
  background-color: #f3f3f3;
  margin-bottom: 2em;
  flex-direction: column;
  width: 32%;

  ${media.lessThan("medium")`
    padding: 1em;
    width: 100%;

  `};
`

export const ImageSection = styled.div`
  width: 100%;
`

export const PostLink = styled(Link)``

export const Image = styled(Img)`
  -webkit-filter: grayscale(100%); /* Safari 6.0 - 9.0 */
  filter: grayscale(100%);

  &:hover {
    -webkit-filter: grayscale(0%); /* Safari 6.0 - 9.0 */
    filter: grayscale(0%);
  }

  ${media.greaterThan("small")`
    width: 100%;
    height: 7em;
  `}

  ${media.between("small", "medium")`
    width: 95vw;
    height: 25vh;
  `}
`

export const TextSection = styled.section`
  padding: 0.5em 0.5em 0em 0.8em;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  ${media.lessThan("small")`
    width: 95vw;
  `};
`

export const Header = styled.header`
  display: flex;
  flex-direction: column;
`

export const Title = styled.h2`
  font-size: 1.4rem;
  font-weight: 600;
  line-height: 1.5;
`

export const Metadata = styled.div`
  margin: 0.4em 0;
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
