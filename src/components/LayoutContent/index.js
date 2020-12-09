import React from "react"

import Hero from "../Hero"
import TopBar from "../TopBar"
import Footer from "../Footer"

import GlobalStyles from "../../styles/global"

import * as S from "./styled"

const LayoutContent = ({
  title,
  description,
  heroSocial,
  footerSocial,
  children,
}) => {
  return (
    <>
      <GlobalStyles />
      <TopBar />
      <Hero title={title} description={description} social={heroSocial} />
      <S.MainWrapper>{children}</S.MainWrapper>
      <Footer social={footerSocial} />
    </>
  )
}

export default LayoutContent
