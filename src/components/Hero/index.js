import React from "react"
import PropTypes from "prop-types"

import SocialLinks from "../SocialLinks"

import * as S from "./styled"

const Hero = ({ showBackgroundImage, title, description, social }) => {
  const Wrapper = showBackgroundImage ? S.HeroWrapperBg : S.HeroWrapperColor
  return (
    <Wrapper>
      <S.HeroContainer>
        <S.Title>{title}</S.Title>
        <S.Description>{description}</S.Description>
        <SocialLinks
          twitter={social.twitter}
          linkedin={social.linkedin}
          github={social.github}
        />
      </S.HeroContainer>
    </Wrapper>
  )
}

Hero.propTypes = {
  showBackgroundImage: PropTypes.bool,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  social: PropTypes.object.isRequired,
}

export default Hero
