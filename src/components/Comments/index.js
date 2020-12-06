import React from "react"
import ReactDisqusComments from "react-disqus-comments"

import * as S from "./styled"

const Comments = ({ url, title }) => {
  return (
    <S.CommentsWrapper>
      <S.CommentsTitle>Comments</S.CommentsTitle>

      <ReactDisqusComments
        shortname="vcrmartinez"
        identifier={url}
        title={title}
        url={url}
      />
    </S.CommentsWrapper>
  )
}

export default Comments
