import styled from "styled-components"
import media from "styled-media-query"
import { Link } from "gatsby"

export const BarHeader = styled.header`
  position: fixed !important;
  width: 100vw;
  z-index: 99999;
  overflow: auto;
  background-color: #090b0b;
  padding: 0 0 0.2em 0;
  display: flex;
  justify-content: flex-start;
  font-size: 1.2rem;

  ${media.greaterThan("large")`
    display: none;
  `}
`

export const Nav = styled.nav``

export const HamburgerButton = styled.button`
  border: none;
  background: none;
  color: #fff;
  cursor: pointer;
  font-size: 2em;
`

export const HomeNavLink = styled(Link)`
  color: #fff !important;

  :hover {
    border-bottom: 1px dashed #fff;
  }
`

export const SidebarWrapper = styled.aside`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100vh;
  width: 20em;
  background-color: #090b0b;
  position: fixed !important;
  z-index: 99999;
  overflow: auto;
`

export const Menu = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1em;
  width: 30%;
`

export const MenuLink = styled(Link)`
  margin: 1em 0;
  text-align: center;
`

export const MenuLanguage = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 1em;
`

export const MenuAnchor = styled.a`
  text-decoration: none;
  color: #000;
  background-color: #fff;
  cursor: pointer;
  padding: 0.2em;
  border-radius: 10%;
  font-size: 0.7em;
  padding: 0.5em;

  &.active {
    background-color: #b8b8b8;
    font-weight: 900;
  }

  &:visited {
    color: #fff;
  }

  &:hover {
    border-bottom: none;
  }
`

export const CloseButtonWrapper = styled.div`
  height: 2em;
  width: 2em;
  color: white;
  cursor: pointer;
  margin-top: 1em;
`

export const Footer = styled.footer`
  display: flex;
  align-items: center;
  margin-bottom: 5em;
`
