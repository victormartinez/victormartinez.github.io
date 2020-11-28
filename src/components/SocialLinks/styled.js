import styled from "styled-components"

export const SocialWrapper = styled.nav``

export const SocialItemList = styled.ul`
  display: flex;
  list-style: none;
  padding: 0;
`

export const SocialItem = styled.li`
  margin-right: 1em;
`

export const SocialItemLink = styled.a`
  color: #b8b8b8;
  text-decoration: none;
  transition: color 0.5s;

  &:hover {
    color: #fff;
  }
`

export const IconWrapper = styled.div`
  width: 3em;
  height: 3em;
`
