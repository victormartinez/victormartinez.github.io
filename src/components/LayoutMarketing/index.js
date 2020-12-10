import React from "react"

import Hero from "../Hero"
import TopBar from "../TopBar"
import Footer from "../Footer"

import GlobalStyles from "../../styles/global"

import * as S from "./styled"

const LayoutMarketing = ({ title, description, social, children }) => {
  return (
    <>
      <GlobalStyles />
      <TopBar />
      <Hero title={title} description={description} social={social} />
      {/* <S.MainWrapper>{children}</S.MainWrapper> */}
    </>
  )
}

export default LayoutMarketing
