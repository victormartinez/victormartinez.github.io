import styled from "styled-components"
import media from "styled-media-query"

export const SocialWrapper = styled.nav`
  margin: 0 auto;
`

export const SocialItemList = styled.ul`
  display: flex;
  list-style: none;
  padding: 0;
`

export const SocialItem = styled.li`
  margin-right: 1em;
`

export const SocialItemLink = styled.a`
  color: #b8b8b8 !important;
  text-decoration: none;
  transition: color 0.5s;

  &:hover {
    color: #fff !important;
  }
`

export const IconWrapper = styled.div`
  width: 2em;
  height: 2em;

  ${media.lessThan("large")`
    width: 2em;
    height: 2em;
  `}
`
