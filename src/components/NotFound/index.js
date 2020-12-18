import React from "react"

import { useIntl } from "gatsby-plugin-intl"
import { homeUrl, blogUrl } from "../../utils/routing.js"

import * as S from "./styled"

const NotFound = () => {
  const intl = useIntl()

  return (
    <S.NotFoundWrapper>
      <S.Oops>Oooops!</S.Oops>
      <S.Title>404: {intl.formatMessage({ id: "Not_Found" })}</S.Title>
      <S.Description>
        {intl.formatMessage({ id: "Not_Found_Text" })}
      </S.Description>

      <S.Footer>
        {`${intl.formatMessage({ id: "Not_Found_Nav" })} `}
        <S.Url to={`${homeUrl(intl.locale)}`}>Home</S.Url>
        {` ${intl.formatMessage({ id: "or" })} `}
        <S.Url to={`${blogUrl(intl.locale)}`}>Blog</S.Url>
      </S.Footer>
    </S.NotFoundWrapper>
  )
}

export default NotFound
