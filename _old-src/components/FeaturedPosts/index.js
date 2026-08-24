import React from "react"

import { useIntl } from "gatsby-plugin-intl"
import { formatDate } from "../../utils/date"
import * as S from "./styled"

const FeaturedPosts = ({ posts }) => {
  const intl = useIntl()

  const postItems = posts.map(p => (
    <S.PostItemFeaturedWrapper key={p.path}>
      <S.ImageSection>
        <S.PostLink to={p.path}>
          {p.image && <S.Image fluid={p.image?.childImageSharp.fluid} />}
        </S.PostLink>
      </S.ImageSection>
      <S.TextSection>
        <S.Header>
          <S.Title>
            <S.PostLink to={p.path}>{p.title}</S.PostLink>
          </S.Title>

          <S.Metadata>
            <S.Date>{formatDate(p.date, intl.locale)}</S.Date>
            <S.Bullet>•</S.Bullet>
            <S.ReadingTime>
              {p.timeToRead} min {intl.formatMessage({ id: "reading" })}
            </S.ReadingTime>
            <S.Bullet>•</S.Bullet>
            <S.Category>{p.category}</S.Category>
          </S.Metadata>
        </S.Header>
      </S.TextSection>
    </S.PostItemFeaturedWrapper>
  ));

  return <S.FeaturedPostsRow>{postItems}</S.FeaturedPostsRow>
}


export default FeaturedPosts;
