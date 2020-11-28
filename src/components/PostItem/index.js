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
      {/* {slug} */}
      <S.ImageSection>
        {/* <S.ImageLink> */}
        <S.Image src={"/assets/thumbs/thumb.jpg"}></S.Image>
        {/* </S.ImageLink> */}
      </S.ImageSection>
      <S.TextSection>
        <S.Header>
          <S.Title>{title}</S.Title>
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
