import React from "react"

import { changeLocale } from "gatsby-plugin-intl"

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
              <S.NavAnchor onClick={() => changeLocale("en")}>EN</S.NavAnchor>
            </S.NavItem>
            <S.NavItem>
              <S.NavAnchor onClick={() => changeLocale("pt")}>
                PT-BR
              </S.NavAnchor>
            </S.NavItem>
          </S.NavList>
        </S.Nav>
      </S.TopBarContainer>
    </S.TopBarHeader>
  )
}

export default TopBar
