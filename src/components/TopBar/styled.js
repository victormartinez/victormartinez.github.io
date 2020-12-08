import styled from "styled-components"
import { Link } from "gatsby"

export const TopBarHeader = styled.header`
  background-color: transparent;
  height: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const TopBarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 70em;
`

export const Logo = styled(Link)`
  display: flex;
  align-items: center;
  min-height: 3.125rem;
  text-decoration: none;

  &:visited {
    color: #fff;
  }

  &:hover {
    border-bottom: 1px dashed #fff;
  }
`

export const Nav = styled.nav`
  text-decoration: none;
  display: flex;
  align-items: center;
  color: #fff;
`

export const NavList = styled.ul`
  display: flex;
`

export const NavItem = styled.li`
  flex-direction: row;
  list-style-type: none;
  margin-right: 1em;
`
export const NavLink = styled(Link)`
  text-decoration: none;

  &:visited {
    color: #fff;
  }

  &:hover {
    border-bottom: 1px dashed #fff;
  }
`

export const NavAnchor = styled.a`
  text-decoration: none;
  background-color: #b8b8b8;
  cursor: pointer;
  padding: 0.2em;

  &:visited {
    color: #fff;
  }

  &:hover {
    border-bottom: none;
  }
`
