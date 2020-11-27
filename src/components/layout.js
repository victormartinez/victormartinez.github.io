import React from "react"
import { Link } from "gatsby"

import Hero from "./Hero"
import TopBar from "./TopBar"
import Footer from "./Footer"

import GlobalStyles from "../styles/global"

import * as S from "./MainWrapper/styled"

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath

  return (
    <>
      <GlobalStyles />
      <TopBar />
      <Hero showBackgroundImage={isRootPath} />
      <S.MainWrapper>{children}</S.MainWrapper>
      <Footer />
    </>
  )
}

export default Layout
