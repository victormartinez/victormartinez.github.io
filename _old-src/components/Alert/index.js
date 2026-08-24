import React from "react"

import * as S from "./styled"

const Warning = ({ msg }) => {
  return <S.AlertWrapper>{msg}</S.AlertWrapper>
}

export default Warning
