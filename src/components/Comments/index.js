import React from "react"
import ReactDisqusComments from "react-disqus-comments"

import * as S from "./styled"

const Comments = ({ url, identifier, title }) => {
  return (
    <S.CommentsWrapper itemtype="https://schema.org/Conversation">
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
