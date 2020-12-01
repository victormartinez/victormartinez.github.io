import React from "react"

import * as S from "./styled"

const TopBar = () => {
  return (
    <S.TopBarHeader>
      <S.TopBarContainer>
        <S.Logo to="/">Victor Martinez</S.Logo>
        <S.Nav>
          <S.NavList>
            <S.NavItem>
              <S.NavLink to="/">Home</S.NavLink>
            </S.NavItem>
            <S.NavItem>
              <S.NavLink to="/about">About</S.NavLink>
            </S.NavItem>
            <S.NavItem>
              <S.NavLink to="/talks">Talks</S.NavLink>
            </S.NavItem>
            <S.NavItem>
              <S.NavLink to="/">RSS</S.NavLink>
            </S.NavItem>
          </S.NavList>
        </S.Nav>
      </S.TopBarContainer>
    </S.TopBarHeader>
  )
}

export default TopBar
