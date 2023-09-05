import React from "react"
import PropTypes from "prop-types"

import { useIntl } from "gatsby-plugin-intl"

import * as S from "./styled"

const ImageCredits = ({ url, author }) => {
  const intl = useIntl()
  const hasCopyright = author && url
  return (
    hasCopyright && (
      <S.CreditsWrapper>
        <S.Text>
          {intl.formatMessage({ id: "Featured_image_credits" })}:{" "}
        </S.Text>
        <S.Url
          title={author}
          target="_blank"
          rel="noopener noreferrer"
          href={url}
        >
          {author}
        </S.Url>
      </S.CreditsWrapper>
    )
  )
}

ImageCredits.propTypes = {
  image_url: PropTypes.string,
  image_author: PropTypes.string,
}

export default ImageCredits
