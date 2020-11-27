import React from "react"

import { GithubWithCircle as Github } from "@styled-icons/entypo-social/GithubWithCircle"
import { TwitterWithCircle as Twitter } from "@styled-icons/entypo-social/TwitterWithCircle"
import { LinkedinWithCircle as Linkedin } from "@styled-icons/entypo-social/LinkedinWithCircle"

import * as S from "./styled"

const SocialLinks = () => {
  const socialIcons = [
    {
      url: "https://twitter.com/vcrmartinez",
      element: Twitter,
      label: "Twitter",
    },
    {
      url: "https://linkedin.com/in/vcrmartinez",
      element: Linkedin,
      label: "Linkedin",
    },
    {
      url: "https://github.com/victormartinez",
      element: Github,
      label: "Github",
    },
  ]

  return (
    <S.SocialWrapper>
      <S.SocialItemList>
        {socialIcons.map((social, i) => {
          const Element = social.element
          return (
            <S.SocialItem key={i}>
              <S.SocialItemLink
                href={social.url}
                title={social.label}
                target="_blank"
                rel="noopener noreferrer"
              >
                <S.IconWrapper>
                  <Element />
                </S.IconWrapper>
              </S.SocialItemLink>
            </S.SocialItem>
          )
        })}
      </S.SocialItemList>
    </S.SocialWrapper>
  )
}

export default SocialLinks
