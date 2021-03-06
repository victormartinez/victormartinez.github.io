import React, { useState } from "react"
import { useIntl, changeLocale } from "gatsby-plugin-intl"
import { CloseCircleOutline } from "@styled-icons/evaicons-outline/CloseCircleOutline"

import SocialLinks from "../SocialLinks"
import { homeUrl, blogUrl } from "../../utils/routing.js"

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
        <S.MenuLink to={blogUrl(intl.locale)}>Blog</S.MenuLink>
        <S.MenuLanguage>
          <S.MenuAnchor
            className={intl.locale === `en` ? `active` : undefined}
            onClick={() => changeLocale(`en`, `/`)}
          >
            EN
          </S.MenuAnchor>
          <S.MenuAnchor
            className={intl.locale === `pt` ? `active` : undefined}
            onClick={() => changeLocale(`pt`, `/`)}
          >
            PT
          </S.MenuAnchor>
        </S.MenuLanguage>
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
          </S.Nav>
        </S.BarHeader>
      )}
      {sidebarOpen && <SideMenu />}
    </>
  )
}

export default Sidebar
