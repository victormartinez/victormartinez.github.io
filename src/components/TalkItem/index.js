import React from "react"

import { LocationPin } from "@styled-icons/entypo/LocationPin"
import { Calendar } from "@styled-icons/boxicons-regular/Calendar"
import { Slideshow } from "@styled-icons/boxicons-regular/Slideshow"
import { Youtube } from "@styled-icons/boxicons-logos/Youtube"
import { Globe } from "@styled-icons/bootstrap/Globe"

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
        <S.Url to={slides} target="_blank" rel="noopener noreferrer">
          {image && <S.Image fluid={image?.childImageSharp.fluid} />}
        </S.Url>
      </S.ImageSection>
      <S.TextSection>
        <S.Header>
          <S.Title>
            <S.Url to={slides} target="_blank" rel="noopener noreferrer">
              {title}
            </S.Url>
          </S.Title>
        </S.Header>
        <S.BodyItems>
          <S.Item>
            <Globe />
            {website && (
              <S.Url to={website} target="_blank" rel="noopener noreferrer">
                {event}
              </S.Url>
            )}
            {!website && event}
          </S.Item>
          <S.Item>
            <Slideshow />
            <S.Url to={slides} target="_blank" rel="noopener noreferrer">
              Slides
            </S.Url>
          </S.Item>
          <S.Item>
            <LocationPin />
            {where}
          </S.Item>
          <S.Item>
            <Calendar />
            {date}
          </S.Item>
          {video && (
            <S.Item>
              <Youtube />
              <S.Url to={video} target="_blank" rel="noopener noreferrer">
                Video
              </S.Url>
            </S.Item>
          )}
        </S.BodyItems>
      </S.TextSection>
    </S.TalkItemWrapper>
  )
}

export default TalkItem
