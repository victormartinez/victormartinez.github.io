import React from "react"

import { useIntl } from "gatsby-plugin-intl"
import { formatDate } from "../../utils/date"
import * as S from "./styled"

const PostItem = ({
  path,
  category,
  date,
  timeToRead,
  title,
  image,
}) => {
  const intl = useIntl()

  return (
    <S.PostItemWrapper>
      <S.ImageSection>
        <S.PostLink to={path}>
          {image && <S.Image fluid={image?.childImageSharp.fluid} />}
        </S.PostLink>
      </S.ImageSection>
      <S.TextSection>
        <S.Header>
          <S.Title>
            <S.PostLink to={path}>{title}</S.PostLink>
          </S.Title>
          <S.Metadata>
            <S.Date>{formatDate(date, intl.locale)}</S.Date>
            <S.Bullet> •</S.Bullet>
            <S.ReadingTime>
              {timeToRead} min {intl.formatMessage({ id: "reading" })}
            </S.ReadingTime>
            <S.Bullet>•</S.Bullet>
            <S.Category>{category}</S.Category>
          </S.Metadata>
        </S.Header>
      </S.TextSection>
    </S.PostItemWrapper>
  )
}

export default PostItem
