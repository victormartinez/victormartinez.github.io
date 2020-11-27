import React from "react"

import * as S from "./styled"

const Footer = () => {
  return (
    <S.FooterWrapper>
      <S.Footer>
        Copyright © {new Date().getFullYear()} Victor Martinez
      </S.Footer>
    </S.FooterWrapper>
  )
}

export default Footer
