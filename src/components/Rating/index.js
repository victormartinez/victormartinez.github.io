import React from "react"

import { StarFill } from "@styled-icons/bootstrap/StarFill"
import { StarHalf } from "@styled-icons/bootstrap/StarHalf"

import * as S from "./styled"

const Rating = ({ value }) => {
  const renderFillStars = () => {
    const stars = []
    for (let i = 1; i <= value; i++) {
      stars.push(
        <S.RatingItem key={i}>
          <StarFill />
        </S.RatingItem>
      )
    }
    return stars
  }

  const renderStarHalfStar = () => {
    const render = `${value}`.split(".").length > 1
    return (
      render && (
        <S.RatingItem>
          <StarHalf />
        </S.RatingItem>
      )
    )
  }
  return (
    <S.RatingWrapper>
      <S.RatingLabel>Rating:</S.RatingLabel>
      <S.RatingList>
        {renderFillStars()}
        {renderStarHalfStar()}
      </S.RatingList>
    </S.RatingWrapper>
  )
}

export default Rating
