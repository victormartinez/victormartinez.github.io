import React from "react"

import propTypes from "prop-types"

import * as S from "./styled"

const Pagination = ({
  isFirst,
  isLast,
  currentPage,
  numPages,
  prevPage,
  nextPage,
}) => {
  return (
    <S.PaginationWrapper>
      <S.PaginationLink to={isFirst ? null : prevPage}>
        {isFirst ? null : `← Previous`}
      </S.PaginationLink>

      <S.PaginationText>
        {currentPage} of {numPages}
      </S.PaginationText>

      <S.PaginationLink to={isLast ? null : nextPage}>
        {isLast ? null : `→ Next`}
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
