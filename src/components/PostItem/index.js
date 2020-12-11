import React from "react"

import { useIntl } from "gatsby-plugin-intl"

import * as S from "./styled"

const PostItem = ({
  path,
  image,
  category,
  date,
  timeToRead,
  title,
  description,
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
            <S.Date>{date}</S.Date>
            <S.Bullet>•</S.Bullet>
            <S.ReadingTime>
              {timeToRead} min {intl.formatMessage({ id: "reading" })}
            </S.ReadingTime>
          </S.Metadata>
          <S.Description>{description}</S.Description>
        </S.Header>
        <S.Footer>
          <S.FooterItem>{category}</S.FooterItem>
        </S.Footer>
      </S.TextSection>
    </S.PostItemWrapper>
  )
}

export default PostItem
