import React from "react"

import * as S from "./styled"

const TalkItem = ({
  title,
  date,
  image,
  slides,
  event,
  where,
  video,
  website,
}) => {
  return (
    <S.TalkItemWrapper>
      <S.ImageSection>
        {image && <S.Image fluid={image?.childImageSharp.fluid} />}
      </S.ImageSection>
      <S.TextSection>
        <S.Header>
          <S.Title>{title}</S.Title>
        </S.Header>
        <S.BodyItems>
          <S.Item>
            Evento: 
            {
              website && 
              <S.Url to={website} target="_blank" rel="noopener noreferrer"> {event}</S.Url>
            }
            { !website && event }
          </S.Item>
          <S.Item>Quando: { new Date(date).toLocaleString().slice(0, 10) }</S.Item>
          <S.Item>Onde: {where}</S.Item>
          {slides && <S.Item><S.Url to={slides} target="_blank" rel="noopener noreferrer"> Slides</S.Url></S.Item>}
          {video && <S.Item><S.Url to={video} target="_blank" rel="noopener noreferrer"> Video</S.Url></S.Item>}
        </S.BodyItems>
      </S.TextSection>
    </S.TalkItemWrapper>
  )
}

export default TalkItem
