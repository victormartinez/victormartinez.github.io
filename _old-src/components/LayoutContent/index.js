import React from "react"

import BlackHeader from "../BlackHeader"
import Sidebar from "../Sidebar"
import TopBar from "../TopBar"
import Footer from "../Footer"

import GlobalStyles from "../../styles/global"

import * as S from "./styled"

const LayoutContent = ({ title, description, social, children }) => {
  return (
    <>
      <GlobalStyles />
      <TopBar />
      <Sidebar social={social} />
      <BlackHeader title={title} description={description} />
      <S.MainWrapper>{children}</S.MainWrapper>
      <Footer social={social} />
    </>
  )
}

export default LayoutContent
