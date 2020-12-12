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

  ${media.lessThan("medium")`
    padding: 2em 1em;
  `}
`

export const PaginationPrevious = styled.div`
  width: 6em;
  text-align: left;
`

export const PaginationNext = styled.div`
  width: 6em;
  text-align: right;
`

export const PaginationPage = styled.div`
  width: 3em;
`

export const PaginationLink = styled(Link)`
  height: 1em;
  width: 6em;
`

export const PaginationText = styled.p``
