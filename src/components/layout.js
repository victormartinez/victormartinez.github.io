import React from "react"
import { Link } from "gatsby"

import Hero from "./Hero"
import TopBar from "./TopBar"
import Footer from "./Footer"

import * as S from "./MainWrapper/styled"

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath

  return (
    <>
      <TopBar />
      <Hero showBackgroundImage={isRootPath} />
      <S.MainWrapper>{children}</S.MainWrapper>
      <Footer />
    </>
  )

  // let header

  // if (isRootPath) {
  //   header = (
  //     <h1 className="main-heading">
  //       <Link to="/">{title}</Link>
  //     </h1>
  //   )
  // } else {
  //   header = (
  //     <Link className="header-link-home" to="/">
  //       {title}
  //     </Link>
  //   )
  // }
  // <div className="global-wrapper" data-is-root-path={isRootPath}>

  //   <header className="global-header">{header}</header>
  //   <main>{children}</main>
  //   <footer>
  //     © {new Date().getFullYear()}, Built with
  //     {` `}
  //     <a href="https://www.gatsbyjs.com">Gatsby</a>
  //   </footer>
  // </div>
}

export default Layout
