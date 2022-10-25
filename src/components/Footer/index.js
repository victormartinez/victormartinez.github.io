import React from "react"
import PropTypes from "prop-types"

import SocialLinks from "../SocialLinks"
import * as S from "./styled"

const Footer = ({ social }) => {
  return (
    <S.FooterWrapper>
      <S.Footer>
        <S.Copyright>
          Copyright © {new Date().getFullYear()} Victor Martinez
        </S.Copyright>
        {social && <SocialLinks data={social} />}
      </S.Footer>
    </S.FooterWrapper>
  )
}

Footer.propTypes = {
  social: PropTypes.object,
}

export default Footer
