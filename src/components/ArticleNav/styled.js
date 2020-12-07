import styled from "styled-components"
import { Link } from "gatsby"

export const Nav = styled.nav`
  margin-top: 4em;
`

export const NavTitle = styled.h3`
  margin-bottom: 1em;
  font-weight: 900;
  font-size: 1.5rem;
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
