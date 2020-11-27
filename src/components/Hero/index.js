import React from "react"
import PropTypes from "prop-types"

import * as S from "./styled"

const Hero = ({ showBackgroundImage }) => {
  const Wrapper = showBackgroundImage ? S.HeroWrapperBg : S.HeroWrapperColor
  return (
    <Wrapper>
      <S.HeroContainer>
        <S.Title>Hi, I'm Victor.</S.Title>
        <S.Description>I'm a backend developer.</S.Description>
      </S.HeroContainer>
    </Wrapper>
  )
}

Hero.propTypes = {
  showBackgroundImage: PropTypes.bool,
}

export default Hero
