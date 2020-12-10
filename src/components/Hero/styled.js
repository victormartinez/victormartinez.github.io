import styled from "styled-components"

export const HeroWrapperBg = styled.div`
  display: flex;
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url("https://images.unsplash.com/photo-1510519138101-570d1dca3d66?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1931&q=80");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 90vh;
`

export const HeroContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  width: 100%;
  text-align: center;
`

export const Title = styled.h1`
  margin-bottom: 0.5em;
  color: #fff;
  font-size: 4rem;
`
export const Description = styled.p`
  color: #fff;
  font-size: 1.5rem;
  margin: 0 auto;
  width: 30em;
  line-height: 1.5;
  text-align: center;
`
