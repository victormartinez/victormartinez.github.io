import React from "react"

import * as S from "./styled"

const BlackHeader = ({ title, description }) => {
  return (
    <S.Wrapper content={title || description}>
      <S.Container>
        {title && <S.Title>{title}</S.Title>}
      </S.Container>
    </S.Wrapper>
  )
}

export default BlackHeader
