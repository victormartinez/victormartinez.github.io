import React from "react"

import * as S from "./styled"

const PostItem = ({
  slug,
  image,
  category,
  date,
  timeToRead,
  title,
  description,
}) => {
  return (
    <S.PostItemWrapper>
      <S.ImageSection>
        <S.PostLink to={slug}>
          {image && <S.Image fluid={image?.childImageSharp.fluid} />}
        </S.PostLink>
      </S.ImageSection>
      <S.TextSection>
        <S.Header>
          <S.Title>
            <S.PostLink to={slug}>{title}</S.PostLink>
          </S.Title>
          <S.Description>{description}</S.Description>
        </S.Header>
        <S.Footer>
          <S.FooterItem>{date}</S.FooterItem>
          <S.FooterItem>•</S.FooterItem>
          <S.FooterItem>{category}</S.FooterItem>
          <S.FooterItem>•</S.FooterItem>
          <S.FooterItem>{timeToRead} min reading</S.FooterItem>
        </S.Footer>
      </S.TextSection>
    </S.PostItemWrapper>
  )
}

export default PostItem
