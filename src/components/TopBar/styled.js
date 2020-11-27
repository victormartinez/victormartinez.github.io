import styled from "styled-components"
import { Link } from "gatsby"

export const TopBarHeader = styled.header`
  background-color: #f2f2f2;
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
  display: inline-block;
  display: flex;
  align-items: center;
  min-height: 3.125rem;
`

export const Nav = styled.nav``

export const NavList = styled.ul``

export const NavItem = styled.li`
  list-style-type: none;
  display: inline-block;
  margin-right: 1em;
`
export const NavLink = styled(Link)`
  text-decoration: none;
`
