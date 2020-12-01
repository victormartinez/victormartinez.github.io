import React from "react"
import PropTypes from "prop-types"

import SocialLinks from "../SocialLinks"

import * as S from "./styled"

const Hero = ({ showBackgroundImage, title, description, social }) => {
  const Wrapper = title ? S.HeroWrapperBg : S.HeroWrapperColor
  return (
    <Wrapper>
      <S.HeroContainer>
        {title && <S.Title>{title}</S.Title>}
        {description && <S.Description>{description}</S.Description>}
        {social && <SocialLinks data={social} />}
      </S.HeroContainer>
    </Wrapper>
  )
}

Hero.propTypes = {
  showBackgroundImage: PropTypes.bool,
  title: PropTypes.string,
  description: PropTypes.string,
  social: PropTypes.object,
}

export default Hero
