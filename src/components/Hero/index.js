import React from "react"
import PropTypes from "prop-types"

import SocialLinks from "../SocialLinks"

import * as S from "./styled"

const Hero = ({ title, description, social }) => {
  return (
    <S.HeroWrapperBg>
      <S.HeroContainer>
        <S.Title>{title}</S.Title>
        <S.Description>{description}</S.Description>
        <SocialLinks data={social} />
      </S.HeroContainer>
    </S.HeroWrapperBg>
  )
}

Hero.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  social: PropTypes.object.isRequired,
}

export default Hero
