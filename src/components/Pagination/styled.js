import styled from "styled-components"
import media from "styled-media-query"
import { Link } from "gatsby"

export const PaginationWrapper = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 3rem;
  font-weight: 900;
  padding: 2em 0;
  height: 2em;
  font-size: 1.1rem;

  ${media.lessThan("small")`
    padding: 2em 1em;
  `}
`

export const PaginationLink = styled(Link)`
  height: 1em;
  width: 3.625em;
`

export const PaginationText = styled.p``
