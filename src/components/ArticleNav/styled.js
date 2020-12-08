import styled from "styled-components"
import { Link } from "gatsby"

export const Nav = styled.nav`
  margin-top: 4em;
`

export const LinksWrapper = styled.ul`
  display: flex;
  flexwrap: wrap;
  justify-content: space-between;
  liststyle: none;
  padding: 0;
`

export const NavItem = styled.li`
  background-color: #f3f3f3;
  padding: 1em;
`

export const NavLink = styled(Link)``
