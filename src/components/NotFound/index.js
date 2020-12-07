import React from "react"

import * as S from "./styled"

const NotFound = () => {
  return (
    <S.NotFoundWrapper>
      <S.Oops>Oooops!</S.Oops>
      <S.Title>404: Not Found</S.Title>
      <S.Description>
        The page you are looking for might have been removed, had its name
        changed or is temporarily unavailable.
      </S.Description>

      <S.Footer>
        <S.Url to="/">Click here</S.Url> to go home page.
      </S.Footer>
    </S.NotFoundWrapper>
  )
}

export default NotFound
