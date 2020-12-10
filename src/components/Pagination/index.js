import React from "react"

import propTypes from "prop-types"
import { useIntl } from "gatsby-plugin-intl"

import * as S from "./styled"

const Pagination = ({
  isFirst,
  isLast,
  currentPage,
  numPages,
  prevPage,
  nextPage,
}) => {
  const intl = useIntl()

  return (
    <S.PaginationWrapper>
      <S.PaginationLink to={isFirst ? "#" : prevPage}>
        {isFirst ? null : `← ${intl.formatMessage({ id: "Previous" })}`}
      </S.PaginationLink>
      <S.PaginationText>
        {currentPage} {intl.formatMessage({ id: "of" })} {numPages}
      </S.PaginationText>
      <S.PaginationLink to={isLast ? "#" : nextPage}>
        {isLast ? null : `→ ${intl.formatMessage({ id: "Next" })}`}
      </S.PaginationLink>
    </S.PaginationWrapper>
  )
}

Pagination.propTypes = {
  isFirst: propTypes.bool.isRequired,
  isLast: propTypes.bool.isRequired,
  currentPage: propTypes.number.isRequired,
  numPages: propTypes.number.isRequired,
  prevPage: propTypes.string,
  nextPage: propTypes.string,
}

export default Pagination
