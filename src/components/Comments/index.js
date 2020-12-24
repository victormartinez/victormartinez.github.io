import React from "react"
import ReactDisqusComments from "react-disqus-comments"

import { useIntl } from "gatsby-plugin-intl"

import * as S from "./styled"

const Comments = ({ url, identifier, title }) => {
  const intl = useIntl()
  return (
    <S.CommentsWrapper itemtype="https://schema.org/Conversation">
      <S.CommentsTitle>
        {intl.formatMessage({ id: "Comments" })}
      </S.CommentsTitle>

      <ReactDisqusComments
        shortname="vcrmartinez"
        identifier={identifier}
        title={title}
        url={url}
      />
    </S.CommentsWrapper>
  )
}

export default Comments
