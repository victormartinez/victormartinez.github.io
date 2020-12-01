import React from "react"

import * as S from "./styled"

const ArticleNav = ({ previous, next }) => {
  return (
    <S.Nav>
      <S.NavTitle>Recent posts:</S.NavTitle>
      <S.LinksWrapper>
        {previous && (
          <S.NavItem>
            <S.NavLink to={previous.fields.slug} rel="prev">
              ← {previous.frontmatter.title}
            </S.NavLink>
          </S.NavItem>
        )}
        {next && (
          <S.NavItem>
            <S.NavLink to={next.fields.slug} rel="next">
              {next.frontmatter.title} →
            </S.NavLink>
          </S.NavItem>
        )}
      </S.LinksWrapper>
    </S.Nav>
  )
}

export default ArticleNav
