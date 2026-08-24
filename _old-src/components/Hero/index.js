import React from "react"
import PropTypes from "prop-types"

import * as S from "./styled"

const Hero = ({ title, description, subdescription, children }) => {
  return (
    <S.HeroWrapperBg>
      <S.HeroContainer>
        <S.Title>{title}</S.Title>
        <S.Description>{description}</S.Description>
        {subdescription 
          && 
          <S.SubDescription>{subdescription}</S.SubDescription>
        }
        {children}
      </S.HeroContainer>
    </S.HeroWrapperBg>
  )
}

Hero.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  children: PropTypes.object.isRequired,
}

export default Hero
