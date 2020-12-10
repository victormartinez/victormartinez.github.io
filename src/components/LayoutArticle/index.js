import React from "react"

import BlackHeader from "../BlackHeader"
import TopBar from "../TopBar"
import Footer from "../Footer"

import GlobalStyles from "../../styles/global"

import * as S from "./styled"

const LayoutArticle = ({ social, children }) => {
  return (
    <>
      <GlobalStyles />
      <TopBar />
      <BlackHeader />
      <S.MainWrapper>{children}</S.MainWrapper>
      <Footer social={social} />
    </>
  )
}

export default LayoutArticle
