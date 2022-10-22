import React from "react"

import { homeUrl, blogUrl } from "../../utils/routing.js"
import { useIntl } from "gatsby-plugin-intl"

import * as S from "./styled"

const TopBar = () => {
  const intl = useIntl()

  return (
    <S.TopBarHeader>
      <S.TopBarContainer>
        <S.Logo to={homeUrl(intl.locale)}>Victor Martinez</S.Logo>
        <S.Nav>
          <S.NavList>
            <S.NavItem>
              <S.NavLink to={homeUrl(intl.locale)}>Home</S.NavLink>
            </S.NavItem>
            <S.NavItem>
              <S.NavLink to={`${blogUrl(intl.locale)}`}>Blog</S.NavLink>
            </S.NavItem>
          </S.NavList>
        </S.Nav>
      </S.TopBarContainer>
    </S.TopBarHeader>
  )
}

export default TopBar
