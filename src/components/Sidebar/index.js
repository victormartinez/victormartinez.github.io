import React, { useState } from "react"
import { useIntl } from "gatsby-plugin-intl"
import { CloseCircleOutline } from "@styled-icons/evaicons-outline/CloseCircleOutline"

import SocialLinks from "../SocialLinks"
import { homeUrl, pageUrl } from "../../utils/routing.js"

import * as S from "./styled"

const Sidebar = ({ social }) => {
  const intl = useIntl()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const SideMenu = () => (
    <S.SidebarWrapper>
      <S.CloseButtonWrapper>
        <CloseCircleOutline onClick={() => setSidebarOpen(!sidebarOpen)} />
      </S.CloseButtonWrapper>

      <S.Menu>
        <S.MenuLink to={homeUrl(intl.locale)}>Home</S.MenuLink>
        <S.MenuLink to={pageUrl(intl.locale, 'blog')}>Blog</S.MenuLink>
        <S.MenuLink to={pageUrl(intl.locale, 'talks')}>Talks</S.MenuLink>
      </S.Menu>
      <S.Footer>{social && <SocialLinks data={social} />}</S.Footer>
    </S.SidebarWrapper>
  )

  return (
    <>
      {!sidebarOpen && (
        <S.BarHeader>
          <S.Nav>
            <S.HamburgerButton onClick={() => setSidebarOpen(!sidebarOpen)}>
              ☰
            </S.HamburgerButton>
            <S.HomeNavLink to={homeUrl(intl.locale)}>Victor Martinez</S.HomeNavLink>
          </S.Nav>
        </S.BarHeader>
      )}
      {sidebarOpen && <SideMenu />}
    </>
  )
}

export default Sidebar
